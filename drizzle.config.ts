import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["lms"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
