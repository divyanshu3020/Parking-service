import fastify from "fastify";
import cors from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { config } from "./config/env";
import { router } from "./routes/index";

export async function createApp() {
  const app = fastify({
    logger: config.isDevelopment,
  });

  // Setup Zod type providers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register CORS
  await app.register(cors, {
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  // Custom 404 handler
  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      success: false,
      message: `Route ${request.method}:${request.url} not found`,
      code: "ROUTE_NOT_FOUND",
    });
  });

  // Central error handler
  app.setErrorHandler((error: any, request, reply) => {
    request.log.error(error);

    if (error.validation) {
      const details = error.validation.map((issue: any) => {
        const field = issue.instancePath
          ? issue.instancePath.replace(/^\//, "").replace(/\//g, ".")
          : issue.path
          ? issue.path.join(".")
          : "body";
        return {
          field: field || "body",
          message: issue.message || "Invalid value",
        };
      });

      return reply.status(400).send({
        success: false,
        message: error.message || "Invalid request data",
        code: error.code || "VALIDATION_ERROR",
        details,
      });
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

    return reply.status(statusCode).send({
      success: false,
      message:
        statusCode === 500
          ? "Internal server error"
          : error.message || "Unexpected error",
      code: error.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "UNKNOWN_ERROR"),
    });
  });

  // Health check route
  app.get("/health", async (request, reply) => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "parking-service",
    };
  });

  // API routes
  await app.register(router, { prefix: config.apiPrefix });

  return app;
}
