import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const lmsSchema = pgSchema("lms");

// Reference-only: Supabase owns the `auth` schema. This is declared purely so
// other tables can carry a real foreign key to auth.users(id). `drizzle-kit
// generate` will still emit a `CREATE TABLE "auth"."users"` statement for it
// (a known drizzle-kit limitation) — delete that statement from any generated
// migration before running it; the table already exists in Supabase.
const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const roleEnum = lmsSchema.enum("role", ["student", "teacher"]);

export const userRoles = lmsSchema.table("user_roles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }), // Supabase auth user id
  role: roleEnum("role"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const content = lmsSchema.table("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => authUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
