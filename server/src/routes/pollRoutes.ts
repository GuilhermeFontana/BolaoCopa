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
export async function pollRoutes(fastify: FastifyInstance, options: Object) {

    fastify.get('/polls/count', async () => {
        return {
            count: await prisma.poll.count()
        }
    })

    fastify.post('/poll', async (request, reply) => {
        const cratePollBody = z.object({
            title: z.string()
        })

        const { title } = cratePollBody.parse(request.body)
        const code = String(new ShortUniqueId({ length: 6 })()).toUpperCase();

        await prisma.poll.create({
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