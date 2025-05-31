import { env } from "@/env"
import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeLeft, makeRight } from "@/infra/shared/either"
import { eq } from "drizzle-orm"
import z from "zod"

const requestInput = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string().max(30).min(2),
})

type CreateLinkInput = z.input<typeof requestInput>

export const createLink = async (input: CreateLinkInput) => {
  let { originalUrl, shortUrl } = requestInput.parse(input)

  let isShortUrlValid = shortUrl.startsWith(env.APP_URL)

  if (!isShortUrlValid) {
    shortUrl = `${env.APP_URL}/${shortUrl.replace(/^\//, '')}`
  }

  const alreadyExists = await db.select().from(schema.encurtedLinks).where(eq(schema.encurtedLinks.shortUrl, shortUrl)).limit(1)

  if (alreadyExists.length > 0) {
    return makeLeft(new Error('URL encurtada já existe'))
  }

  const link = await db
    .insert(schema.encurtedLinks)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning()

  return makeRight({
    shortUrl: link[0].shortUrl,
  })
}