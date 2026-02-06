import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WearableSyncService, type WearableData } from "../lib/wearable-sync";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("WearableSyncService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should save wearable data to cache", async () => {
    const mockData: WearableData = {
      steps: 8432,
      restingHeartRate: 62,
      sleepHours: 7.5,
      activeCalories: 450,
      distance: 6.2,
      timestamp: new Date(),
      source: "apple-health",
      syncedAt: new Date(),
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

    await WearableSyncService.saveToCache(mockData);

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should retrieve cached wearable data", async () => {
    const mockData: WearableData = {
      steps: 8432,
      restingHeartRate: 62,
      sleepHours: 7.5,
      activeCalories: 450,
      distance: 6.2,
      timestamp: new Date(),
      source: "apple-health",
      syncedAt: new Date(),
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify([mockData]));

    const result = await WearableSyncService.getFromCache();

    expect(result).toHaveLength(1);
    expect(result[0].steps).toBe(8432);
  });

  it("should return empty array when no cached data", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    const result = await WearableSyncService.getFromCache();

    expect(result).toEqual([]);
  });

  it("should get latest wearable data", async () => {
    const mockData: WearableData = {
      steps: 8432,
      restingHeartRate: 62,
      sleepHours: 7.5,
      activeCalories: 450,
      distance: 6.2,
      timestamp: new Date(),
      source: "apple-health",
      syncedAt: new Date(),
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify([mockData]));

    const result = await WearableSyncService.getLatest();

    expect(result).not.toBeNull();
    expect(result?.steps).toBe(8432);
  });

  it("should return null when no latest data", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    const result = await WearableSyncService.getLatest();

    expect(result).toBeNull();
  });

  it("should get history for last N days", async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const mockData = [
      {
        steps: 8432,
        restingHeartRate: 62,
        sleepHours: 7.5,
        activeCalories: 450,
        distance: 6.2,
        timestamp: now,
        source: "apple-health" as const,
        syncedAt: new Date(),
      },
      {
        steps: 7000,
        restingHeartRate: 65,
        sleepHours: 6.0,
        activeCalories: 350,
        distance: 5.0,
        timestamp: yesterday,
        source: "apple-health" as const,
        syncedAt: new Date(),
      },
      {
        steps: 5000,
        restingHeartRate: 70,
        sleepHours: 5.0,
        activeCalories: 250,
        distance: 4.0,
        timestamp: threeDaysAgo,
        source: "apple-health" as const,
        syncedAt: new Date(),
      },
    ];

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(mockData));

    const result = await WearableSyncService.getHistoryDays(2);

    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("should update sync status", async () => {
    const status = {
      lastSync: new Date(),
      issyncing: false,
      error: null,
      dataPoints: 5,
    };

    vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

    await WearableSyncService.updateSyncStatus(status);

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should get sync status", async () => {
    const status = {
      lastSync: new Date(),
      issyncing: false,
      error: null,
      dataPoints: 5,
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(status));

    const result = await WearableSyncService.getSyncStatus();

    expect(result.dataPoints).toBe(5);
  });

  it("should return default sync status when none exists", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    const result = await WearableSyncService.getSyncStatus();

    expect(result.lastSync).toBeNull();
    expect(result.issyncing).toBe(false);
    expect(result.dataPoints).toBe(0);
  });

  it("should determine if sync is needed", async () => {
    const oldDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    const status = {
      lastSync: oldDate,
      issyncing: false,
      error: null,
      dataPoints: 5,
    };

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(status));

    const result = await WearableSyncService.shouldSync();

    expect(result).toBe(true);
  });

  it("should clear cache", async () => {
    vi.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined);

    await WearableSyncService.clearCache();

    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(2);
  });

  it("should calculate daily average", async () => {
    const now = new Date();
    const mockData: WearableData[] = [
      {
        steps: 8000,
        restingHeartRate: 60,
        sleepHours: 7.0,
        activeCalories: 400,
        distance: 6.0,
        timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0),
        source: "apple-health",
        syncedAt: new Date(),
      },
      {
        steps: 8000,
        restingHeartRate: 64,
        sleepHours: 8.0,
        activeCalories: 500,
        distance: 6.4,
        timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0),
        source: "apple-health",
        syncedAt: new Date(),
      },
    ];

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(mockData));

    const result = await WearableSyncService.getDailyAverage(now);

    expect(result).not.toBeNull();
    expect(result?.steps).toBe(8000);
  });

  it("should get 7-day trend", async () => {
    const mockData: WearableData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      mockData.push({
        steps: 8000 + i * 100,
        restingHeartRate: 60 + i,
        sleepHours: 7.0 + i * 0.1,
        activeCalories: 400 + i * 10,
        distance: 6.0 + i * 0.1,
        timestamp: date,
        source: "apple-health",
        syncedAt: new Date(),
      });
    }

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(mockData));

    const result = await WearableSyncService.getSevenDayTrend();

    expect(result.length).toBeGreaterThan(0);
  });
});
