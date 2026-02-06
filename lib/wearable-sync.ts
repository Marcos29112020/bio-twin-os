import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Wearable data interface
 */
export interface WearableData {
  steps: number;
  restingHeartRate: number;
  sleepHours: number;
  activeCalories: number;
  distance: number;
  timestamp: Date;
  source: "apple-health" | "google-fit" | "manual" | "mock";
  syncedAt: Date;
}

/**
 * Sync status interface
 */
export interface SyncStatus {
  lastSync: Date | null;
  issyncing: boolean;
  error: string | null;
  dataPoints: number;
}

const STORAGE_KEY = "wearable_data_cache";
const SYNC_STATUS_KEY = "wearable_sync_status";
const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

/**
 * Wearable Sync Service
 * Manages synchronization of health data from Apple Health and Google Fit
 */
export class WearableSyncService {
  /**
   * Save wearable data to local cache
   */
  static async saveToCache(data: WearableData): Promise<void> {
    try {
      const cached = await this.getFromCache();
      const updated = [data, ...cached.slice(0, 29)]; // Keep last 30 days

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Update sync status
      await this.updateSyncStatus({
        lastSync: new Date(),
        issyncing: false,
        error: null,
        dataPoints: updated.length,
      });
    } catch (error) {
      console.error("Error saving to cache:", error);
      throw error;
    }
  }

  /**
   * Get cached wearable data
   */
  static async getFromCache(): Promise<WearableData[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (!cached) return [];

      const data = JSON.parse(cached) as WearableData[];
      return data.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        syncedAt: new Date(item.syncedAt),
      }));
    } catch (error) {
      console.error("Error reading cache:", error);
      return [];
    }
  }

  /**
   * Get latest wearable data
   */
  static async getLatest(): Promise<WearableData | null> {
    try {
      const cached = await this.getFromCache();
      if (cached.length === 0) return null;

      return cached[0];
    } catch (error) {
      console.error("Error getting latest data:", error);
      return null;
    }
  }

  /**
   * Get wearable data for last N days
   */
  static async getHistoryDays(days: number): Promise<WearableData[]> {
    try {
      const cached = await this.getFromCache();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      return cached.filter((item) => item.timestamp > cutoff);
    } catch (error) {
      console.error("Error getting history:", error);
      return [];
    }
  }

  /**
   * Update sync status
   */
  static async updateSyncStatus(status: SyncStatus): Promise<void> {
    try {
      await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.error("Error updating sync status:", error);
    }
  }

  /**
   * Get sync status
   */
  static async getSyncStatus(): Promise<SyncStatus> {
    try {
      const status = await AsyncStorage.getItem(SYNC_STATUS_KEY);
      if (!status) {
        return {
          lastSync: null,
          issyncing: false,
          error: null,
          dataPoints: 0,
        };
      }

      const parsed = JSON.parse(status);
      return {
        ...parsed,
        lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
      };
    } catch (error) {
      console.error("Error getting sync status:", error);
      return {
        lastSync: null,
        issyncing: false,
        error: null,
        dataPoints: 0,
      };
    }
  }

  /**
   * Check if sync is needed
   */
  static async shouldSync(): Promise<boolean> {
    try {
      const status = await this.getSyncStatus();

      if (!status.lastSync) return true;

      const timeSinceLastSync = Date.now() - status.lastSync.getTime();
      return timeSinceLastSync > SYNC_INTERVAL;
    } catch (error) {
      console.error("Error checking sync status:", error);
      return true;
    }
  }

  /**
   * Clear cache
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(SYNC_STATUS_KEY);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  /**
   * Calculate daily average from cached data
   */
  static async getDailyAverage(date: Date): Promise<Partial<WearableData> | null> {
    try {
      const cached = await this.getFromCache();

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayData = cached.filter((item) => item.timestamp >= dayStart && item.timestamp <= dayEnd);

      if (dayData.length === 0) return null;

      const avg: Partial<WearableData> = {
        steps: Math.round(dayData.reduce((sum, d) => sum + d.steps, 0) / dayData.length),
        restingHeartRate: Math.round(dayData.reduce((sum, d) => sum + d.restingHeartRate, 0) / dayData.length),
        sleepHours: Math.round((dayData.reduce((sum, d) => sum + d.sleepHours, 0) / dayData.length) * 10) / 10,
        activeCalories: Math.round(dayData.reduce((sum, d) => sum + d.activeCalories, 0) / dayData.length),
        distance: Math.round((dayData.reduce((sum, d) => sum + d.distance, 0) / dayData.length) * 10) / 10,
        timestamp: new Date(date),
        source: "apple-health",
        syncedAt: new Date(),
      };

      return avg;
    } catch (error) {
      console.error("Error calculating daily average:", error);
      return null;
    }
  }

  /**
   * Get 7-day trend
   */
  static async getSevenDayTrend(): Promise<WearableData[]> {
    try {
      const history = await this.getHistoryDays(7);

      // Group by day and calculate averages
      const dayMap = new Map<string, WearableData[]>();

      for (const item of history) {
        const dayKey = item.timestamp.toISOString().split("T")[0];
        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, []);
        }
        dayMap.get(dayKey)!.push(item);
      }

      const trend: WearableData[] = [];

      for (const [dayKey, items] of dayMap) {
        const avg: WearableData = {
          steps: Math.round(items.reduce((sum, d) => sum + d.steps, 0) / items.length),
          restingHeartRate: Math.round(items.reduce((sum, d) => sum + d.restingHeartRate, 0) / items.length),
          sleepHours: Math.round((items.reduce((sum, d) => sum + d.sleepHours, 0) / items.length) * 10) / 10,
          activeCalories: Math.round(items.reduce((sum, d) => sum + d.activeCalories, 0) / items.length),
          distance: Math.round((items.reduce((sum, d) => sum + d.distance, 0) / items.length) * 10) / 10,
          timestamp: new Date(dayKey),
          source: items[0].source,
          syncedAt: new Date(),
        };

        trend.push(avg);
      }

      return trend.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.error("Error getting 7-day trend:", error);
      return [];
    }
  }
}
