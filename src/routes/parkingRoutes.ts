import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "@repo/database";

export async function parkingRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/spots",
    {
      schema: {
        response: {
          200: z.object({
            success: z.boolean(),
            spots: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                status:  z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      // Verify database client can compile and import correctly
      request.log.info(`[parkingRoutes] DB client check: ${!!db}`);

      return {
        success: true,
        spots: [
          { id: "1", name: "Spot A-101", status: "AVAILABLE" },
          { id: "2", name: "Spot A-102", status: "OCCUPIED" },
        ],
      };
    }
  );
}
