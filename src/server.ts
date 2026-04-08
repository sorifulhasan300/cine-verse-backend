import { Server } from "http";
import app from "./app";

// import { seedSuperAdmin } from "./app/utils/seed";
// import { envVars } from "./config/config";

let server: Server;

async function bootstrap() {
  try {
    // await seedSuperAdmin();
    server = app.listen(5000, () => {
      console.log(`-----------------------------------------`);
      console.log(`🚀 CineVerse Server is running at:`);
      console.log(`🔗 http://localhost:5000`);
      console.log(`-----------------------------------------`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }

  // --- Unhandled Rejection
  process.on("unhandledRejection", (error) => {
    console.log("⚠️ Unhandled Rejection detected! Shutting down...");
    if (server) {
      server.close(() => {
        console.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  // --- Uncaught Exception-
  process.on("uncaughtException", (error) => {
    console.log("🔴 Uncaught Exception detected! Shutting down...");
    console.error(error);
    process.exit(1);
  });
}

// --- Graceful Shutdown (SIGINT & SIGTERM) ---
const exitHandler = () => {
  if (server) {
    console.log("⏳ Closing server gracefully...");
    server.close(() => {
      console.log("✅ Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);

bootstrap();
