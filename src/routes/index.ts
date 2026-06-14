import type { FastifyInstance } from "fastify";
import { parkingRoutes } from "./parkingRoutes";

export async function router(app: FastifyInstance) {
  app.register(parkingRoutes, { prefix: "/parking" });
}
