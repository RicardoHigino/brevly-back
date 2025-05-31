import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeRight } from "@/infra/shared/either"
import { eq } from "drizzle-orm"


export const deleteLink = async (id: string) => {
  const link = await db
    .delete(schema.encurtedLinks)
    .where(eq(schema.encurtedLinks.id, id))

  return makeRight(link as any)
}