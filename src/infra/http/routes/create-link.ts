import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createLink } from "@/app/functions/create-link";
import { z } from "zod";
import { isLeft, unwrapEither } from "@/infra/shared/either";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
    schema: {
      summary: 'Create a new link',
      description: 'Create a new link',
      tags: ['Link'],
      body: z.object({
        originalUrl: z.string().url(),
        shortUrl: z.string().optional(),
      }),
      response: {
        200: z.object({
          shortUrl: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const links = await createLink(request.body as { originalUrl: string, shortUrl: string })

    if (isLeft(links)) {
      return reply.status(400).send({
        message: 'Link encurtado já existe'
      })
    }

    const data = unwrapEither(links) as { shortUrl: string }

    return reply.status(200).send({
      shortUrl: data.shortUrl,
    })
  })
}