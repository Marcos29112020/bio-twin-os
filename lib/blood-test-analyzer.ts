import type { BiomarkerData } from "./synthetic-data-generator";

export interface BloodTestAnalysis {
  biomarker: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
  severity: "critical" | "warning" | "info" | "normal";
  interpretation: string;
  recommendations: string[];
  actionTimeframe: "immediate" | "this_week" | "this_month";
}

export interface BloodTestReport {
  timestamp: Date;
  analyses: BloodTestAnalysis[];
  overallAssessment: string;
  priorityActions: string[];
  followUpTests?: string[];
}

/**
 * Blood Test Analyzer
 * Simulates analysis of blood test results with AI-like interpretation
 */
export class BloodTestAnalyzer {
  /**
   * Analyze complete blood test results
   */
  static analyzeBloodTest(biomarkers: BiomarkerData): BloodTestReport {
    const analyses: BloodTestAnalysis[] = [];

    // Cortisol Analysis
    analyses.push(
      this.analyzeCortisol(biomarkers.cortisol)
    );

    // Vitamin D Analysis
    analyses.push(
      this.analyzeVitaminD(biomarkers.vitaminD)
    );

    // Hemoglobin Analysis
    analyses.push(
      this.analyzeHemoglobin(biomarkers.hemoglobin)
    );

    // Glucose Analysis
    analyses.push(
      this.analyzeGlucose(biomarkers.glucose)
    );

    // Triglycerides Analysis
    analyses.push(
      this.analyzeTriglycerides(biomarkers.triglycerides)
    );

    // Cholesterol Analysis
    analyses.push(
      this.analyzeCholesterol(biomarkers.cholesterol)
    );

    // Generate overall assessment
    const criticalCount = analyses.filter((a) => a.severity === "critical").length;
    const warningCount = analyses.filter((a) => a.severity === "warning").length;

    let overallAssessment = "";
    if (criticalCount > 0) {
      overallAssessment =
        "Resultados críticos detectados. Consulte um médico imediatamente.";
    } else if (warningCount > 2) {
      overallAssessment =
        "Vários marcadores fora do ideal. Recomenda-se consulta médica em breve.";
    } else if (warningCount > 0) {
      overallAssessment =
        "Alguns marcadores requerem atenção. Implemente as recomendações sugeridas.";
    } else {
      overallAssessment = "Resultados geralmente dentro dos limites normais. Mantenha os hábitos saudáveis.";
    }

    // Priority actions
    const priorityActions = analyses
      .filter((a) => a.severity === "critical" || a.severity === "warning" || a.severity === "info")
      .flatMap((a) => a.recommendations.slice(0, 2));

    return {
      timestamp: biomarkers.timestamp,
      analyses,
      overallAssessment,
      priorityActions: [...new Set(priorityActions)].slice(0, 5),
      followUpTests: this.suggestFollowUpTests(analyses),
    };
  }

  /**
   * Analyze Cortisol levels
   */
  private static analyzeCortisol(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value < 8) {
      status = "low";
      severity = "info";
      interpretation =
        "Cortisol baixo pode indicar insuficiência adrenal ou fadiga crônica.";
      recommendations = [
        "Aumente ingestão de sal (1-2g/dia)",
        "Suplementação com DHEA (consulte médico)",
        "Aumente atividade física moderada",
        "Evite períodos prolongados de jejum",
      ];
    } else if (value > 20) {
      status = "high";
      severity = "critical";
      interpretation =
        "Cortisol elevado indica estresse crônico e pode comprometer imunidade.";
      recommendations = [
        "Redução de estresse: meditação 15min/dia",
        "Aumente sono para 8-9 horas",
        "Evite cafeína após 14h",
        "Suplementação: Ashwagandha ou Rhodiola",
      ];
    } else {
      severity = "normal";
      interpretation = "Cortisol dentro dos limites normais.";
      recommendations = ["Mantenha rotina de sono consistente", "Continue com práticas de relaxamento"];
    }

