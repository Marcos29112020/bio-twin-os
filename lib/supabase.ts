import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
  );
}

/**
 * Custom storage adapter for Supabase Auth
 * Uses AsyncStorage as primary storage (works in Expo Go)
 * Falls back to SecureStore on native platforms
 */
const supabaseStorage = {
  getItem: async (key: string) => {
    try {
      // Try AsyncStorage first (works in Expo Go)
      const value = await AsyncStorage.getItem(key);
      if (value) return value;
      
      // Fallback to SecureStore on native
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn("Error reading from storage:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      // Store in AsyncStorage (works in Expo Go)
      await AsyncStorage.setItem(key, value);
      
      // Also try SecureStore on native
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (e) {
        // SecureStore not available, that's ok
      }
    } catch (error) {
      console.warn("Error writing to storage:", error);
    }
  },
  removeItem: async (key: string) => {
    try {
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(key);
      
      // Also try SecureStore on native
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        // SecureStore not available, that's ok
      }
    } catch (error) {
      console.warn("Error removing from storage:", error);
    }
  },
};

/**
 * Initialize Supabase client
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Auth service functions
 */
export const authService = {
  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign out
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * Get session
   */
  getSession: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "bio-twin-os://reset-password",
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

/**
 * Profile service functions
 */
export const profileService = {
  /**
   * Get user profile
   */
  getProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Create or update user profile
   */
  upsertProfile: async (
    userId: string,
    profile: {
      name?: string;
      age?: number;
      photo_url?: string;
      bio?: string;
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            ...profile,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: async (userId: string, fileUri: string, fileName: string) => {
    try {
      // Read file as base64
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(`${userId}/${fileName}`, blob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(`${userId}/${fileName}`);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error };
    }
  },
};

/**
 * Health data service functions
 */
export const healthDataService = {
  /**
   * Get user health data
   */
  getHealthData: async (userId: string, days: number = 7) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("health_data")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate.toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Save health data
   */
  saveHealthData: async (
    userId: string,
    data: {
      date: string;
      steps?: number;
      sleep_hours?: number;
      resting_heart_rate?: number;
      stress_level?: number;
      hrv?: number;
    }
  ) => {
    try {
      const { data: result, error } = await supabase
        .from("health_data")
        .upsert(
          {
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,date" }
        )
        .select()
        .single();

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

/**
 * Exam service functions
 */
export const examService = {
  /**
   * Get user exams
   */
  getExams: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Upload exam file
   */
  uploadExam: async (
    userId: string,
    fileUri: string,
    fileName: string,
    fileType: "pdf" | "image"
  ) => {
    try {
      // Read file as base64
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("health-exams")
        .upload(`${userId}/${Date.now()}-${fileName}`, blob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("health-exams")
        .getPublicUrl(`${userId}/${Date.now()}-${fileName}`);

      // Save exam metadata
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .insert({
          user_id: userId,
          file_name: fileName,
          file_url: publicUrl,
          file_type: fileType,
          status: "pending",
        })
        .select()
        .single();

      if (examError) throw examError;

      return { data: examData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Delete exam
   */
  deleteExam: async (userId: string, examId: string, fileName: string) => {
    try {
      // Delete from storage
      await supabase.storage.from("health-exams").remove([`${userId}/${fileName}`]);

      // Delete from database
      const { error } = await supabase.from("exams").delete().eq("id", examId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};
