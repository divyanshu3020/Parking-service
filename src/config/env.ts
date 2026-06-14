export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4001,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: (
    process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001"
  ).split(","),
  apiPrefix: process.env.API_PREFIX || "/api",

  // Development
  isDevelopment: process.env.NODE_ENV !== "production",
};
