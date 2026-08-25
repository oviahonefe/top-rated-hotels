import nodemailer from "nodemailer";

import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

function emailLayout(title: string, message: string, code: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#10244d">
      <h1 style="margin:0 0 16px;color:#0f6bff">${title}</h1>
      <p style="font-size:16px;line-height:1.6">${message}</p>
      <div style="margin:28px 0;padding:18px;text-align:center;background:#f4f7fc;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:8px;color:#071633">
        ${code}
      </div>
      <p style="font-size:14px;line-height:1.6;color:#6f7f9d">
        This code expires in 10 minutes. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

async function sendEmail(
  recipient: string,
  subject: string,
  html: string
) {
  const result = await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: recipient,
    subject,
    html
  });

  logger.info(
    {
      recipient,
      messageId: result.messageId
    },
    "Email sent"
  );
}

export async function sendVerificationOtp(
  email: string,
  firstName: string,
  otp: string
) {
  await sendEmail(
    email,
    "Verify your Top Rated Hotels account",
    emailLayout(
      `Welcome, ${firstName}`,
      "Use this verification code to activate your Top Rated Hotels account.",
      otp
    )
  );
}

export async function sendPasswordResetOtp(
  email: string,
  firstName: string,
  otp: string
) {
  await sendEmail(
    email,
    "Reset your Top Rated Hotels password",
    emailLayout(
      `Hello, ${firstName}`,
      "Use this code to reset your Top Rated Hotels password.",
      otp
    )
  );
}