import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeLeft, makeRight } from "@/infra/shared/either"
import { eq, sql } from "drizzle-orm"

export const redirectCount = async (shortUrl: string) => {  
  let queryShortUrl = shortUrl

  let link = await db.select().from(schema.encurtedLinks).where(eq(schema.encurtedLinks.shortUrl, queryShortUrl)).limit(1)

  if (link.length === 0) {
    queryShortUrl = `${process.env.APP_URL}/${shortUrl}`
    link = await db.select().from(schema.encurtedLinks).where(eq(schema.encurtedLinks.shortUrl, queryShortUrl)).limit(1)
  }

  if (link.length === 0) {
    return makeLeft(new Error('Link not found'))
  }
  await db.update(schema.encurtedLinks).set({
    redirectCount: sql`${schema.encurtedLinks.redirectCount} + 1`,
  }).where(eq(schema.encurtedLinks.shortUrl, queryShortUrl))

  return makeRight(true)
}