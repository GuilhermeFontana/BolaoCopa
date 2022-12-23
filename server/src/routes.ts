import { FastifyInstance } from "fastify"
import { guessRoutes } from "./routes/guessRoutes"
import { pollRoutes } from "./routes/pollRoutes"
import { userRoutes } from "./routes/userRoutes"

/**
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function routes(fastify: FastifyInstance, options: Object) {
    fastify.register(guessRoutes)
    fastify.register(pollRoutes)
    fastify.register(userRoutes)    
}