import type { SyntheticHealthRecord, BiomarkerData } from "./synthetic-data-generator";

export interface CorrelationAlert {
  id: string;
  title: string;
  description: string;
  metrics: string[]; // Which metrics triggered this
  bioScoreImpact: number; // -15, -10, etc
  riskLevel: "critical" | "high" | "medium" | "low";
  recommendations: string[];
  timeframe: string; // "immediate", "today", "this week"
}

export interface HealthPattern {
  name: string;
  description: string;
  indicators: string[];
  prevalence: number; // 0-1
  interventionSuggestion: string;
}

/**
 * Longevity Brain Engine
 * Advanced correlation logic between multiple health metrics
 * Simulates AI-like analysis of health patterns
 */
export class LongevityBrain {
  /**
   * Analyze correlations between health metrics
   */
  static analyzeCorrelations(
    history: SyntheticHealthRecord[],
    biomarkers?: BiomarkerData
  ): CorrelationAlert[] {
    const alerts: CorrelationAlert[] = [];
    const latest = history[history.length - 1];

    // Correlation 1: Low Activity + Poor Sleep = Fatigue Risk
    if (latest.steps < 5000 && latest.sleepHours < 6) {
      alerts.push({
        id: "low-activity-poor-sleep",
        title: "Risco de Fadiga Crônica",
        description: `Você registrou ${latest.steps} passos e apenas ${latest.sleepHours.toFixed(1)}h de sono. Esta combinação aumenta significativamente o risco de fadiga e reduz a imunidade.`,
        metrics: ["steps", "sleepHours"],
        bioScoreImpact: -15,
        riskLevel: "high",
        recommendations: [
          "Priorize 7-8 horas de sono hoje",
          "Faça uma caminhada leve de 20 minutos",
          "Aumente ingestão de água (2L+)",
          "Evite cafeína após 14h",
        ],
        timeframe: "immediate",
      });
    }

    // Correlation 2: High Heart Rate + Low Sleep = Chronic Stress
    if (latest.restingHeartRate > 75 && latest.sleepHours < 7) {
      alerts.push({
        id: "high-hr-low-sleep-stress",
        title: "Padrão de Estresse Crônico Detectado",
        description: `Frequência cardíaca em repouso de ${latest.restingHeartRate} bpm + sono inadequado sugere ativação do sistema nervoso simpático.`,
        metrics: ["restingHeartRate", "sleepHours"],
        bioScoreImpact: -12,
        riskLevel: "high",
        recommendations: [
          "Prática de meditação: 10-15 minutos",
          "Respiração diafragmática: 4-7-8 (4s inspirar, 7s prender, 8s expirar)",
          "Redução de cafeína e álcool",
          "Consulte um especialista em sono",
        ],
        timeframe: "immediate",
      });
    }

    // Correlation 3: Low HRV + High Stress HR + Poor Sleep = Recovery Crisis
    if (latest.hrvVariability < 30 && latest.restingHeartRate > 70 && latest.sleepHours < 7) {
      alerts.push({
        id: "recovery-crisis",
        title: "Crise de Recuperação Detectada",
        description: `HRV baixa (${latest.hrvVariability}ms) + frequência cardíaca elevada + sono insuficiente indicam sistema nervoso autônomo comprometido.`,
        metrics: ["hrvVariability", "restingHeartRate", "sleepHours"],
        bioScoreImpact: -20,
        riskLevel: "critical",
        recommendations: [
          "URGENTE: Reduza atividades extenuantes",
          "Aumente sono para 8-9 horas",
          "Yoga restaurativo ou Tai Chi",
          "Suplementação: Magnesio + Omega-3",
          "Procure médico se persistir >3 dias",
        ],
        timeframe: "immediate",
      });
    }

    // Correlation 4: Sedentary + High Triglycerides = Metabolic Syndrome Risk
    if (biomarkers && latest.steps < 4000 && biomarkers.triglycerides > 150) {
      alerts.push({
        id: "metabolic-syndrome-risk",
        title: "Risco de Síndrome Metabólica",
        description: `Baixa atividade (${latest.steps} passos) + triglicerídeos elevados (${biomarkers.triglycerides} mg/dL) aumentam risco cardiovascular.`,
        metrics: ["steps", "triglycerides"],
        bioScoreImpact: -18,
        riskLevel: "high",
        recommendations: [
          "Aumento progressivo de atividade: +2000 passos/dia",
          "Redução de carboidratos refinados",
          "Aumento de fibras solúveis",
          "Exercício aeróbico: 30min, 5x/semana",
          "Monitoramento regular de lipídios",
        ],
        timeframe: "this week",
      });
    }

    // Correlation 5: Low Vitamin D + High Cortisol + Poor Sleep = Immune Suppression
    if (biomarkers && biomarkers.vitaminD < 30 && biomarkers.cortisol > 20 && latest.sleepHours < 7) {
      alerts.push({
        id: "immune-suppression",
        title: "Supressão Imunológica Detectada",
        description: `Vitamina D baixa + cortisol elevado + sono inadequado comprometem a imunidade.`,
        metrics: ["vitaminD", "cortisol", "sleepHours"],
        bioScoreImpact: -16,
        riskLevel: "high",
        recommendations: [
          "Exposição solar: 15-20 minutos entre 10h-11h",
          "Suplementação de Vitamina D: 2000-4000 IU/dia",
          "Alimentos ricos em Vitamina D: salmão, ovos, cogumelos",
          "Redução de estresse através de meditação",
          "Sono: 8-9 horas noturnas",
        ],
        timeframe: "this week",
      });
    }

    // Correlation 6: Excellent Metrics = Longevity Optimization
    if (
      latest.steps >= 10000 &&
      latest.sleepHours >= 7.5 &&
      latest.restingHeartRate <= 65 &&
      latest.hrvVariability >= 50
    ) {
      alerts.push({
        id: "longevity-optimization",
        title: "Padrão de Longevidade Otimizado",
        description: `Você está mantendo um padrão de saúde excepcional com atividade, sono, frequência cardíaca e HRV ideais.`,
        metrics: ["steps", "sleepHours", "restingHeartRate", "hrvVariability"],
        bioScoreImpact: +10,
        riskLevel: "low",
        recommendations: [
          "Mantenha os hábitos atuais",
          "Considere desafios de performance",
          "Explore otimização nutricional avançada",
          "Participe de estudos de longevidade",
        ],
        timeframe: "ongoing",
      });
    }

    // Sort by risk level
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return alerts.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
  }

