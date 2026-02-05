import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";

export interface HealthData {
  steps: number;
  restingHeartRate: number;
  sleepHours: number;
  activeCalories: number;
  distance: number;
  timestamp: Date;
}

export interface HealthPermissions {
  isAuthorized: boolean;
  loading: boolean;
  error: string | null;
}

const MOCK_HEALTH_DATA: HealthData = {
  steps: 8432,
  restingHeartRate: 62,
  sleepHours: 7.5,
  activeCalories: 450,
  distance: 6.2,
  timestamp: new Date(),
};

/**
 * Custom hook to fetch health data from Apple Health (iOS) or Google Health Connect (Android)
 * Falls back to mock data for testing in Expo Go
 */
export function useHealthData() {
  const [data, setData] = useState<HealthData>(MOCK_HEALTH_DATA);
  const [permissions, setPermissions] = useState<HealthPermissions>({
    isAuthorized: false,
    loading: true,
    error: null,
  });

  /**
   * Request health permissions based on platform
   */
  const requestPermissions = useCallback(async () => {
    try {
      setPermissions((prev) => ({ ...prev, loading: true, error: null }));

      if (Platform.OS === "ios") {
        // iOS: Use react-native-health
        // In production, this would use the actual library
        // For now, we simulate the permission request
        console.log("[iOS] Requesting Apple Health permissions...");
        // Simulate permission grant
        setPermissions({
          isAuthorized: true,
          loading: false,
          error: null,
        });
      } else if (Platform.OS === "android") {
        // Android: Use react-native-health-connect
        console.log("[Android] Requesting Health Connect permissions...");
        // Simulate permission grant
        setPermissions({
          isAuthorized: true,
          loading: false,
          error: null,
        });
      } else {
        // Web: Use mock data
        setPermissions({
          isAuthorized: true,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setPermissions({
        isAuthorized: false,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  /**
   * Fetch health data for the last 24 hours
   */
  const fetchHealthData = useCallback(async () => {
    try {
      if (!permissions.isAuthorized) {
        throw new Error("Health permissions not granted");
      }

      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      if (Platform.OS === "ios") {
        // iOS: Fetch from Apple Health
        // In production:
        // const AppleHealthKit = require('react-native-health').default;
        // const options = {
        //   startDate: yesterday,
        //   endDate: now,
        // };
        // const steps = await AppleHealthKit.getStepCount(options);
        // const heartRate = await AppleHealthKit.getRestingHeartRateSamples(options);
        // const sleep = await AppleHealthKit.getSleepSamples(options);

        console.log("[iOS] Fetching Apple Health data...");
        // Simulate data fetch with realistic values
        setData({
          steps: Math.floor(Math.random() * 15000) + 2000,
          restingHeartRate: Math.floor(Math.random() * 20) + 55,
          sleepHours: Math.random() * 3 + 5,
          activeCalories: Math.floor(Math.random() * 600) + 200,
          distance: Math.random() * 10 + 2,
          timestamp: now,
        });
      } else if (Platform.OS === "android") {
        // Android: Fetch from Health Connect
        // In production:
        // const HealthConnect = require('react-native-health-connect').default;
        // const steps = await HealthConnect.readRecords('Steps', {
        //   timeRangeFilter: {
        //     operator: 'between',
        //     startTime: yesterday.toISOString(),
        //     endTime: now.toISOString(),
        //   },
        // });

        console.log("[Android] Fetching Health Connect data...");
        // Simulate data fetch with realistic values
        setData({
          steps: Math.floor(Math.random() * 15000) + 2000,
          restingHeartRate: Math.floor(Math.random() * 20) + 55,
          sleepHours: Math.random() * 3 + 5,
          activeCalories: Math.floor(Math.random() * 600) + 200,
          distance: Math.random() * 10 + 2,
          timestamp: now,
        });
      } else {
        // Web: Use mock data
        setData(MOCK_HEALTH_DATA);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
      // Fall back to mock data on error
      setData(MOCK_HEALTH_DATA);
    }
  }, [permissions.isAuthorized]);

  /**
   * Initialize: Request permissions and fetch data on mount
   */
  useEffect(() => {
    const initialize = async () => {
      await requestPermissions();
    };
    initialize();
  }, [requestPermissions]);

  /**
   * Fetch data when permissions are granted
   */
  useEffect(() => {
    if (permissions.isAuthorized && !permissions.loading) {
      fetchHealthData();
    }
  }, [permissions.isAuthorized, permissions.loading, fetchHealthData]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    await fetchHealthData();
  }, [fetchHealthData]);

  return {
    data,
    permissions,
    refresh,
    requestPermissions,
  };
}
