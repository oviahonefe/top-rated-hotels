import crypto from "node:crypto";

export function createOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashValue(value: string) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

export function addMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}