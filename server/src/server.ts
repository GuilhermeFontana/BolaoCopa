import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import * as dotenv from "dotenv";
dotenv.config();
import { routes } from "./routes";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  const { SECRETE } = process.env;
  if (!SECRETE)
    throw new Error(`Variável de ambiente: "SECRETE" não encontrada`);

  await fastify.register(jwt, {
    secret: SECRETE,
  });

  fastify.register(routes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
