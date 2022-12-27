import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

/**
 *
 *
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function gameRoutes(fastify: FastifyInstance, options: Object) {
  fastify.get(
    "/poll/:id/games",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getGamesParams = z.object({
        id: z.string(),
      });

      const { id } = getGamesParams.parse(request.params);

      const games = await prisma.game.findMany({
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                pollId: id,
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return games.map((game) => {
        return {
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined,
        };
      });
    }
  );
}
