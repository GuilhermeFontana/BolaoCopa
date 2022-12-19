import { PrismaClient } from "@prisma/client"
import { FastifyInstance } from "fastify"

const prisma = new PrismaClient({
    log: ["query"]
})

/**
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function guessRoutes(fastify: FastifyInstance, options: Object) {

    fastify.get('/guesses/count', async () => {
        return {
            count: await prisma.guess.count()
        }
    })

}