import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeLeft, makeRight } from "@/infra/shared/either"
import { eq } from "drizzle-orm"

export const getLinkByShortUrl = async (shortUrl: string) => {
  const link = await db
    .select()
    .from(schema.encurtedLinks)
    .where(eq(schema.encurtedLinks.shortUrl, shortUrl))

  if (link.length === 0) {
    return makeLeft(new Error('Link not found'))
  }

  return makeRight(link[0] as any)
}