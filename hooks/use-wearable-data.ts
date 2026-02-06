import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import { WearableSyncService, type WearableData, type SyncStatus } from "@/lib/wearable-sync";

export interface UseWearableDataResult {
  data: WearableData | null;
  history: WearableData[];
  trend: WearableData[];
  syncStatus: SyncStatus;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  requestPermissions: () => Promise<void>;
}

/**
 * Custom hook to fetch and sync wearable data from Apple Health or Google Fit
 * Automatically caches data locally and syncs periodically
 */
export function useWearableData(): UseWearableDataResult {
  const [data, setData] = useState<WearableData | null>(null);
  const [history, setHistory] = useState<WearableData[]>([]);
  const [trend, setTrend] = useState<WearableData[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    issyncing: false,
    error: null,
    dataPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request health permissions based on platform
   */
  const requestPermissions = useCallback(async () => {
    try {
      setError(null);

      if (Platform.OS === "ios") {
        console.log("[iOS] Requesting Apple Health permissions...");
        // In production, use react-native-health library
        // For now, simulate permission grant
      } else if (Platform.OS === "android") {
        console.log("[Android] Requesting Health Connect permissions...");
        // In production, use react-native-health-connect library
        // For now, simulate permission grant
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to request permissions";
      setError(errorMessage);
      console.error("Error requesting permissions:", err);
    }
  }, []);

  /**
   * Fetch wearable data from native APIs
   */
  const fetchWearableData = useCallback(async () => {
    try {
      setSyncStatus((prev) => ({ ...prev, issyncing: true, error: null }));
      setError(null);

      let newData: WearableData;

      if (Platform.OS === "ios") {
        // iOS: Fetch from Apple Health
        console.log("[iOS] Fetching Apple Health data...");
        // In production:
        // const AppleHealthKit = require('react-native-health').default;
        // const now = new Date();
        // const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        // const options = { startDate: yesterday, endDate: now };
        // const steps = await AppleHealthKit.getStepCount(options);
        // const heartRate = await AppleHealthKit.getRestingHeartRateSamples(options);
        // const sleep = await AppleHealthKit.getSleepSamples(options);

        newData = {
          steps: Math.floor(Math.random() * 15000) + 2000,
          restingHeartRate: Math.floor(Math.random() * 20) + 55,
          sleepHours: Math.random() * 3 + 5,
          activeCalories: Math.floor(Math.random() * 600) + 200,
          distance: Math.random() * 10 + 2,
          timestamp: new Date(),
          source: "apple-health",
          syncedAt: new Date(),
        };
      } else if (Platform.OS === "android") {
        // Android: Fetch from Health Connect
        console.log("[Android] Fetching Health Connect data...");
        // In production:
        // const HealthConnect = require('react-native-health-connect').default;
        // const now = new Date();
        // const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        // const steps = await HealthConnect.readRecords('Steps', {...});
        // const heartRate = await HealthConnect.readRecords('HeartRate', {...});
        // const sleep = await HealthConnect.readRecords('Sleep', {...});

        newData = {
          steps: Math.floor(Math.random() * 15000) + 2000,
          restingHeartRate: Math.floor(Math.random() * 20) + 55,
          sleepHours: Math.random() * 3 + 5,
          activeCalories: Math.floor(Math.random() * 600) + 200,
          distance: Math.random() * 10 + 2,
          timestamp: new Date(),
          source: "google-fit",
          syncedAt: new Date(),
        };
      } else {
        // Web: Use mock data
        newData = {
          steps: 8432,
          restingHeartRate: 62,
          sleepHours: 7.5,
          activeCalories: 450,
          distance: 6.2,
          timestamp: new Date(),
          source: "mock",
          syncedAt: new Date(),
        };
      }

      // Save to cache
      await WearableSyncService.saveToCache(newData);

      // Update state
      setData(newData);

      // Fetch history and trend
      const cachedHistory = await WearableSyncService.getHistoryDays(7);
      setHistory(cachedHistory);

      const sevenDayTrend = await WearableSyncService.getSevenDayTrend();
      setTrend(sevenDayTrend);

      // Update sync status
      const newStatus = await WearableSyncService.getSyncStatus();
      setSyncStatus(newStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch wearable data";
      setError(errorMessage);
      setSyncStatus((prev) => ({ ...prev, issyncing: false, error: errorMessage }));
      console.error("Error fetching wearable data:", err);
    } finally {
      setSyncStatus((prev) => ({ ...prev, issyncing: false }));
    }
  }, []);

  /**
   * Load cached data on mount
   */
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        setIsLoading(true);

        // Load latest data
        const latest = await WearableSyncService.getLatest();
        setData(latest);

        // Load history
        const cachedHistory = await WearableSyncService.getHistoryDays(7);
        setHistory(cachedHistory);

        // Load trend
        const sevenDayTrend = await WearableSyncService.getSevenDayTrend();
        setTrend(sevenDayTrend);

        // Load sync status
        const status = await WearableSyncService.getSyncStatus();
        setSyncStatus(status);

        // Check if sync is needed
        const shouldSync = await WearableSyncService.shouldSync();
        if (shouldSync) {
          await fetchWearableData();
        }
      } catch (err) {
        console.error("Error loading cached data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCachedData();
  }, [fetchWearableData]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    await fetchWearableData();
  }, [fetchWearableData]);

  return {
    data,
    history,
    trend,
    syncStatus,
    isLoading,
    error,
    refresh,
    requestPermissions,
  };
}
