import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "teacher"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
