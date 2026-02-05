import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Health data tables
export const healthData = mysqlTable("healthData", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dataType: varchar("dataType", { length: 50 }).notNull(), // 'hrv', 'sleep', 'heart_rate', 'stress'
  value: text("value").notNull(), // JSON string with data
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  source: varchar("source", { length: 100 }), // 'apple_health', 'google_fit', 'manual'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthData = typeof healthData.$inferSelect;
export type InsertHealthData = typeof healthData.$inferInsert;

// Lab results
export const labResults = mysqlTable("labResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  testName: varchar("testName", { length: 255 }).notNull(),
  results: text("results").notNull(), // JSON string with extracted data
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LabResult = typeof labResults.$inferSelect;
export type InsertLabResult = typeof labResults.$inferInsert;

// AI Insights
export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  energyLevel: int("energyLevel"), // 0-100
  stressLevel: int("stressLevel"), // 0-100
  healthScore: int("healthScore"), // 0-100
  analysis: text("analysis"), // AI-generated analysis
  recommendations: text("recommendations"), // JSON array of recommendations
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;
