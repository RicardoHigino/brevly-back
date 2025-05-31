import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getLinks } from "@/app/functions/get-links";
import z from "zod";

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links', {
    schema: {
      summary: 'Get all links',
      description: 'Get all links',
      tags: ['Link']
    },
  }, async (request, reply) => {
    const links = await getLinks()

    return reply.status(200).send(links.right)
  })
}