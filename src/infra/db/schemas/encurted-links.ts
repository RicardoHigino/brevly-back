import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const encurtedLinks = pgTable('encurted_links', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull(),
  redirectCount: integer('redirect_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})