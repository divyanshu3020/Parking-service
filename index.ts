import { createApp } from "./src/app";
import { config } from "./src/config/env";

async function start() {
  try {
    const app = await createApp();

    await app.listen({ port: config.port, host: "0.0.0.0" });

    console.log(
      `✅ Parking Service running on http://localhost:${config.port}`,
    );
    console.log(`📍 API Prefix: ${config.apiPrefix}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
