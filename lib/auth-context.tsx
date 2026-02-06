import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "./supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app startup
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser } = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.signUp(email, password);
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
