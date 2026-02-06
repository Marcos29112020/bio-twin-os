import { describe, it, expect } from "vitest";
import { OCRAnalyzer, type ExamAnalysis } from "../server/ocr-analyzer";

describe("OCRAnalyzer", () => {
  it("should detect exam type from filename", () => {
    const hemogramaAnalysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");
    expect(hemogramaAnalysis.examType).toBe("Hemograma");

    const bioquimicaAnalysis = OCRAnalyzer["generateMockAnalysis"]("Bioquímica", "bioquimica.pdf");
    expect(bioquimicaAnalysis.examType).toBe("Bioquímica");
  });

  it("should generate mock analysis with biomarkers", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    expect(analysis.biomarkers).toBeDefined();
    expect(analysis.biomarkers.length).toBeGreaterThan(0);

    const biomarker = analysis.biomarkers[0];
    expect(biomarker.name).toBeDefined();
    expect(biomarker.value).toBeDefined();
    expect(biomarker.unit).toBeDefined();
    expect(biomarker.status).toMatch(/low|normal|high/);
  });

  it("should include recommendations for abnormal biomarkers", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Lipidograma", "lipidograma.pdf");

    expect(analysis.recommendations).toBeDefined();
    expect(Array.isArray(analysis.recommendations)).toBe(true);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });

  it("should identify risk factors", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Lipidograma", "lipidograma.pdf");

    expect(analysis.riskFactors).toBeDefined();
    expect(Array.isArray(analysis.riskFactors)).toBe(true);
  });

  it("should include next steps", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    expect(analysis.nextSteps).toBeDefined();
    expect(Array.isArray(analysis.nextSteps)).toBe(true);
    expect(analysis.nextSteps.length).toBeGreaterThan(0);
  });

  it("should generate analysis for Vitaminas exam", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Vitaminas", "vitaminas.pdf");

    expect(analysis.examType).toBe("Vitaminas");
    expect(analysis.biomarkers.some((b) => b.name.includes("Vitamina"))).toBe(true);
  });

  it("should generate analysis for Cortisol exam", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Cortisol", "cortisol.pdf");

    expect(analysis.examType).toBe("Cortisol");
    expect(analysis.biomarkers.some((b) => b.name.includes("Cortisol"))).toBe(true);
  });

  it("should handle biomarker status correctly", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    for (const biomarker of analysis.biomarkers) {
      expect(["low", "normal", "high"]).toContain(biomarker.status);

      if (biomarker.status === "low") {
        expect(biomarker.value).toBeLessThan(biomarker.referenceMin);
      } else if (biomarker.status === "high") {
        expect(biomarker.value).toBeGreaterThan(biomarker.referenceMax);
      } else {
        expect(biomarker.value).toBeGreaterThanOrEqual(biomarker.referenceMin);
        expect(biomarker.value).toBeLessThanOrEqual(biomarker.referenceMax);
      }
    }
  });

  it("should include interpretation for each biomarker", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    for (const biomarker of analysis.biomarkers) {
      expect(biomarker.interpretation).toBeDefined();
      expect(biomarker.interpretation.length).toBeGreaterThan(0);
    }
  });

  it("should have date in analysis", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    expect(analysis.date).toBeDefined();
    expect(analysis.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should generate overall analysis text", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Hemograma", "hemograma.pdf");

    expect(analysis.overallAnalysis).toBeDefined();
    expect(analysis.overallAnalysis.length).toBeGreaterThan(0);
    expect(analysis.overallAnalysis).toContain("Hemograma");
  });

  it("should identify multiple risk factors for lipidogram", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Lipidograma", "lipidograma.pdf");

    const highBiomarkers = analysis.biomarkers.filter((b) => b.status === "high");
    expect(highBiomarkers.length).toBeGreaterThan(0);
    expect(analysis.riskFactors.length).toBeGreaterThan(0);
  });

  it("should generate recommendations for vitamin D deficiency", () => {
    const analysis = OCRAnalyzer["generateMockAnalysis"]("Vitaminas", "vitaminas.pdf");

    const vitaminD = analysis.biomarkers.find((b) => b.name.includes("Vitamina D"));
    if (vitaminD && vitaminD.status === "low") {
      expect(analysis.recommendations.some((r) => r.includes("solar") || r.includes("suplementação"))).toBe(true);
    }
  });
});
