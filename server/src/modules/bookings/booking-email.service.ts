import nodemailer from "nodemailer";

import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import type { Booking } from "./booking.model.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(value);
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function bookingSummary(booking: Booking) {
  return `
    <p><strong>Booking reference:</strong> ${escapeHtml(
      booking.bookingReference,
    )}</p>
    <p><strong>Property:</strong> ${escapeHtml(
      booking.propertyName,
    )}</p>
    <p><strong>Location:</strong> ${escapeHtml(
      booking.propertyLocation,
    )}</p>
    <p><strong>Check-in:</strong> ${formatDate(
      booking.checkInDate,
    )}</p>
    <p><strong>Check-out:</strong> ${formatDate(
      booking.checkOutDate,
    )}</p>
    <p><strong>Total:</strong> ${formatMoney(
      booking.price.totalCents,
    )}</p>
  `;
}

export async function sendBookingConfirmedEmail(
  booking: Booking,
) {
  try {
    await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: booking.guest.email,
      subject: `Booking confirmed — ${booking.bookingReference}`,
      text: [
        `Hello ${booking.guest.firstName},`,
        "",
        "Your booking has been confirmed.",
        `Booking reference: ${booking.bookingReference}`,
        `Property: ${booking.propertyName}`,
        `Location: ${booking.propertyLocation}`,
        `Check-in: ${formatDate(booking.checkInDate)}`,
        `Check-out: ${formatDate(booking.checkOutDate)}`,
        `Total: ${formatMoney(booking.price.totalCents)}`,
      ].join("\n"),
      html: `
        <main style="font-family:Arial,sans-serif;color:#172033;line-height:1.6">
          <h1>Your booking is confirmed</h1>
          <p>Hello ${escapeHtml(booking.guest.firstName)},</p>
          <p>Your payment has been verified and your booking is confirmed.</p>
          ${bookingSummary(booking)}
        </main>
      `,
    });
  } catch (error) {
    logger.error(
      {
        error,
        bookingReference: booking.bookingReference,
      },
      "Unable to send booking confirmation email",
    );
  }
}

export async function sendBookingCancelledEmail(
  booking: Booking,
) {
  try {
    await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: booking.guest.email,
      subject: `Booking cancelled — ${booking.bookingReference}`,
      text: [
        `Hello ${booking.guest.firstName},`,
        "",
        "Your booking has been cancelled.",
        `Booking reference: ${booking.bookingReference}`,
        `Property: ${booking.propertyName}`,
      ].join("\n"),
      html: `
        <main style="font-family:Arial,sans-serif;color:#172033;line-height:1.6">
          <h1>Your booking was cancelled</h1>
          <p>Hello ${escapeHtml(booking.guest.firstName)},</p>
          <p>Your booking has been cancelled. Reserved inventory has been released.</p>
          ${bookingSummary(booking)}
        </main>
      `,
    });
  } catch (error) {
    logger.error(
      {
        error,
        bookingReference: booking.bookingReference,
      },
      "Unable to send booking cancellation email",
    );
  }
}