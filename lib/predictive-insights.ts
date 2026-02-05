import type { SyntheticHealthRecord, BiomarkerData } from "./synthetic-data-generator";

export type InsightPriority = "urgent" | "important" | "informational";
export type InsightCategory =
  | "sleep"
  | "activity"
  | "stress"
  | "recovery"
  | "nutrition"
  | "meditation"
  | "hydration";

export interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  action: string; // Specific actionable recommendation
  priority: InsightPriority;
  category: InsightCategory;
  icon: "alert" | "tip" | "trend" | "meditation" | "water";
  timeToAct?: string; // e.g., "now", "today", "this week"
  estimatedImpact?: string; // e.g., "+15% HRV improvement"
  timestamp: Date;
}

/**
 * Predictive Insights Engine
 * Generates actionable, AI-like recommendations based on health patterns
 */
export class PredictiveInsightsEngine {
  /**
   * Generate insights from 7-day health history
   */
  static generateInsights(
    history: SyntheticHealthRecord[],
    biomarkers?: BiomarkerData
  ): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Analyze trends
    const hrvTrend = this.analyzeHRVTrend(history);
    const sleepTrend = this.analyzeSleepTrend(history);
    const stressTrend = this.analyzeStressTrend(history);
    const activityTrend = this.analyzeActivityTrend(history);

    // HRV-based insights
    if (hrvTrend.change < -10) {
      insights.push({
        id: "hrv-drop-meditation",
        title: "Sua variabilidade cardíaca caiu",
        description:
          "Detectamos uma queda de " +
          Math.abs(hrvTrend.change).toFixed(1) +
          "% na sua HRV nos últimos dias, indicando possível estresse acumulado.",
        action: "Faça 5 minutos de meditação agora",
        priority: "urgent",
        category: "meditation",
        icon: "meditation",
        timeToAct: "now",
        estimatedImpact: "+15% HRV improvement",
        timestamp: new Date(),
      });
    } else if (hrvTrend.change < -5) {
      insights.push({
        id: "hrv-slight-drop",
        title: "Variabilidade cardíaca em declínio",
        description:
          "Sua HRV mostrou uma tendência de queda. Considere aumentar atividades relaxantes.",
        action: "Pratique respiração profunda por 10 minutos",
        priority: "important",
        category: "meditation",
        icon: "tip",
        timeToAct: "today",
        estimatedImpact: "+8% HRV improvement",
        timestamp: new Date(),
      });
    }

    // Sleep-based insights
    if (sleepTrend.average < 6) {
      insights.push({
        id: "sleep-insufficient",
        title: "Sono insuficiente detectado",
        description:
          "Você dormiu em média " +
          sleepTrend.average.toFixed(1) +
          " horas nos últimos dias. Recomendado: 7-9 horas.",
        action: "Priorize uma soneca de 20 minutos entre 13h-15h",
        priority: "urgent",
        category: "sleep",
        icon: "alert",
        timeToAct: "today",
        estimatedImpact: "+30% energy restoration",
        timestamp: new Date(),
      });
    } else if (sleepTrend.average < 7) {
      insights.push({
        id: "sleep-suboptimal",
        title: "Qualidade de sono abaixo do ideal",
        description:
          "Você dormiu " +
          sleepTrend.average.toFixed(1) +
          " horas em média. Um pouco mais de sono pode melhorar sua recuperação.",
        action: "Durma 30 minutos mais cedo amanhã",
        priority: "important",
        category: "sleep",
        icon: "tip",
        timeToAct: "tonight",
        estimatedImpact: "+10% recovery",
        timestamp: new Date(),
      });
    }

    // Stress-based insights
    if (stressTrend.average > 75) {
      insights.push({
        id: "stress-elevated",
        title: "Níveis de estresse elevados",
        description:
          "Sua frequência cardíaca em repouso está em " +
          stressTrend.average.toFixed(0) +
          " bpm, indicando estresse elevado.",
        action: "Realize uma sessão de yoga ou caminhada de 20 minutos",
        priority: "urgent",
        category: "stress",
        icon: "alert",
        timeToAct: "now",
        estimatedImpact: "-12 bpm resting heart rate",
        timestamp: new Date(),
      });
    } else if (stressTrend.average > 70) {
      insights.push({
        id: "stress-moderate",
        title: "Estresse moderado detectado",
        description:
          "Sua frequência cardíaca em repouso está ligeiramente elevada. Relaxamento pode ajudar.",
        action: "Pratique meditação guiada ou respiração profunda",
        priority: "important",
        category: "meditation",
        icon: "tip",
        timeToAct: "today",
        estimatedImpact: "-5 bpm resting heart rate",
        timestamp: new Date(),
      });
    }

    // Activity-based insights
    if (activityTrend.average < 5000) {
      insights.push({
        id: "activity-low",
        title: "Atividade física insuficiente",
        description:
          "Você atingiu em média " +
          activityTrend.average.toFixed(0) +
          " passos. Meta recomendada: 10.000 passos.",
        action: "Caminhe 30 minutos durante o almoço",
        priority: "important",
        category: "activity",
        icon: "trend",
        timeToAct: "today",
        estimatedImpact: "+2000 steps",
        timestamp: new Date(),
      });
    } else if (activityTrend.average < 8000) {
      insights.push({
        id: "activity-moderate",
        title: "Você está no caminho certo",
        description:
          "Você atingiu " +
          activityTrend.average.toFixed(0) +
          " passos em média. Mais um pouco para atingir a meta!",
        action: "Faça uma caminhada rápida para completar 10.000 passos",
        priority: "informational",
        category: "activity",
        icon: "tip",
        timeToAct: "today",
        estimatedImpact: "+2000 steps",
        timestamp: new Date(),
      });
    }