    return {
      biomarker: "Cortisol",
      value,
      unit: "µg/dL",
      referenceMin: 10,
      referenceMax: 20,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: (severity === "critical" ? "immediate" : "this_week") as "immediate" | "this_week" | "this_month",
    };
  }

  /**
   * Analyze Vitamin D levels
   */
  private static analyzeVitaminD(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value < 20) {
      status = "low";
      severity = "critical";
      interpretation =
        "Deficiência severa de Vitamina D. Aumenta risco de osteoporose, infecções e depressão.";
      recommendations = [
        "Suplementação imediata: 4000-5000 IU/dia",
        "Exposição solar: 15-20 minutos entre 10h-11h, 4-5x/semana",
        "Alimentos ricos em Vitamina D: salmão, sardinha, gema de ovo",
        "Retest em 8 semanas",
      ];
    } else if (value < 30) {
      status = "low";
      severity = "warning";
      interpretation = "Vitamina D insuficiente. Recomenda-se suplementação.";
      recommendations = [
        "Suplementação: 2000-3000 IU/dia",
        "Exposição solar: 15-20 minutos entre 10h-11h, 3-4x/semana",
        "Aumente consumo de peixes gordurosos",
        "Retest em 12 semanas",
      ];
    } else if (value > 100) {
      status = "high";
      severity = "warning";
      interpretation = "Vitamina D excessivamente elevada. Pode causar hipercalcemia.";
      recommendations = [
        "Reduza suplementação",
        "Aumente ingestão de água",
        "Monitore níveis de cálcio",
        "Consulte médico",
      ];
    } else {
      interpretation = "Vitamina D em nível ótimo para saúde óssea e imunidade.";
      recommendations = [
        "Mantenha exposição solar regular",
        "Continue com suplementação se aplicável",
      ];
    }

    return {
      biomarker: "Vitamina D",
      value,
      unit: "ng/mL",
      referenceMin: 30,
      referenceMax: 100,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: (severity === "critical" ? "immediate" : "this_week") as "immediate" | "this_week" | "this_month",
    };
  }

  /**
   * Analyze Hemoglobin levels
   */
  private static analyzeHemoglobin(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value < 12) {
      status = "low";
      severity = "warning";
      interpretation = "Anemia leve detectada. Pode causar fadiga e falta de ar.";
      recommendations = [
        "Aumente ingestão de ferro: carne vermelha, feijão, espinafre",
        "Suplementação de ferro (consulte médico)",
        "Aumente vitamina C para melhor absorção",
        "Retest em 6-8 semanas",
      ];
    } else if (value > 17.5) {
      status = "high";
      severity = "info";
      interpretation = "Hemoglobina elevada. Pode indicar desidratação ou policitemia.";
      recommendations = [
        "Aumente ingestão de água (2-3L/dia)",
        "Reduza altitude ou atividades extenuantes",
        "Monitore hidratação durante exercício",
      ];
    } else {
      interpretation = "Hemoglobina em nível normal. Boa capacidade de transporte de oxigênio.";
      recommendations = ["Mantenha dieta balanceada", "Continue com atividade física regular"];
    }

    return {
      biomarker: "Hemoglobina",
      value,
      unit: "g/dL",
      referenceMin: 13.5,
      referenceMax: 17.5,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: "this_month",
    };
  }

  /**
   * Analyze Glucose levels
   */
  private static analyzeGlucose(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value < 70) {
      status = "low";
      severity = "warning";
      interpretation = "Glicose baixa em jejum. Pode indicar hipoglicemia ou problemas metabólicos.";
      recommendations = [
        "Aumente ingestão de carboidratos complexos",
        "Coma pequenas refeições a cada 3 horas",
        "Evite períodos prolongados de jejum",
        "Consulte endocrinologista",
      ];
    } else if (value > 110) {
      status = "high";
      severity = "warning";
      interpretation =
        "Glicose em jejum elevada. Risco aumentado de pré-diabetes ou diabetes.";
      recommendations = [
        "Reduza carboidratos refinados e açúcares",
        "Aumente fibras solúveis",
        "Exercício aeróbico: 30min, 5x/semana",
        "Perda de peso se necessário",
        "Retest em 3 meses",
      ];
    } else {
      interpretation = "Glicose em jejum normal. Metabolismo de carboidratos adequado.";
      recommendations = [
        "Mantenha dieta balanceada",
        "Continue com atividade física regular",
      ];
    }

    return {
      biomarker: "Glicose (Jejum)",
      value,
      unit: "mg/dL",
      referenceMin: 70,
      referenceMax: 100,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: status === "high" ? "this_week" : "this_month",
    };
  }

  /**
   * Analyze Triglycerides levels
   */
  private static analyzeTriglycerides(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value > 200) {
      status = "high";
      severity = "critical";
      interpretation =
        "Triglicerídeos muito elevados. Risco significativo de doença cardiovascular.";
      recommendations = [
        "Reduza carboidratos refinados e açúcares",
        "Aumente ômega-3: salmão, sardinha, linhaça",
        "Exercício aeróbico: 45min, 5x/semana",
        "Suplementação: Ômega-3 (1000-2000mg/dia)",
        "Consulte cardiologista",
      ];
    } else if (value > 150) {
      status = "high";
      severity = "warning";
      interpretation = "Triglicerídeos elevados. Aumenta risco cardiovascular.";
      recommendations = [
        "Reduza gorduras saturadas",
        "Aumente atividade física",
        "Reduza álcool",
        "Suplementação: Ômega-3",
        "Retest em 3 meses",
      ];
    } else {
      interpretation = "Triglicerídeos em nível saudável.";
      recommendations = [
        "Mantenha dieta balanceada",
        "Continue com exercício regular",
      ];
    }

    return {
      biomarker: "Triglicerídeos",
      value,
      unit: "mg/dL",
      referenceMin: 0,
      referenceMax: 150,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: (severity === "critical" ? "immediate" : "this_week") as "immediate" | "this_week" | "this_month",
    };
  }

  /**
   * Analyze Cholesterol levels
   */
  private static analyzeCholesterol(value: number): BloodTestAnalysis {
    let status: "low" | "normal" | "high" = "normal";
    let severity: "critical" | "warning" | "info" | "normal" = "normal";
    let interpretation = "";
    let recommendations: string[] = [];

    if (value > 240) {
      status = "high";
      severity = "warning";
      interpretation =
        "Colesterol total elevado. Aumenta risco de aterosclerose e doença cardíaca.";
      recommendations = [
        "Reduza gorduras saturadas",
        "Aumente fibras solúveis",
        "Exercício aeróbico: 30min, 5x/semana",
        "Suplementação: Esteróis vegetais ou Policosanol",
        "Retest em 3 meses",
      ];
    } else if (value > 200) {
      status = "high";
      severity = "info";
      interpretation = "Colesterol total ligeiramente elevado.";
      recommendations = [
        "Aumente alimentos com gorduras insaturadas",
        "Reduza carboidratos refinados",
        "Aumente atividade física",
      ];
    } else {
      interpretation = "Colesterol total em nível desejável.";
      recommendations = [
        "Mantenha dieta saudável",
        "Continue com exercício regular",
      ];
    }

    return {
      biomarker: "Colesterol Total",
      value,
      unit: "mg/dL",
      referenceMin: 0,
      referenceMax: 200,
      status,
      severity,
      interpretation,
      recommendations,
      actionTimeframe: "this_month",
    };
  }

  /**
   * Suggest follow-up tests based on results
   */
  private static suggestFollowUpTests(analyses: BloodTestAnalysis[]): string[] {
    const tests: Set<string> = new Set();

    analyses.forEach((analysis) => {
      if (analysis.biomarker === "Glicose (Jejum)" && analysis.status === "high") {
        tests.add("HbA1c (Hemoglobina Glicada)");
        tests.add("Teste de Tolerância à Glicose");
      }
      if (analysis.biomarker === "Triglicerídeos" && analysis.status === "high") {
        tests.add("Lipidograma Completo (HDL, LDL)");
        tests.add("Apoliproteína B");
      }
      if (analysis.biomarker === "Cortisol" && analysis.status === "high") {
        tests.add("Teste de Supressão de Dexametasona");
        tests.add("Cortisol Salivar 24h");
      }
      if (analysis.biomarker === "Vitamina D" && analysis.status === "low") {
        tests.add("Cálcio Sérico");
        tests.add("Fósforo");
        tests.add("Fosfatase Alcalina");
      }
    });

    return Array.from(tests);
  }
}
