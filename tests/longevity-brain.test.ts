import { describe, it, expect } from "vitest";
import { SyntheticDataGenerator } from "../lib/synthetic-data-generator";
import { LongevityBrain } from "../lib/longevity-brain";
import { BloodTestAnalyzer } from "../lib/blood-test-analyzer";

describe("LongevityBrain", () => {
  describe("analyzeCorrelations", () => {
    it("should generate correlation alerts", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const alerts = LongevityBrain.analyzeCorrelations(history);

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].riskLevel).toBeDefined();
    });

    it("should include recommendations for each alert", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const alerts = LongevityBrain.analyzeCorrelations(history);

      alerts.forEach((alert) => {
        expect(alert.recommendations.length).toBeGreaterThan(0);
      });
    });
  });

  describe("identifyPatterns", () => {
    it("should identify health patterns", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const patterns = LongevityBrain.identifyPatterns(history);

      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach((pattern) => {
        expect(pattern.name).toBeDefined();
        expect(pattern.interventionSuggestion).toBeDefined();
      });
    });
  });

  describe("calculateAdjustedBioScore", () => {
    it("should calculate adjusted score based on alerts", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("high_stress");
      const alerts = LongevityBrain.analyzeCorrelations(history);

      const baseScore = 75;
      const { adjustedScore, totalImpact } = LongevityBrain.calculateAdjustedBioScore(
        baseScore,
        alerts
      );

      expect(adjustedScore).toBeGreaterThanOrEqual(0);
      expect(adjustedScore).toBeLessThanOrEqual(100);
    });
  });

  describe("calculateLongevityScore", () => {
    it("should calculate longevity score", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("healthy");
      const score = LongevityBrain.calculateLongevityScore(history);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should include biomarker data in calculation", () => {
      const history = SyntheticDataGenerator.generate7DayHistory("healthy");
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");

      const scoreWithBiomarkers = LongevityBrain.calculateLongevityScore(
        history,
        biomarkers
      );

      expect(scoreWithBiomarkers).toBeGreaterThanOrEqual(0);
      expect(scoreWithBiomarkers).toBeLessThanOrEqual(100);
    });
  });
});

describe("BloodTestAnalyzer", () => {
  describe("analyzeBloodTest", () => {
    it("should generate analysis for all biomarkers", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");
      const report = BloodTestAnalyzer.analyzeBloodTest(biomarkers);

      expect(report.analyses.length).toBe(6);
    });

    it("should generate priority actions", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("high_stress");
      const report = BloodTestAnalyzer.analyzeBloodTest(biomarkers);

      expect(report.priorityActions.length).toBeGreaterThan(0);
    });

    it("should suggest follow-up tests for abnormal results", () => {
      const biomarkers = {
        cortisol: 25,
        vitaminD: 20,
        hemoglobin: 14,
        glucose: 120,
        triglycerides: 200,
        cholesterol: 250,
        timestamp: new Date(),
      };

      const report = BloodTestAnalyzer.analyzeBloodTest(biomarkers);

      expect(report.followUpTests).toBeDefined();
      expect(report.followUpTests!.length).toBeGreaterThan(0);
    });

    it("should provide interpretation for each biomarker", () => {
      const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");
      const report = BloodTestAnalyzer.analyzeBloodTest(biomarkers);

      report.analyses.forEach((analysis) => {
        expect(analysis.interpretation).toBeDefined();
        expect(analysis.interpretation.length).toBeGreaterThan(0);
      });
    });
  });
});