    // Hydration insight (always good to remind)
    if (Math.random() > 0.5) {
      insights.push({
        id: "hydration-reminder",
        title: "Mantenha-se hidratado",
        description:
          "Uma boa hidratação melhora a variabilidade cardíaca e reduz o estresse.",
        action: "Beba 500ml de água agora",
        priority: "informational",
        category: "hydration",
        icon: "water",
        timeToAct: "now",
        estimatedImpact: "+5% HRV improvement",
        timestamp: new Date(),
      });
    }

    // Biomarker-based insights
    if (biomarkers) {
      const bioInsights = this.generateBiomarkerInsights(biomarkers);
      insights.push(...bioInsights);
    }

    // Sort by priority
    return insights.sort((a, b) => {
      const priorityOrder = { urgent: 0, important: 1, informational: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Generate insights from biomarker data
   */
  private static generateBiomarkerInsights(biomarkers: BiomarkerData): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Cortisol insights
    if (biomarkers.cortisol > 20) {
      insights.push({
        id: "cortisol-high",
        title: "Cortisol elevado detectado",
        description:
          "Seu nível de cortisol está em " +
          biomarkers.cortisol.toFixed(1) +
          " µg/dL (normal: 10-20). Isso indica estresse crônico.",
        action: "Aumente atividades relaxantes: yoga, meditação ou massagem",
        priority: "important",
        category: "stress",
        icon: "alert",
        timeToAct: "this week",
        estimatedImpact: "-2 µg/dL cortisol reduction",
        timestamp: new Date(),
      });
    }

    // Vitamin D insights
    if (biomarkers.vitaminD < 30) {
      insights.push({
        id: "vitamin-d-low",
        title: "Vitamina D baixa",
        description:
          "Seu nível de vitamina D está em " +
          biomarkers.vitaminD.toFixed(1) +
          " ng/mL (ótimo: 30-50). Deficiência pode afetar humor e imunidade.",
        action: "Aumente exposição ao sol (15-20 min/dia) ou suplemento",
        priority: "important",
        category: "nutrition",
        icon: "tip",
        timeToAct: "this week",
        estimatedImpact: "+10 ng/mL vitamin D",
        timestamp: new Date(),
      });
    }

    // Glucose insights
    if (biomarkers.glucose > 110) {
      insights.push({
        id: "glucose-elevated",
        title: "Glicose em jejum elevada",
        description:
          "Seu nível de glicose está em " +
          biomarkers.glucose.toFixed(0) +
          " mg/dL (normal: 70-100). Considere revisar sua alimentação.",
        action: "Reduza carboidratos refinados e aumente atividade física",
        priority: "important",
        category: "nutrition",
        icon: "alert",
        timeToAct: "this week",
        estimatedImpact: "-15 mg/dL glucose",
        timestamp: new Date(),
      });
    }

    // Triglycerides insights
    if (biomarkers.triglycerides > 150) {
      insights.push({
        id: "triglycerides-high",
        title: "Triglicerídeos elevados",
        description:
          "Seu nível de triglicerídeos está em " +
          biomarkers.triglycerides.toFixed(0) +
          " mg/dL (normal: <150). Isso pode indicar risco cardiovascular.",
        action: "Aumente exercício aeróbico e reduza açúcares simples",
        priority: "important",
        category: "activity",
        icon: "alert",
        timeToAct: "this week",
        estimatedImpact: "-30 mg/dL triglycerides",
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Analyze HRV trend over 7 days
   */
  private static analyzeHRVTrend(history: SyntheticHealthRecord[]) {
    const firstHalf = history.slice(0, Math.floor(history.length / 2));
    const secondHalf = history.slice(Math.floor(history.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + r.hrvVariability, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.hrvVariability, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    return { firstAvg, secondAvg, change };
  }

  /**
   * Analyze sleep trend over 7 days
   */
  private static analyzeSleepTrend(history: SyntheticHealthRecord[]) {
    const average = history.reduce((sum, r) => sum + r.sleepHours, 0) / history.length;
    const trend = history[history.length - 1].sleepHours - history[0].sleepHours;

    return { average, trend };
  }

  /**
   * Analyze stress trend (resting heart rate)
   */
  private static analyzeStressTrend(history: SyntheticHealthRecord[]) {
    const average = history.reduce((sum, r) => sum + r.restingHeartRate, 0) / history.length;
    const trend = history[history.length - 1].restingHeartRate - history[0].restingHeartRate;

    return { average, trend };
  }

  /**
   * Analyze activity trend over 7 days
   */
  private static analyzeActivityTrend(history: SyntheticHealthRecord[]) {
    const average = history.reduce((sum, r) => sum + r.steps, 0) / history.length;
    const trend = history[history.length - 1].steps - history[0].steps;

    return { average, trend };
  }
}
