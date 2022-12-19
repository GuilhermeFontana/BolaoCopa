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
export async function userRoutes(fastify: FastifyInstance, options: Object) {

    fastify.get('/users/count', async () => {
        return {
            count: await prisma.user.count()
        }
    })

}