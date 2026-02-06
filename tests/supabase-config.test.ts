import { describe, it, expect } from "vitest";

describe("Supabase Configuration", () => {
  it("should have valid Supabase URL", () => {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    expect(url).toBeDefined();
    if (url) {
      expect(url).toMatch(/^https:\/\/.+\.supabase\.co$/);
    }
  });

  it("should have valid Supabase Anon Key", () => {
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    if (key) {
      expect(key.length).toBeGreaterThan(0);
    }
  });

  it("should have both credentials configured", () => {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    expect(url).toBeDefined();
    expect(key).toBeDefined();
    expect(url?.length).toBeGreaterThan(0);
    expect(key?.length).toBeGreaterThan(0);
  });
});
