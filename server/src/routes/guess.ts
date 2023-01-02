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
export async function guessRoutes(fastify: FastifyInstance, options: Object) {
  fastify.get("/guesses/count", async () => {
    return {
      count: await prisma.guess.count(),
    };
  });

  fastify.post(
    "/poll/:pollId/game/:gameId/guess",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });
      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant)
        return reply
          .status(400)
          .send({ message: "Você não esta participando deste bolão." });

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            gameId,
            participantId: participant.id,
          },
        },
      });

      if (guess)
        return reply.status(400).send({
          massage: "Você já enviou um palpite para este jogo.",
        });

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game)
        return reply.status(400).send({
          massage: "Jogo não encontrado.",
        });

      if (game.date <= new Date())
        return reply.status(400).send({
          massage:
            "Você não pode enviar um palpite para um jogo que já aconteceu.",
        });

      return await prisma.guess
        .create({
          data: {
            gameId,
            participantId: participant.id,
            firstTeamPoints,
            secondTeamPoints,
          },
        })
        .then(() => {
          return reply.status(201).send();
        })
        .catch((err) => {
          return err;
        });
    }
  );
}