  /**
   * Identify health patterns from historical data
   */
  static identifyPatterns(history: SyntheticHealthRecord[]): HealthPattern[] {
    const patterns: HealthPattern[] = [];

    // Calculate averages
    const avgSteps = history.reduce((sum, r) => sum + r.steps, 0) / history.length;
    const avgSleep = history.reduce((sum, r) => sum + r.sleepHours, 0) / history.length;
    const avgHR = history.reduce((sum, r) => sum + r.restingHeartRate, 0) / history.length;
    const avgHRV = history.reduce((sum, r) => sum + r.hrvVariability, 0) / history.length;

    // Pattern 1: Sedentary Lifestyle
    if (avgSteps < 6000) {
      patterns.push({
        name: "Estilo de Vida Sedentário",
        description: "Atividade física abaixo do recomendado",
        indicators: ["low_steps", "low_calories"],
        prevalence: (6000 - avgSteps) / 6000,
        interventionSuggestion: "Aumente atividade gradualmente: +1000 passos/semana",
      });
    }

    // Pattern 2: Sleep Deprivation
    if (avgSleep < 7) {
      patterns.push({
        name: "Privação de Sono",
        description: "Sono insuficiente ou irregular",
        indicators: ["low_sleep", "variable_sleep"],
        prevalence: (7 - avgSleep) / 7,
        interventionSuggestion: "Estabeleça rotina consistente: dormir/acordar mesmos horários",
      });
    }

    // Pattern 3: Chronic Stress
    if (avgHR > 72) {
      patterns.push({
        name: "Estresse Crônico",
        description: "Frequência cardíaca em repouso elevada",
        indicators: ["high_resting_hr", "low_hrv"],
        prevalence: (avgHR - 60) / 20,
        interventionSuggestion: "Prática diária de mindfulness: 10-20 minutos",
      });
    }

    // Pattern 4: Low Cardiovascular Variability
    if (avgHRV < 40) {
      patterns.push({
        name: "Baixa Variabilidade Cardíaca",
        description: "Sistema nervoso autônomo pouco flexível",
        indicators: ["low_hrv", "high_stress"],
        prevalence: (40 - avgHRV) / 40,
        interventionSuggestion: "Exercícios de respiração e yoga: 30min, 3x/semana",
      });
    }

    return patterns;
  }

  /**
   * Calculate adjusted Bio-Score based on correlations
   */
  static calculateAdjustedBioScore(
    baseScore: number,
    correlationAlerts: CorrelationAlert[]
  ): { adjustedScore: number; totalImpact: number } {
    const totalImpact = correlationAlerts.reduce((sum, alert) => sum + alert.bioScoreImpact, 0);
    const adjustedScore = Math.max(0, Math.min(100, baseScore + totalImpact));

    return { adjustedScore, totalImpact };
  }

  /**
   * Generate longevity score (0-100) based on all factors
   */
  static calculateLongevityScore(
    history: SyntheticHealthRecord[],
    biomarkers?: BiomarkerData
  ): number {
    const latest = history[history.length - 1];
    let score = 50;

    // Activity contribution (25 points)
    if (latest.steps >= 10000) score += 25;
    else if (latest.steps >= 8000) score += 20;
    else if (latest.steps >= 5000) score += 15;
    else if (latest.steps >= 3000) score += 10;

    // Sleep contribution (25 points)
    if (latest.sleepHours >= 7 && latest.sleepHours <= 9) score += 25;
    else if (latest.sleepHours >= 6.5) score += 20;
    else if (latest.sleepHours >= 6) score += 15;

    // Cardiovascular contribution (25 points)
    if (latest.restingHeartRate >= 60 && latest.restingHeartRate <= 70) score += 25;
    else if (latest.restingHeartRate >= 55 && latest.restingHeartRate <= 75) score += 20;
    else if (latest.restingHeartRate >= 50 && latest.restingHeartRate <= 85) score += 15;

    // HRV contribution (25 points)
    if (latest.hrvVariability >= 50) score += 25;
    else if (latest.hrvVariability >= 40) score += 20;
    else if (latest.hrvVariability >= 30) score += 15;
    else if (latest.hrvVariability >= 20) score += 10;

    return Math.min(100, score);
  }
}
