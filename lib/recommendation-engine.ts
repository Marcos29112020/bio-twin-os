import type { HealthData } from "@/hooks/use-health-data";

export interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: "alert" | "tip" | "trend";
  category: "sleep" | "activity" | "stress" | "recovery";
}

/**
 * Recommendation Engine
 * Generates personalized health recommendations based on health data
 */
export class RecommendationEngine {
  /**
   * Generate daily recommendation based on health metrics
   */
  static generateDailyRecommendation(data: HealthData): Recommendation {
    // Sleep analysis
    if (data.sleepHours < 6) {
      return {
        title: "Priorize uma soneca de 20 minutos",
        description:
          "Você dormiu menos de 6 horas na noite passada. Uma soneca rápida pode restaurar sua energia e melhorar o foco. Tente entre 13h e 15h.",
        priority: "high",
        icon: "alert",
        category: "sleep",
      };
    }

    if (data.sleepHours < 7) {
      return {
        title: "Durma mais amanhã",
        description:
          "Você dormiu um pouco menos do recomendado (7-9 horas). Tente ir para a cama 30 minutos mais cedo para melhorar sua recuperação.",
        priority: "medium",
        icon: "tip",
        category: "sleep",
      };
    }

    // Activity analysis
    if (data.steps < 5000) {
      return {
        title: "Aumente sua atividade",
        description:
          "Você atingiu menos de 5.000 passos hoje. Tente caminhar 30 minutos durante o almoço ou fazer uma atividade leve para atingir 10.000 passos.",
        priority: "high",
        icon: "alert",
        category: "activity",
      };
    }

    if (data.steps < 8000) {
      return {
        title: "Continue se movimentando",
        description:
          "Você está no caminho certo! Mais 2.000 passos e você atingirá a meta diária de 10.000. Faça uma caminhada rápida para completar.",
        priority: "medium",
        icon: "trend",
        category: "activity",
      };
    }

    // Heart rate analysis
    if (data.restingHeartRate > 75) {
      return {
        title: "Reduza o estresse",
        description:
          "Sua frequência cardíaca em repouso está elevada (> 75 bpm), indicando possível estresse. Tente meditação ou respiração profunda por 10 minutos.",
        priority: "high",
        icon: "alert",
        category: "stress",
      };
    }

    if (data.restingHeartRate > 70) {
      return {
        title: "Pratique relaxamento",
        description:
          "Sua frequência cardíaca em repouso está um pouco elevada. Atividades como yoga ou caminhada podem ajudar a reduzi-la.",
        priority: "medium",
        icon: "tip",
        category: "stress",
      };
    }

    // Recovery analysis
    if (data.sleepHours >= 7 && data.steps >= 8000 && data.restingHeartRate <= 70) {
      return {
        title: "Você está em ótima forma!",
        description:
          "Seus métricas de sono, atividade e frequência cardíaca estão excelentes. Continue mantendo esses hábitos saudáveis!",
        priority: "low",
        icon: "trend",
        category: "recovery",
      };
    }

    // Default recommendation
    return {
      title: "Mantenha o ritmo",
      description:
        "Seus dados de saúde estão dentro do esperado. Continue monitorando suas métricas e ajuste conforme necessário.",
      priority: "low",
      icon: "tip",
      category: "recovery",
    };
  }

  /**
   * Calculate Bio-Score (0-100) based on health metrics
   */
  static calculateBioScore(data: HealthData): number {
    let score = 50; // Base score

    // Sleep score (max +25)
    if (data.sleepHours >= 7 && data.sleepHours <= 9) {
      score += 25;
    } else if (data.sleepHours >= 6.5 && data.sleepHours < 7) {
      score += 20;
    } else if (data.sleepHours >= 6 && data.sleepHours < 6.5) {
      score += 15;
    } else if (data.sleepHours < 6) {
      score += 5;
    }

    // Activity score (max +25)
    if (data.steps >= 10000) {
      score += 25;
    } else if (data.steps >= 8000) {
      score += 20;
    } else if (data.steps >= 5000) {
      score += 15;
    } else if (data.steps >= 3000) {
      score += 10;
    }

    // Heart rate score (max +25)
    if (data.restingHeartRate >= 60 && data.restingHeartRate <= 70) {
      score += 25;
    } else if (data.restingHeartRate >= 55 && data.restingHeartRate < 60) {
      score += 20;
    } else if (data.restingHeartRate >= 70 && data.restingHeartRate <= 75) {
      score += 20;
    } else if (data.restingHeartRate >= 75 && data.restingHeartRate <= 85) {
      score += 10;
    }

    // Calorie burn score (max +25)
    if (data.activeCalories >= 500) {
      score += 25;
    } else if (data.activeCalories >= 400) {
      score += 20;
    } else if (data.activeCalories >= 300) {
      score += 15;
    } else if (data.activeCalories >= 200) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Get activity status based on steps
   */
  static getActivityStatus(steps: number): string {
    if (steps >= 10000) return "Muito ativo";
    if (steps >= 8000) return "Ativo";
    if (steps >= 5000) return "Moderado";
    if (steps >= 3000) return "Pouco ativo";
    return "Sedentário";
  }

  /**
   * Get recovery status based on sleep
   */
  static getRecoveryStatus(sleepHours: number): string {
    if (sleepHours >= 7 && sleepHours <= 9) return "Ótima";
    if (sleepHours >= 6.5) return "Boa";
    if (sleepHours >= 6) return "Adequada";
    return "Insuficiente";
  }

  /**
   * Get stress status based on heart rate
   */
  static getStressStatus(restingHeartRate: number): string {
    if (restingHeartRate >= 60 && restingHeartRate <= 70) return "Baixo";
    if (restingHeartRate >= 70 && restingHeartRate <= 80) return "Moderado";
    if (restingHeartRate > 80) return "Elevado";
    return "Muito baixo";
  }
}
