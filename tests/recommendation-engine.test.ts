import { describe, it, expect } from "vitest";
import { RecommendationEngine } from "../lib/recommendation-engine";
import type { HealthData } from "../hooks/use-health-data";

describe("RecommendationEngine", () => {
  const baseHealthData: HealthData = {
    steps: 8000,
    restingHeartRate: 65,
    sleepHours: 7.5,
    activeCalories: 400,
    distance: 6,
    timestamp: new Date(),
  };

  describe("calculateBioScore", () => {
    it("should calculate perfect score for optimal metrics", () => {
      const optimalData: HealthData = {
        ...baseHealthData,
        steps: 12000,
        restingHeartRate: 65,
        sleepHours: 8,
        activeCalories: 600,
        distance: 8,
      };

      const score = RecommendationEngine.calculateBioScore(optimalData);
      expect(score).toBeGreaterThanOrEqual(90);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should calculate low score for poor metrics", () => {
      const poorData: HealthData = {
        ...baseHealthData,
        steps: 2000,
        restingHeartRate: 90,
        sleepHours: 4,
        activeCalories: 100,
        distance: 1,
      };

      const score = RecommendationEngine.calculateBioScore(poorData);
      expect(score).toBeLessThan(60);
    });

    it("should return score between 0 and 100", () => {
      const score = RecommendationEngine.calculateBioScore(baseHealthData);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("generateDailyRecommendation", () => {
    it("should recommend nap for insufficient sleep", () => {
      const sleepyData: HealthData = {
        ...baseHealthData,
        sleepHours: 5,
      };

      const recommendation = RecommendationEngine.generateDailyRecommendation(sleepyData);
      expect(recommendation.priority).toBe("high");
      expect(recommendation.category).toBe("sleep");
      expect(recommendation.title.toLowerCase()).toContain("soneca");
    });

    it("should recommend activity for low steps", () => {
      const sedentaryData: HealthData = {
        ...baseHealthData,
        steps: 3000,
      };

      const recommendation = RecommendationEngine.generateDailyRecommendation(sedentaryData);
      expect(recommendation.priority).toBe("high");
      expect(recommendation.category).toBe("activity");
    });

    it("should recommend stress reduction for high heart rate", () => {
      const stressedData: HealthData = {
        ...baseHealthData,
        restingHeartRate: 85,
      };

      const recommendation = RecommendationEngine.generateDailyRecommendation(stressedData);
      expect(recommendation.priority).toBe("high");
      expect(recommendation.category).toBe("stress");
    });

    it("should give positive recommendation for good metrics", () => {
      const goodData: HealthData = {
        ...baseHealthData,
        sleepHours: 8,
        steps: 10000,
        restingHeartRate: 65,
      };

      const recommendation = RecommendationEngine.generateDailyRecommendation(goodData);
      expect(recommendation.priority).toBe("low");
      expect(recommendation.category).toBe("recovery");
    });
  });

  describe("getActivityStatus", () => {
    it("should return 'Muito ativo' for high steps", () => {
      expect(RecommendationEngine.getActivityStatus(12000)).toBe("Muito ativo");
    });

    it("should return 'Ativo' for good steps", () => {
      expect(RecommendationEngine.getActivityStatus(9000)).toBe("Ativo");
    });

    it("should return 'Moderado' for moderate steps", () => {
      expect(RecommendationEngine.getActivityStatus(6000)).toBe("Moderado");
    });

    it("should return 'Pouco ativo' for low steps", () => {
      expect(RecommendationEngine.getActivityStatus(3500)).toBe("Pouco ativo");
    });

    it("should return 'Sedentário' for very low steps", () => {
      expect(RecommendationEngine.getActivityStatus(1000)).toBe("Sedentário");
    });
  });

  describe("getRecoveryStatus", () => {
    it("should return 'Ótima' for optimal sleep", () => {
      expect(RecommendationEngine.getRecoveryStatus(7.5)).toBe("Ótima");
      expect(RecommendationEngine.getRecoveryStatus(8)).toBe("Ótima");
    });

    it("should return 'Boa' for good sleep", () => {
      expect(RecommendationEngine.getRecoveryStatus(6.8)).toBe("Boa");
    });

    it("should return 'Adequada' for adequate sleep", () => {
      expect(RecommendationEngine.getRecoveryStatus(6.2)).toBe("Adequada");
    });

    it("should return 'Insuficiente' for low sleep", () => {
      expect(RecommendationEngine.getRecoveryStatus(5)).toBe("Insuficiente");
    });
  });

  describe("getStressStatus", () => {
    it("should return 'Baixo' for low heart rate", () => {
      expect(RecommendationEngine.getStressStatus(65)).toBe("Baixo");
    });

    it("should return 'Moderado' for moderate heart rate", () => {
      expect(RecommendationEngine.getStressStatus(75)).toBe("Moderado");
    });

    it("should return 'Elevado' for high heart rate", () => {
      expect(RecommendationEngine.getStressStatus(85)).toBe("Elevado");
    });

    it("should return 'Muito baixo' for very low heart rate", () => {
      expect(RecommendationEngine.getStressStatus(50)).toBe("Muito baixo");
    });
  });
});
