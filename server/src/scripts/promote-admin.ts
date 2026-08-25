import dns from "node:dns";
import mongoose from "mongoose";

import { env } from "../config/env.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  throw new Error(
    "Usage: npm run admin:promote -- user@example.com",
  );
}

const configuredDnsServers =
  process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean) ?? [];

if (configuredDnsServers.length > 0) {
  dns.setServers(configuredDnsServers);
}

type UserRecord = {
  email: string;
};

type UserModelLike = {
  findOneAndUpdate: (
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options: Record<string, unknown>,
  ) => PromiseLike<UserRecord | null>;
};

const userModule = (await import(
  "../modules/users/user.model.js"
)) as unknown as Record<string, unknown>;

const UserModel = (
  userModule.UserModel ??
  userModule.User ??
  userModule.default
) as UserModelLike | undefined;

if (
  !UserModel ||
  typeof UserModel.findOneAndUpdate !== "function"
) {
  throw new Error(
    "No supported User model export was found.",
  );
}

try {
  await mongoose.connect(env.MONGODB_URI);

  const user = await UserModel.findOneAndUpdate(
    { email },
    { $set: { role: "admin" } },
    { new: true },
  );

  if (!user) {
    throw new Error(
      `No user exists with email: ${email}`,
    );
  }

  console.log(`Admin access granted to ${user.email}.`);
} finally {
  await mongoose.disconnect();
}