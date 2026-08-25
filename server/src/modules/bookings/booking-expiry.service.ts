import cron from "node-cron";
import mongoose from "mongoose";

import { logger } from "../../config/logger.js";
import { releaseInventory } from "../availability/availability.service.js";
import { BookingModel } from "./booking.model.js";

let isRunning = false;

export async function expirePendingBookings() {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    const candidates = await BookingModel.find({
      status: "pending",
      "payment.status": {
        $in: ["awaiting_payment", "rejected"],
      },
      paymentDueAt: {
        $lte: new Date(),
      },
    })
      .sort({ paymentDueAt: 1 })
      .limit(100);

    let expiredCount = 0;

    for (const candidate of candidates) {
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          const booking = await BookingModel.findOne({
            _id: candidate._id,
            status: "pending",
            "payment.status": {
              $in: ["awaiting_payment", "rejected"],
            },
            paymentDueAt: {
              $lte: new Date(),
            },
          }).session(session);

          if (!booking) {
            return;
          }

          await releaseInventory({
            propertyId: booking.propertyId,
            propertyKind: booking.propertyKind,
            unitKey: booking.unitKey,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            session,
          });

          booking.status = "expired";
          booking.cancellationReason =
            "Payment was not completed before the payment deadline.";

          await booking.save({ session });
          expiredCount += 1;
        });
      } finally {
        await session.endSession();
      }
    }

    if (expiredCount > 0) {
      logger.info(
        { expiredCount },
        "Expired unpaid booking holds",
      );
    }
  } catch (error) {
    logger.error(
      { error },
      "Unable to expire unpaid booking holds",
    );
  } finally {
    isRunning = false;
  }
}

export function startBookingExpiryWorker() {
  void expirePendingBookings();

  return cron.schedule("*/5 * * * *", () => {
    void expirePendingBookings();
  });
}