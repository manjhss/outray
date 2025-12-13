import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const tunnels = pgTable(
  "tunnels",
  {
    id: text("id").primaryKey(),
    subdomain: text("subdomain").notNull().unique(),
    name: text("name"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("tunnels_userId_idx").on(table.userId)],
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("api_keys_userId_idx").on(table.userId)],
);

export const tunnelsRelations = relations(tunnels, ({ one }) => ({
  user: one(users, {
    fields: [tunnels.userId],
    references: [users.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const usersAppRelations = relations(users, ({ many }) => ({
  tunnels: many(tunnels),
  apiKeys: many(apiKeys),
}));
