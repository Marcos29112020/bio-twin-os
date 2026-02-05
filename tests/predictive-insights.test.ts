import { describe, it, expect } from "vitest";
import { SyntheticDataGenerator } from "../lib/synthetic-data-generator";
import { PredictiveInsightsEngine } from "../lib/predictive-insights";

describe("SyntheticDataGenerator", () => {
  describe("generate7DayHistory", () => {
    it("should generate 7 days of data", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("healthy");
      expect(history).toHaveLength(7);
    });

    it("should generate valid health data for each day", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("healthy");

      history.forEach((record) => {
        expect(record.steps).toBeGreaterThan(0);
        expect(record.restingHeartRate).toBeGreaterThan(0);
        expect(record.sleepHours).toBeGreaterThan(0);
        expect(record.activeCalories).toBeGreaterThan(0);
        expect(record.hrvVariability).toBeGreaterThan(0);
      });
    });

    it("should generate irregular sleep profile with lower sleep", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("irregular_sleep");
      const avgSleep = history.reduce((sum, r) => sum + r.sleepHours, 0) / history.length;

      expect(avgSleep).toBeLessThan(7);
    });

    it("should generate high stress profile with elevated heart rate", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const avgHR = history.reduce((sum, r) => sum + r.restingHeartRate, 0) / history.length;

      expect(avgHR).toBeGreaterThan(70);
    });

    it("should generate sedentary profile with low steps", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("sedentary");
      const avgSteps = history.reduce((sum, r) => sum + r.steps, 0) / history.length;

      expect(avgSteps).toBeLessThan(6000);
    });
  });

  describe("generateBiomarkers", () => {
    it("should generate valid biomarker data", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");

      expect(biomarkers.cortisol).toBeGreaterThan(0);
      expect(biomarkers.vitaminD).toBeGreaterThan(0);
      expect(biomarkers.hemoglobin).toBeGreaterThan(0);
      expect(biomarkers.glucose).toBeGreaterThan(0);
      expect(biomarkers.triglycerides).toBeGreaterThan(0);
      expect(biomarkers.cholesterol).toBeGreaterThan(0);
    });

    it("should generate elevated cortisol for high stress profile", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("high_stress");
      expect(biomarkers.cortisol).toBeGreaterThan(15);
    });

    it("should generate lower vitamin D for high stress profile", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("high_stress");
      expect(biomarkers.vitaminD).toBeLessThan(35);
    });
  });

  describe("analyzeBiomarkers", () => {
    it("should correctly identify normal values", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");
      const analysis = SyntheticDataGenerator.analyzeBiomarkers(biomarkers);

      expect(analysis.cortisol).toBe("normal");
      expect(analysis.vitaminD).toBe("normal");
    });

    it("should identify low vitamin D", () => {
      const analysis = SyntheticDataGenerator.analyzeBiomarkers({
        cortisol: 12,
        vitaminD: 20,
        hemoglobin: 14,
        glucose: 95,
        triglycerides: 100,
        cholesterol: 190,
        timestamp: new Date(),
      });

      expect(analysis.vitaminD).toBe("low");
    });

    it("should identify high glucose", () => {
      const analysis = SyntheticDataGenerator.analyzeBiomarkers({
        cortisol: 12,
        vitaminD: 40,
        hemoglobin: 14,
        glucose: 125,
        triglycerides: 100,
        cholesterol: 190,
        timestamp: new Date(),
      });

      expect(analysis.glucose).toBe("high");
    });
  });
});

describe("PredictiveInsightsEngine", () => {
  describe("generateInsights", () => {
    it("should generate insights from health history", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      expect(insights.length).toBeGreaterThan(0);
    });

    it("should prioritize urgent insights first", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      const firstInsight = insights[0];
      expect(["urgent", "important", "informational"]).toContain(firstInsight.priority);
    });

    it("should generate stress-related insights for high stress profile", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      const stressInsights = insights.filter((i) => i.category === "stress");
      expect(stressInsights.length).toBeGreaterThan(0);
    });

    it("should generate sleep-related insights for irregular sleep profile", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("irregular_sleep");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      const sleepInsights = insights.filter((i) => i.category === "sleep");
      expect(sleepInsights.length).toBeGreaterThan(0);
    });

    it("should generate activity-related insights for sedentary profile", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("sedentary");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      const activityInsights = insights.filter((i) => i.category === "activity");
      expect(activityInsights.length).toBeGreaterThan(0);
    });

    it("should include biomarker insights when provided", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history, biomarkers);

      const biomarkerInsights = insights.filter(
        (i) => i.category === "nutrition" || i.category === "stress"
      );
      expect(biomarkerInsights.length).toBeGreaterThan(0);
    });

    it("should include actionable recommendations", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      insights.forEach((insight) => {
        expect(insight.action).toBeTruthy();
        expect(insight.action.length).toBeGreaterThan(0);
      });
    });

    it("should include estimated impact for insights", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const insights = PredictiveInsightsEngine.generateInsights(history);

      const insightsWithImpact = insights.filter((i) => i.estimatedImpact);
      expect(insightsWithImpact.length).toBeGreaterThan(0);
    });
  });
});
