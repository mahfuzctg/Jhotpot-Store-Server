/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";

import config from "./app/config";
import { seedSuperAdmin } from "./app/config/utils/seed";

async function main() {
  await seedSuperAdmin();
  const server: Server = app.listen(config.port, () => {
    console.log(`🚀 App is running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
