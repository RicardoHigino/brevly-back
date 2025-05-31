import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { exportCsv } from "@/app/functions/export-csv";
import { z } from "zod";
import { unwrapEither } from "@/infra/shared/either";

export const exportCsvRoute: FastifyPluginAsyncZod = async server => {
  server.get('/export-csv', {
    schema: {
      summary: 'Export CSV',
      description: 'Export CSV',
      tags: ['Link'],
    },
  }, async (request, reply) => {
    const links = await exportCsv()

    const csv = unwrapEither(links) as string

    return reply.status(200).send(csv)
  })
}