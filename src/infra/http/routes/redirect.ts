import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getLinkByShortUrl } from "@/app/functions/get-link-by-short-url";
import { redirectCount } from "@/app/functions/redirect-count";
import { z } from "zod";

export const redirectRoute: FastifyPluginAsyncZod = async server => {
  server.get('/:shortUrl', {
    schema: {
      summary: 'Redirect to the original URL',
      description: 'Redirect to the original URL',
      tags: ['Link'],
      response: {
        200: z.object({
          url: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string }
    const queryShortUrl = `${process.env.APP_URL}/${shortUrl}`
    const link = await getLinkByShortUrl(queryShortUrl)

    if (link.left) {
      return reply.status(404).send({
        message: 'Link not found',
      })
    }

    await redirectCount(shortUrl)

    const query = request.query as { ref?: string }
    if (query.ref == "app") {
      return reply.status(200).send({
        url: link.right.originalUrl,
      })
    }

    return reply.redirect(link.right.originalUrl)
  })
}