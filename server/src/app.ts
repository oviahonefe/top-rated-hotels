import { createRequire } from "node:module";
import type { RequestHandler } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import type { Options as PinoHttpOptions } from "pino-http";

import { getDatabaseStatus } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { propertyRouter } from "./modules/properties/property.routes.js";
import { publicPropertyRouter } from "./modules/properties/public-property.routes.js";
import {
  errorHandler,
  notFoundHandler
} from "./middleware/error-handler.js";

const require = createRequire(import.meta.url);

const pinoHttp = require("pino-http") as (
  options?: PinoHttpOptions
) => RequestHandler;

export const app = express();

const allowedOrigins = [env.CLIENT_ORIGIN, env.ADMIN_ORIGIN];

app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    autoLogging: env.NODE_ENV !== "test"
  })
);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.use(compression());
app.use(hpp());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/properties", publicPropertyRouter);
app.use("/api/v1/admin/properties", propertyRouter);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "top-rated-hotels-api",
    environment: env.NODE_ENV,
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);