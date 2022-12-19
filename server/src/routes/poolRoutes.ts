import { PrismaClient } from "@prisma/client"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import ShortUniqueId from "short-unique-id"

const prisma = new PrismaClient({
    log: ["query"]
})

/**
 * @export
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export async function poolRoutes(fastify: FastifyInstance, options: Object) {

    fastify.get('/pools/count', async () => {
        return {
            count: await prisma.pool.count()
        }
    })

    fastify.post('/pool', async (request, reply) => {
        const cratePoolBody = z.object({
            title: z.string()
        })

        const { title } = cratePoolBody.parse(request.body)
        const code = String(new ShortUniqueId({ length: 6 })()).toUpperCase();

        await prisma.pool.create({
            data: {
                title,
                code: code
            }
        })

        return reply
            .status(201)
            .send({
                code
            })
    })
    
}