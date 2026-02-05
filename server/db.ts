import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, healthData, InsertHealthData, HealthData, labResults, InsertLabResult, aiInsights, InsertAIInsight } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Health Data Functions
export async function addHealthData(data: InsertHealthData): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(healthData).values(data);
  return (result as any).insertId as number;
}

export async function getUserHealthData(userId: number, dataType?: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(healthData.userId, userId)];
  if (dataType) {
    conditions.push(eq(healthData.dataType, dataType));
  }

  return db
    .select()
    .from(healthData)
    .where(and(...conditions))
    .orderBy(desc(healthData.timestamp))
    .limit(limit);
}

export async function getLatestHealthData(userId: number, dataType: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(healthData)
    .where(and(eq(healthData.userId, userId), eq(healthData.dataType, dataType)))
    .orderBy(desc(healthData.timestamp))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Lab Results Functions
export async function addLabResult(data: InsertLabResult): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(labResults).values(data);
  return (result as any).insertId as number;
}

export async function getUserLabResults(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(labResults)
    .where(eq(labResults.userId, userId))
    .orderBy(desc(labResults.uploadedAt))
    .limit(limit);
}

// AI Insights Functions
export async function addAIInsight(data: InsertAIInsight): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(aiInsights).values(data);
  return (result as any).insertId as number;
}

export async function getLatestAIInsight(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, userId))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserAIInsights(userId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, userId))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(limit);
}
