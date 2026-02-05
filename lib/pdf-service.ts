import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import type { LongevityReport } from "./pdf-report-generator";
import { PDFReportGenerator } from "./pdf-report-generator";

/**
 * PDF Service
 * Handles PDF generation and sharing using native APIs
 */
export class PDFService {
  /**
   * Generate and save PDF report locally
   */
  static async generateAndSavePDF(report: LongevityReport): Promise<string> {
    try {
      // Generate text content
      const pdfContent = PDFReportGenerator.generatePDFContent(report);

      // Create filename with timestamp
      const timestamp = new Date().getTime();
      const filename = `BioTwin_Report_${timestamp}.txt`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;

      // Write to file system
      await FileSystem.writeAsStringAsync(filePath, pdfContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return filePath;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF report");
    }
  }

  /**
   * Share PDF report via native sharing
   */
  static async sharePDFReport(report: LongevityReport): Promise<void> {
    try {
      const filePath = await this.generateAndSavePDF(report);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
      }

      // Share the file
      await Sharing.shareAsync(filePath, {
        mimeType: "text/plain",
        dialogTitle: "Compartilhar Relatório de Longevidade",
        UTI: "public.plain-text",
      });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      throw new Error("Failed to share PDF report");
    }
  }

  /**
   * Export report as CSV
   */
  static async exportAsCSV(report: LongevityReport): Promise<string> {
    try {
      const csvContent = PDFReportGenerator.generateCSVExport(report);

      const timestamp = new Date().getTime();
      const filename = `BioTwin_Data_${timestamp}.csv`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return filePath;
    } catch (error) {
      console.error("Error exporting CSV:", error);
      throw new Error("Failed to export CSV");
    }
  }

  /**
   * Export report as JSON
   */
  static async exportAsJSON(report: LongevityReport): Promise<string> {
    try {
      const jsonContent = PDFReportGenerator.generateJSONExport(report);

      const timestamp = new Date().getTime();
      const filename = `BioTwin_Data_${timestamp}.json`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(filePath, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return filePath;
    } catch (error) {
      console.error("Error exporting JSON:", error);
      throw new Error("Failed to export JSON");
    }
  }

  /**
   * Share CSV export
   */
  static async shareCSV(report: LongevityReport): Promise<void> {
    try {
      const filePath = await this.exportAsCSV(report);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
      }

      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Compartilhar Dados de Saúde (CSV)",
        UTI: "public.comma-separated-values-text",
      });
    } catch (error) {
      console.error("Error sharing CSV:", error);
      throw new Error("Failed to share CSV");
    }
  }

  /**
   * Share JSON export
   */
  static async shareJSON(report: LongevityReport): Promise<void> {
    try {
      const filePath = await this.exportAsJSON(report);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
      }

      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Compartilhar Dados de Saúde (JSON)",
        UTI: "public.json",
      });
    } catch (error) {
      console.error("Error sharing JSON:", error);
      throw new Error("Failed to share JSON");
    }
  }

  /**
   * Get list of saved reports
   */
  static async getSavedReports(): Promise<string[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory || ""
      );
      return files.filter(
        (file) =>
          file.startsWith("BioTwin_Report_") || file.startsWith("BioTwin_Data_")
      );
    } catch (error) {
      console.error("Error reading saved reports:", error);
      return [];
    }
  }

  /**
   * Delete a saved report
   */
  static async deleteReport(filename: string): Promise<void> {
    try {
      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.deleteAsync(filePath);
    } catch (error) {
      console.error("Error deleting report:", error);
      throw new Error("Failed to delete report");
    }
  }
}
