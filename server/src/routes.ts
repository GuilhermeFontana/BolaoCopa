import { FastifyInstance } from "fastify"
import { guessRoutes } from "./routes/guessRoutes"
import { poolRoutes } from "./routes/poolRoutes"
import { userRoutes } from "./routes/userRoutes"

/**
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function routes(fastify: FastifyInstance, options: Object) {
    fastify.register(guessRoutes)
    fastify.register(poolRoutes)
    fastify.register(userRoutes)    
}