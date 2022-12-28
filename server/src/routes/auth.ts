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
export async function authRoutes(fastify: FastifyInstance, options: Object) {
  fastify.post("/user", async (request, reply) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });

    const { access_token } = createUserBody.parse(request.body);

    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    ).then(async (response) => {
      const userResponse = await response.json();

      if (userResponse.error) {
        const { code, message } = userResponse.error;
        return reply
          .status(code)
          .send({ message: message.split(".")[0], provider: "Google" });
      }

      const userInfoSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
      });

      return userInfoSchema.parse(userResponse);
    });

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        },
      });
    }

    return {
      token: fastify.jwt.sign(
        {
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        {
          sub: user.id,
          expiresIn: "7 days",
        }
      ),
    };
  });

  fastify.get(
    "/me",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return request.user;
    }
  );
}
