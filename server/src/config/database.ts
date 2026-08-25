import dns from "node:dns";
import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "./logger.js";

const configuredDnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

if (configuredDnsServers?.length) {
  dns.setServers(configuredDnsServers);

  logger.info(
    { servers: configuredDnsServers },
    "Using configured MongoDB DNS servers"
  );
}

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });

  logger.info(
    {
      database: mongoose.connection.name,
      host: mongoose.connection.host
    },
    "MongoDB connected"
  );
}

export function getDatabaseStatus() {
  return mongoose.connection.readyState === 1
    ? "connected"
    : "disconnected";
}