import type { HealthData } from "@/hooks/use-health-data";

export type UserProfile = "healthy" | "irregular_sleep" | "high_stress" | "sedentary";

export interface SyntheticHealthRecord extends HealthData {
  dayIndex: number; // 0-6 for 7-day history
  hrvVariability: number; // Heart Rate Variability (ms)
  deepSleep: number; // Percentage of deep sleep
  remSleep: number; // Percentage of REM sleep
}

export interface BiomarkerData {
  cortisol: number; // µg/dL
  vitaminD: number; // ng/mL
  hemoglobin: number; // g/dL
  glucose: number; // mg/dL
  triglycerides: number; // mg/dL
  cholesterol: number; // mg/dL
  timestamp: Date;
}

/**
 * Synthetic Data Generator
 * Creates realistic health data for testing and demonstration
 */
export class SyntheticDataGenerator {
  /**
   * Generate 7-day health data history for a specific profile
   */
  static generate7DayHistory(profile: UserProfile): SyntheticHealthRecord[] {
    const records: SyntheticHealthRecord[] = [];
    const today = new Date();

    for (let dayIndex = 6; dayIndex >= 0; dayIndex--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayIndex);

      const record = this.generateDailyRecord(profile, dayIndex, date);
      records.push(record);
    }

    return records;
  }

  /**
   * Generate a single day's health record
   */
  private static generateDailyRecord(
    profile: UserProfile,
    dayIndex: number,
    date: Date
  ): SyntheticHealthRecord {
    switch (profile) {
      case "irregular_sleep":
        return this.generateIrregularSleepDay(dayIndex, date);
      case "high_stress":
        return this.generateHighStressDay(dayIndex, date);
      case "sedentary":
        return this.generateSedentaryDay(dayIndex, date);
      case "healthy":
      default:
        return this.generateHealthyDay(dayIndex, date);
    }
  }

  /**
   * Generate healthy profile day
   */
  private static generateHealthyDay(dayIndex: number, date: Date): SyntheticHealthRecord {
    return {
      dayIndex,
      steps: this.randomRange(9000, 12000),
      restingHeartRate: this.randomRange(58, 65),
      sleepHours: this.randomRange(7.5, 8.5),
      activeCalories: this.randomRange(450, 600),
      distance: this.randomRange(6.5, 8.5),
      hrvVariability: this.randomRange(45, 65),
      deepSleep: this.randomRange(15, 25),
      remSleep: this.randomRange(20, 25),
      timestamp: date,
    };
  }

  /**
   * Generate irregular sleep profile day
   * Characteristics: 5-6 hours sleep, variable times, low HRV
   */
  private static generateIrregularSleepDay(dayIndex: number, date: Date): SyntheticHealthRecord {
    // Simulate irregular sleep pattern
    const sleepVariation = Math.sin((dayIndex * Math.PI) / 3.5) * 1.5;
    const baseSleep = 5.5;
    const sleepHours = Math.max(4.5, Math.min(7, baseSleep + sleepVariation));

    return {
      dayIndex,
      steps: this.randomRange(6000, 9000),
      restingHeartRate: this.randomRange(68, 78), // Elevated due to poor sleep
      sleepHours,
      activeCalories: this.randomRange(300, 450),
      distance: this.randomRange(4, 6),
      hrvVariability: this.randomRange(25, 40), // Lower HRV due to stress
      deepSleep: this.randomRange(8, 15), // Reduced deep sleep
      remSleep: this.randomRange(12, 18),
      timestamp: date,
    };
  }

  /**
   * Generate high stress profile day
   * Characteristics: elevated resting heart rate, poor sleep quality, low HRV
   */
  private static generateHighStressDay(dayIndex: number, date: Date): SyntheticHealthRecord {
    // Simulate stress pattern with slight improvement over time
    const stressReduction = dayIndex * 0.5;

    return {
      dayIndex,
      steps: this.randomRange(5000, 8000),
      restingHeartRate: Math.max(70, this.randomRange(80, 95) - stressReduction), // Elevated stress
      sleepHours: this.randomRange(6, 7.5),
      activeCalories: this.randomRange(250, 400),
      distance: this.randomRange(3, 5),
      hrvVariability: Math.max(20, this.randomRange(30, 45) - stressReduction), // Low HRV
      deepSleep: this.randomRange(10, 18),
      remSleep: this.randomRange(15, 20),
      timestamp: date,
    };
  }

  /**
   * Generate sedentary profile day
   * Characteristics: low steps, high resting heart rate, poor sleep
   */
  private static generateSedentaryDay(dayIndex: number, date: Date): SyntheticHealthRecord {
    return {
      dayIndex,
      steps: this.randomRange(2000, 4000),
      restingHeartRate: this.randomRange(72, 85),
      sleepHours: this.randomRange(6.5, 8),
      activeCalories: this.randomRange(150, 300),
      distance: this.randomRange(1, 3),
      hrvVariability: this.randomRange(30, 45),
      deepSleep: this.randomRange(12, 20),
      remSleep: this.randomRange(18, 25),
      timestamp: date,
    };
  }

  /**
   * Generate synthetic biomarker data from lab exam
   */
  static generateBiomarkers(profile: UserProfile): BiomarkerData {
    switch (profile) {
      case "high_stress":
        return {
          cortisol: this.randomRange(18, 25), // Elevated cortisol
          vitaminD: this.randomRange(20, 30), // Low vitamin D
          hemoglobin: this.randomRange(13, 14.5),
          glucose: this.randomRange(95, 110),
          triglycerides: this.randomRange(120, 180),
          cholesterol: this.randomRange(200, 240),
          timestamp: new Date(),
        };
      case "irregular_sleep":
        return {
          cortisol: this.randomRange(15, 22),
          vitaminD: this.randomRange(25, 35),
          hemoglobin: this.randomRange(13.5, 15),
          glucose: this.randomRange(90, 105),
          triglycerides: this.randomRange(100, 150),
          cholesterol: this.randomRange(180, 220),
          timestamp: new Date(),
        };
      case "sedentary":
        return {
          cortisol: this.randomRange(16, 24),
          vitaminD: this.randomRange(15, 28),
          hemoglobin: this.randomRange(12.5, 14),
          glucose: this.randomRange(100, 120),
          triglycerides: this.randomRange(140, 200),
          cholesterol: this.randomRange(210, 260),
          timestamp: new Date(),
        };
      case "healthy":
      default:
        return {
          cortisol: this.randomRange(10, 15),
          vitaminD: this.randomRange(30, 50),
          hemoglobin: this.randomRange(14, 15.5),
          glucose: this.randomRange(85, 100),
          triglycerides: this.randomRange(80, 120),
          cholesterol: this.randomRange(160, 200),
          timestamp: new Date(),
        };
    }
  }

  /**
   * Generate reference ranges for biomarkers
   */
  static getBiomarkerReferenceRanges() {
    return {
      cortisol: { min: 10, max: 20, unit: "µg/dL", status: "normal" },
      vitaminD: { min: 30, max: 100, unit: "ng/mL", status: "optimal" },
      hemoglobin: { min: 13.5, max: 17.5, unit: "g/dL", status: "normal" },
      glucose: { min: 70, max: 100, unit: "mg/dL", status: "fasting" },
      triglycerides: { min: 0, max: 150, unit: "mg/dL", status: "normal" },
      cholesterol: { min: 0, max: 200, unit: "mg/dL", status: "desirable" },
    };
  }

  /**
   * Analyze biomarker data against reference ranges
   */
  static analyzeBiomarkers(data: BiomarkerData) {
    const ranges = this.getBiomarkerReferenceRanges();
    const analysis = {
      cortisol: this.getStatus(data.cortisol, ranges.cortisol),
      vitaminD: this.getStatus(data.vitaminD, ranges.vitaminD),
      hemoglobin: this.getStatus(data.hemoglobin, ranges.hemoglobin),
      glucose: this.getStatus(data.glucose, ranges.glucose),
      triglycerides: this.getStatus(data.triglycerides, ranges.triglycerides),
      cholesterol: this.getStatus(data.cholesterol, ranges.cholesterol),
    };
    return analysis;
  }

  /**
   * Get status of a value against reference range
   */
  private static getStatus(
    value: number,
    range: { min: number; max: number }
  ): "low" | "normal" | "high" {
    if (value < range.min) return "low";
    if (value > range.max) return "high";
    return "normal";
  }

  /**
   * Generate random number in range
   */
  private static randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate random integer in range
   */
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
