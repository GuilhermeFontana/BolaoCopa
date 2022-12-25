import { FastifyInstance } from "fastify";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";

/**
 *
 *
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function routes(fastify: FastifyInstance, options: Object) {
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);
}
