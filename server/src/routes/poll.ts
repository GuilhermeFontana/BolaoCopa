import { FastifyInstance } from "fastify";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

/**
 *
 *
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function pollRoutes(fastify: FastifyInstance, options: Object) {
  fastify.get("/polls/count", async () => {
    return {
      count: await prisma.poll.count(),
    };
  });

  fastify.post("/poll", async (request, reply) => {
    const cratePollBody = z.object({
      title: z.string(),
    });

    const { title } = cratePollBody.parse(request.body);
    const code = String(new ShortUniqueId({ length: 6 })()).toUpperCase();

    try {
      await request.jwtVerify();

      await prisma.poll.create({
        data: {
          title,
          code: code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch {
      await prisma.poll.create({
        data: {
          title,
          code: code,
        },
      });
    }

    return reply.status(201).send({
      code,
    });
  });

  fastify.get(
    "/polls",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return await prisma.poll.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        where: {
          participants: {
            some: {
              userId: request.user.sub,
            },
          },
        },
      });
    }
  );

  fastify.get(
    "/poll/:id",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      const { id } = getPollParams.parse(request.params);

      return await prisma.poll.findUnique({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        where: {
          id,
        },
      });
    }
  );

  fastify.post(
    "/poll/:code/join",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const JoinPollBody = z.object({
        code: z.string(),
      });

      const { code } = JoinPollBody.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!poll)
        return reply.status(400).send({
          message: "Bolão não encontrado.",
        });

      if (poll.participants.length > 0)
        reply.status(400).send({
          message: "Você já esta participando deste bolão!",
        });

      if (!poll.ownerId) {
        await prisma.poll.update({
          data: {
            ownerId: request.user.sub,
          },
          where: {
            id: poll.id,
          },
        });
      }

      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: request.user.sub,
        },
      });

      return reply.send(201).send();
    }
  );
}
