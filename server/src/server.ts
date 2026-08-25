import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function startServer() {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT },
      "Top Rated Hotels API is running"
    );
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutting down API");

    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  logger.fatal({ error }, "Unable to start API");
  process.exit(1);
});