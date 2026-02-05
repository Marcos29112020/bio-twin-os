import type { SyntheticHealthRecord, BiomarkerData } from "./synthetic-data-generator";
import type { BloodTestReport } from "./blood-test-analyzer";
import type { CorrelationAlert } from "./longevity-brain";

export interface LongevityReport {
  patientName: string;
  reportDate: Date;
  bioScore: number;
  longevityScore: number;
  healthHistory: SyntheticHealthRecord[];
  biomarkers: BiomarkerData;
  bloodTestReport?: BloodTestReport;
  correlationAlerts: CorrelationAlert[];
  recommendations: string[];
  nextCheckup: Date;
}

/**
 * PDF Report Generator
 * Generates professional longevity reports for sharing with doctors
 */
export class PDFReportGenerator {
  /**
   * Generate a comprehensive longevity report
   */
  static generateReport(
    patientName: string,
    bioScore: number,
    longevityScore: number,
    healthHistory: SyntheticHealthRecord[],
    biomarkers: BiomarkerData,
    bloodTestReport: BloodTestReport | undefined,
    correlationAlerts: CorrelationAlert[]
  ): LongevityReport {
    const recommendations = this.generateRecommendations(
      bioScore,
      correlationAlerts,
      bloodTestReport
    );

    const nextCheckup = new Date();
    nextCheckup.setDate(nextCheckup.getDate() + 30);

    return {
      patientName,
      reportDate: new Date(),
      bioScore,
      longevityScore,
      healthHistory,
      biomarkers,
      bloodTestReport,
      correlationAlerts,
      recommendations,
      nextCheckup,
    };
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(
    bioScore: number,
    alerts: CorrelationAlert[],
    bloodTestReport?: BloodTestReport
  ): string[] {
    const recommendations: string[] = [];

    // Based on Bio-Score
    if (bioScore < 40) {
      recommendations.push(
        "URGENTE: Consulte um médico para avaliação completa de saúde"
      );
      recommendations.push(
        "Implemente mudanças imediatas: aumente sono, reduza estresse, aumente atividade"
      );
    } else if (bioScore < 60) {
      recommendations.push("Priorize melhorias em sono e atividade física");
      recommendations.push("Considere consulta com especialista em medicina preventiva");
    } else if (bioScore < 80) {
      recommendations.push("Continue com hábitos saudáveis atuais");
      recommendations.push("Explore otimizações avançadas de saúde");
    } else {
      recommendations.push("Excelente saúde geral. Mantenha os hábitos atuais");
      recommendations.push("Considere participar de estudos de longevidade");
    }

    // Based on alerts
    alerts.slice(0, 3).forEach((alert) => {
      recommendations.push(`${alert.title}: ${alert.recommendations[0]}`);
    });

    // Based on blood test
    if (bloodTestReport) {
      recommendations.push(...bloodTestReport.priorityActions.slice(0, 2));
    }

    return recommendations;
  }

  /**
   * Generate PDF content as text (for simulation)
   */
  static generatePDFContent(report: LongevityReport): string {
    const lines: string[] = [];

    lines.push("═══════════════════════════════════════════════════════════");
    lines.push("          RELATÓRIO DE LONGEVIDADE - BIO-TWIN OS");
    lines.push("═══════════════════════════════════════════════════════════");
    lines.push("");

    // Header
    lines.push(`PACIENTE: ${report.patientName}`);
    lines.push(`DATA DO RELATÓRIO: ${report.reportDate.toLocaleDateString("pt-BR")}`);
    lines.push(`PRÓXIMA AVALIAÇÃO: ${report.nextCheckup.toLocaleDateString("pt-BR")}`);
    lines.push("");

    // Scores
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("INDICADORES PRINCIPAIS");
    lines.push("───────────────────────────────────────────────────────────");
    lines.push(`Bio-Score: ${report.bioScore}/100`);
    lines.push(`Longevity Score: ${report.longevityScore}/100`);
    lines.push("");

    // Health Metrics (Last 7 days)
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("HISTÓRICO DE SAÚDE (ÚLTIMOS 7 DIAS)");
    lines.push("───────────────────────────────────────────────────────────");

    const avgSteps = report.healthHistory.length > 0 ? report.healthHistory.reduce((sum, r) => sum + r.steps, 0) / report.healthHistory.length : 0;
    const avgSleep = report.healthHistory.length > 0 ? report.healthHistory.reduce((sum, r) => sum + r.sleepHours, 0) / report.healthHistory.length : 0;
    const avgHR = report.healthHistory.length > 0 ? report.healthHistory.reduce((sum, r) => sum + r.restingHeartRate, 0) / report.healthHistory.length : 0;
    const avgHRV = report.healthHistory.length > 0 ? report.healthHistory.reduce((sum, r) => sum + r.hrvVariability, 0) / report.healthHistory.length : 0;

    lines.push(`Passos (média): ${Math.round(avgSteps)} passos/dia`);
    lines.push(`Sono (média): ${avgSleep.toFixed(1)} horas/noite`);
    lines.push(`Frequência Cardíaca em Repouso (média): ${Math.round(avgHR)} bpm`);
    lines.push(`Variabilidade da Frequência Cardíaca (média): ${Math.round(avgHRV)} ms`);
    lines.push("");

    // Biomarkers
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("BIOMARCADORES");
    lines.push("───────────────────────────────────────────────────────────");
    lines.push(`Cortisol: ${report.biomarkers.cortisol.toFixed(1)} µg/dL`);
    lines.push(`Vitamina D: ${report.biomarkers.vitaminD.toFixed(1)} ng/mL`);
    lines.push(`Hemoglobina: ${report.biomarkers.hemoglobin.toFixed(1)} g/dL`);
    lines.push(`Glicose (Jejum): ${report.biomarkers.glucose.toFixed(0)} mg/dL`);
    lines.push(`Triglicerídeos: ${report.biomarkers.triglycerides.toFixed(0)} mg/dL`);
    lines.push(`Colesterol Total: ${report.biomarkers.cholesterol.toFixed(0)} mg/dL`);
    lines.push("");

    // Correlation Alerts
    if (report.correlationAlerts.length > 0) {
      lines.push("───────────────────────────────────────────────────────────");
      lines.push("ALERTAS DE CORRELAÇÃO");
      lines.push("───────────────────────────────────────────────────────────");

      report.correlationAlerts.forEach((alert) => {
        lines.push(`[${alert.riskLevel.toUpperCase()}] ${alert.title}`);
        lines.push(`Impacto no Bio-Score: ${alert.bioScoreImpact > 0 ? "+" : ""}${alert.bioScoreImpact}%`);
        lines.push(`Métricas Envolvidas: ${alert.metrics.join(", ")}`);
        lines.push("");
      });
    }

    // Recommendations
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("RECOMENDAÇÕES PERSONALIZADAS");
    lines.push("───────────────────────────────────────────────────────────");

    report.recommendations.forEach((rec, index) => {
      lines.push(`${index + 1}. ${rec}`);
    });
    lines.push("");

    // Footer
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("AVISO IMPORTANTE");
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("Este relatório é uma análise simulada para fins educacionais.");
    lines.push("Não substitui consulta médica profissional.");
    lines.push("Consulte seu médico para interpretação completa dos resultados.");
    lines.push("");
    lines.push("Gerado por: Bio-Twin OS");
    lines.push(`Data: ${new Date().toLocaleString("pt-BR")}`);
    lines.push("═══════════════════════════════════════════════════════════");

    return lines.join("\n");
  }

  /**
   * Generate CSV export for data analysis
   */
  static generateCSVExport(report: LongevityReport): string {
    const lines: string[] = [];

    // Header
    lines.push("Data,Passos,Sono (h),FC Repouso (bpm),HRV (ms),Calorias");

    // Health data
    report.healthHistory.forEach((record, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (report.healthHistory.length - index - 1));
      lines.push(
        `${date.toISOString().split("T")[0]},${record.steps},${record.sleepHours.toFixed(1)},${record.restingHeartRate},${record.hrvVariability},${record.activeCalories}`
      );
    });

    return lines.join("\n");
  }

  /**
   * Generate JSON export for integration with other systems
   */
  static generateJSONExport(report: LongevityReport): string {
    return JSON.stringify(
      {
        patient: report.patientName,
        reportDate: report.reportDate.toISOString(),
        scores: {
          bioScore: report.bioScore,
          longevityScore: report.longevityScore,
        },
        metrics: {
          avgSteps: (report.healthHistory.reduce((sum, r) => sum + r.steps, 0) / report.healthHistory.length).toFixed(0),
          avgSleep: (report.healthHistory.reduce((sum, r) => sum + r.sleepHours, 0) / report.healthHistory.length).toFixed(1),
          avgRestingHR: (report.healthHistory.reduce((sum, r) => sum + r.restingHeartRate, 0) / report.healthHistory.length).toFixed(0),
          avgHRV: (report.healthHistory.reduce((sum, r) => sum + r.hrvVariability, 0) / report.healthHistory.length).toFixed(0),
        },
        biomarkers: report.biomarkers,
        alerts: report.correlationAlerts.map((a) => ({
          title: a.title,
          riskLevel: a.riskLevel,
          bioScoreImpact: a.bioScoreImpact,
        })),
        recommendations: report.recommendations,
      },
      null,
      2
    );
  }
}
