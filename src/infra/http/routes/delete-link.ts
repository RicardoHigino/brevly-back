import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { deleteLink } from "@/app/functions/delete-link";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete('/links/:id', {
    schema: {
      summary: 'Delete a link',
      description: 'Delete a link',
      tags: ['Link'],
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const links = await deleteLink(id)

    if (links.left) {
      return reply.status(400).send({
        message: 'Link não encontrado',
      })
    }

    return reply.status(200).send({
      message: 'Link deletado',
    })
  })
}