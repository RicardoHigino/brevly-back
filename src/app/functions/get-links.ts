import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeRight } from "@/infra/shared/either"
import { desc } from "drizzle-orm"

export const getLinks = async () => {
  const links = await db
    .select({
      id: schema.encurtedLinks.id,
      originalUrl: schema.encurtedLinks.originalUrl,
      shortUrl: schema.encurtedLinks.shortUrl,
      redirectCount: schema.encurtedLinks.redirectCount,
      createdAt: schema.encurtedLinks.createdAt,
      updatedAt: schema.encurtedLinks.updatedAt,
    })
    .from(schema.encurtedLinks)
    .orderBy(desc(schema.encurtedLinks.createdAt))

return makeRight(links as any)
}