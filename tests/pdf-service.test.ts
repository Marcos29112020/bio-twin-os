import { describe, it, expect, vi } from "vitest";
import { PDFService } from "../lib/pdf-service";
import { SyntheticDataGenerator } from "../lib/synthetic-data-generator";
import { BloodTestAnalyzer } from "../lib/blood-test-analyzer";
import { LongevityBrain } from "../lib/longevity-brain";
import { PDFReportGenerator } from "../lib/pdf-report-generator";

describe("PDFService", () => {
  // Create a mock report for testing
  const createMockReport = () => {
    const history = SyntheticDataGenerator.generate7DayHistory("healthy");
    const biomarkers = SyntheticDataGenerator.generateBiomarkers("healthy");
    const bloodTestReport = BloodTestAnalyzer.analyzeBloodTest(biomarkers);
    const correlationAlerts = LongevityBrain.analyzeCorrelations(history, biomarkers);

    return PDFReportGenerator.generateReport(
      "Test Patient",
      85,
      80,
      history,
      biomarkers,
      bloodTestReport,
      correlationAlerts
    );
  };

  describe("generateAndSavePDF", () => {
    it("should generate PDF content from report", () => {
      const report = createMockReport();
      const pdfContent = PDFReportGenerator.generatePDFContent(report);

      expect(pdfContent).toBeDefined();
      expect(pdfContent.length).toBeGreaterThan(0);
      expect(pdfContent).toContain("RELATÓRIO DE LONGEVIDADE");
      expect(pdfContent).toContain("Test Patient");
    });

    it("should include all required sections in PDF", () => {
      const report = createMockReport();
      const pdfContent = PDFReportGenerator.generatePDFContent(report);

      expect(pdfContent).toContain("INDICADORES PRINCIPAIS");
      expect(pdfContent).toContain("HISTÓRICO DE SAÚDE");
      expect(pdfContent).toContain("BIOMARCADORES");
      expect(pdfContent).toContain("RECOMENDAÇÕES PERSONALIZADAS");
    });

    it("should include patient name and scores", () => {
      const report = createMockReport();
      const pdfContent = PDFReportGenerator.generatePDFContent(report);

      expect(pdfContent).toContain("Test Patient");
      expect(pdfContent).toContain("85/100");
      expect(pdfContent).toContain("80/100");
    });
  });

  describe("exportAsCSV", () => {
    it("should generate CSV content", () => {
      const report = createMockReport();
      const csvContent = PDFReportGenerator.generateCSVExport(report);

      expect(csvContent).toBeDefined();
      expect(csvContent.length).toBeGreaterThan(0);
      expect(csvContent).toContain("Data,Passos,Sono");
    });

    it("should include health data rows", () => {
      const report = createMockReport();
      const csvContent = PDFReportGenerator.generateCSVExport(report);

      const lines = csvContent.split("\n");
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[0]).toContain("Data");
    });
  });

  describe("exportAsJSON", () => {
    it("should generate valid JSON", () => {
      const report = createMockReport();
      const jsonContent = PDFReportGenerator.generateJSONExport(report);

      expect(jsonContent).toBeDefined();
      const parsed = JSON.parse(jsonContent);
      expect(parsed).toBeDefined();
    });

    it("should include all required fields in JSON", () => {
      const report = createMockReport();
      const jsonContent = PDFReportGenerator.generateJSONExport(report);
      const parsed = JSON.parse(jsonContent);

      expect(parsed.patient).toBe("Test Patient");
      expect(parsed.scores).toBeDefined();
      expect(parsed.scores.bioScore).toBe(85);
      expect(parsed.scores.longevityScore).toBe(80);
      expect(parsed.metrics).toBeDefined();
      expect(parsed.biomarkers).toBeDefined();
      expect(parsed.alerts).toBeDefined();
      expect(parsed.recommendations).toBeDefined();
    });

    it("should include biomarker data", () => {
      const report = createMockReport();
      const jsonContent = PDFReportGenerator.generateJSONExport(report);
      const parsed = JSON.parse(jsonContent);

      expect(parsed.biomarkers.cortisol).toBeDefined();
      expect(parsed.biomarkers.vitaminD).toBeDefined();
      expect(parsed.biomarkers.hemoglobin).toBeDefined();
      expect(parsed.biomarkers.glucose).toBeDefined();
      expect(parsed.biomarkers.triglycerides).toBeDefined();
      expect(parsed.biomarkers.cholesterol).toBeDefined();
    });
  });

  describe("Report Generation", () => {
    it("should generate consistent reports", () => {
      const report1 = createMockReport();
      const report2 = createMockReport();

      expect(report1.patientName).toBe(report2.patientName);
      expect(report1.bioScore).toBe(report2.bioScore);
      expect(report1.longevityScore).toBe(report2.longevityScore);
    });

    it("should include recommendations", () => {
      const report = createMockReport();

      expect(report.recommendations).toBeDefined();
      expect(report.recommendations.length).toBeGreaterThan(0);
      report.recommendations.forEach((rec) => {
        expect(rec.length).toBeGreaterThan(0);
      });
    });

    it("should set next checkup to 30 days from now", () => {
      const report = createMockReport();
      const now = new Date();
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 30);

      const daysDiff = Math.floor(
        (report.nextCheckup.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBeGreaterThanOrEqual(29);
      expect(daysDiff).toBeLessThanOrEqual(31);
    });
  });

  describe("Export Formats", () => {
    it("should handle different profile types", () => {
      const profiles = ["healthy", "high_stress", "irregular_sleep", "sedentary"] as const;

      profiles.forEach((profile) => {
        const history = SyntheticDataGenerator.generate7DayHistory(profile);
        const biomarkers = SyntheticDataGenerator.generateBiomarkers(profile);
        const bloodTestReport = BloodTestAnalyzer.analyzeBloodTest(biomarkers);
        const correlationAlerts = LongevityBrain.analyzeCorrelations(history, biomarkers);

        const report = PDFReportGenerator.generateReport(
          `Patient ${profile}`,
          75,
          75,
          history,
          biomarkers,
          bloodTestReport,
          correlationAlerts
        );

        const pdf = PDFReportGenerator.generatePDFContent(report);
        const csv = PDFReportGenerator.generateCSVExport(report);
        const json = PDFReportGenerator.generateJSONExport(report);

        expect(pdf.length).toBeGreaterThan(0);
        expect(csv.length).toBeGreaterThan(0);
        expect(json.length).toBeGreaterThan(0);
      });
    });
  });
});
