import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
