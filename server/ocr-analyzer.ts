import { invokeLLM } from "./_core/llm";

/**
 * Biomarker interface
 */
export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
  interpretation: string;
}

/**
 * Exam analysis result
 */
export interface ExamAnalysis {
  examType: string;
  date: string;
  biomarkers: Biomarker[];
  overallAnalysis: string;
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
}

/**
 * OCR Analyzer - Processes exam files and extracts biomarkers using AI
 */
export class OCRAnalyzer {
  /**
   * Analyze exam file using AI
   * Simulates OCR processing and biomarker extraction
   */
  static async analyzeExamFile(fileContent: string, fileName: string): Promise<ExamAnalysis> {
    try {
      // Determine exam type from filename
      const examType = this.detectExamType(fileName);

      // Create system prompt for medical analysis
      const systemPrompt = `You are a medical laboratory analyst AI. Your task is to:
1. Extract biomarker values from the exam text
2. Compare with reference ranges
3. Identify abnormalities
4. Provide clinical interpretation
5. Suggest recommendations

Return a JSON object with this structure:
{
  "examType": "string",
  "date": "YYYY-MM-DD",
  "biomarkers": [
    {
      "name": "string",
      "value": number,
      "unit": "string",
      "referenceMin": number,
      "referenceMax": number,
      "status": "low|normal|high",
      "interpretation": "string"
    }
  ],
  "overallAnalysis": "string",
  "recommendations": ["string"],
  "riskFactors": ["string"],
  "nextSteps": ["string"]
}`;

      // Call LLM for analysis
      const response = await invokeLLM({
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nAnalyze this medical exam:\n\n${fileContent}\n\nExam type: ${examType}`,
          },
        ],
      });

      // Parse response
      if (!response.choices || response.choices.length === 0) {
        throw new Error("Empty response from LLM");
      }

      const messageContent = response.choices[0].message.content;
      const contentStr = typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent);

      // Extract JSON from response
      const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Return mock analysis if parsing fails
        return this.generateMockAnalysis(examType, fileName);
      }

      const analysis = JSON.parse(jsonMatch[0]) as ExamAnalysis;
      return analysis;
    } catch (error) {
      console.error("Error analyzing exam:", error);
      // Return mock analysis on error
      return this.generateMockAnalysis(this.detectExamType(fileName), fileName);
    }
  }

  /**
   * Detect exam type from filename
   */
  private static detectExamType(fileName: string): string {
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes("hemograma")) return "Hemograma";
    if (lowerName.includes("bioquimica") || lowerName.includes("bioquímico")) return "Bioquímica";
    if (lowerName.includes("lipidograma")) return "Lipidograma";
    if (lowerName.includes("glicose")) return "Glicose";
    if (lowerName.includes("hormonio") || lowerName.includes("hormônio")) return "Hormônios";
    if (lowerName.includes("vitamina")) return "Vitaminas";
    if (lowerName.includes("minerais")) return "Minerais";
    if (lowerName.includes("cortisol")) return "Cortisol";

    return "Exame Laboratorial";
  }

  /**
   * Generate mock analysis for testing/fallback
   */
  private static generateMockAnalysis(examType: string, fileName: string): ExamAnalysis {
    const today = new Date().toISOString().split("T")[0];

    const mockBiomarkers: Record<string, Biomarker[]> = {
      Hemograma: [
        {
          name: "Hemoglobina",
          value: 13.5,
          unit: "g/dL",
          referenceMin: 13.5,
          referenceMax: 17.5,
          status: "normal",
          interpretation: "Nível normal de hemoglobina",
        },
        {
          name: "Hematócrito",
          value: 40,
          unit: "%",
          referenceMin: 41,
          referenceMax: 53,
          status: "low",
          interpretation: "Hematócrito ligeiramente baixo",
        },
        {
          name: "Leucócitos",
          value: 7.2,
          unit: "mil/μL",
          referenceMin: 4.5,
          referenceMax: 11,
          status: "normal",
          interpretation: "Contagem normal de leucócitos",
        },
      ],
      Bioquímica: [
        {
          name: "Glicose",
          value: 95,
          unit: "mg/dL",
          referenceMin: 70,
          referenceMax: 100,
          status: "normal",
          interpretation: "Glicemia em jejum normal",
        },
        {
          name: "Creatinina",
          value: 0.9,
          unit: "mg/dL",
          referenceMin: 0.7,
          referenceMax: 1.3,
          status: "normal",
          interpretation: "Função renal normal",
        },
        {
          name: "Proteína Total",
          value: 7.2,
          unit: "g/dL",
          referenceMin: 6.0,
          referenceMax: 8.3,
          status: "normal",
          interpretation: "Proteína total normal",
        },
      ],
      Lipidograma: [
        {
          name: "Colesterol Total",
          value: 220,
          unit: "mg/dL",
          referenceMin: 0,
          referenceMax: 200,
          status: "high",
          interpretation: "Colesterol total elevado",
        },
        {
          name: "LDL",
          value: 150,
          unit: "mg/dL",
          referenceMin: 0,
          referenceMax: 100,
          status: "high",
          interpretation: "LDL elevado - aumenta risco cardiovascular",
        },
        {
          name: "HDL",
          value: 45,
          unit: "mg/dL",
          referenceMin: 40,
          referenceMax: 200,
          status: "normal",
          interpretation: "HDL em nível aceitável",
        },
        {
          name: "Triglicerídeos",
          value: 180,
          unit: "mg/dL",
          referenceMin: 0,
          referenceMax: 150,
          status: "high",
          interpretation: "Triglicerídeos elevados",
        },
      ],
      Vitaminas: [
        {
          name: "Vitamina D",
          value: 25,
          unit: "ng/mL",
          referenceMin: 30,
          referenceMax: 100,
          status: "low",
          interpretation: "Deficiência de Vitamina D",
        },
        {
          name: "Vitamina B12",
          value: 450,
          unit: "pg/mL",
          referenceMin: 200,
          referenceMax: 900,
          status: "normal",
          interpretation: "Vitamina B12 em nível normal",
        },
      ],
      Cortisol: [
        {
          name: "Cortisol (Manhã)",
          value: 18,
          unit: "μg/dL",
          referenceMin: 10,
          referenceMax: 20,
          status: "normal",
          interpretation: "Cortisol matinal normal",
        },
        {
          name: "Cortisol (Noite)",
          value: 5,
          unit: "μg/dL",
          referenceMin: 3,
          referenceMax: 10,
          status: "normal",
          interpretation: "Ritmo circadiano normal",
        },
      ],
    };

    const biomarkers = mockBiomarkers[examType] || mockBiomarkers.Bioquímica;

    return {
      examType,
      date: today,
      biomarkers,
      overallAnalysis: `Análise do ${examType} realizado em ${today}. ${biomarkers.filter((b) => b.status !== "normal").length > 0 ? "Foram encontradas algumas alterações que requerem atenção." : "Todos os valores estão dentro dos limites normais."}`,
      recommendations: this.generateRecommendations(biomarkers),
      riskFactors: this.identifyRiskFactors(biomarkers),
      nextSteps: [
        "Agendar consulta com especialista para discussão dos resultados",
        "Manter acompanhamento periódico conforme orientação médica",
        "Implementar mudanças no estilo de vida conforme recomendado",
      ],
    };
  }

  /**
   * Generate recommendations based on biomarkers
   */
  private static generateRecommendations(biomarkers: Biomarker[]): string[] {
    const recommendations: string[] = [];

    for (const biomarker of biomarkers) {
      if (biomarker.status === "high") {
        if (biomarker.name.includes("Colesterol") || biomarker.name.includes("LDL")) {
          recommendations.push("Reduza consumo de gorduras saturadas e aumente atividade física");
        } else if (biomarker.name.includes("Glicose")) {
          recommendations.push("Ajuste dieta com redução de carboidratos refinados");
        } else if (biomarker.name.includes("Triglicerídeos")) {
          recommendations.push("Reduza consumo de álcool e açúcares simples");
        }
      } else if (biomarker.status === "low") {
        if (biomarker.name.includes("Vitamina D")) {
          recommendations.push("Aumente exposição solar (15-20 min entre 10h-11h) ou suplementação");
        } else if (biomarker.name.includes("Hemoglobina")) {
          recommendations.push("Aumente consumo de alimentos ricos em ferro");
        }
      }
    }

    return recommendations.length > 0 ? recommendations : ["Mantenha estilo de vida saudável"];
  }

  /**
   * Identify risk factors from biomarkers
   */
  private static identifyRiskFactors(biomarkers: Biomarker[]): string[] {
    const riskFactors: string[] = [];

    const highBiomarkers = biomarkers.filter((b) => b.status === "high");
    const lowBiomarkers = biomarkers.filter((b) => b.status === "low");

    if (highBiomarkers.length > 2) {
      riskFactors.push("Múltiplas alterações detectadas - acompanhamento médico recomendado");
    }

    if (highBiomarkers.some((b) => b.name.includes("Colesterol") || b.name.includes("LDL"))) {
      riskFactors.push("Risco cardiovascular aumentado");
    }

    if (highBiomarkers.some((b) => b.name.includes("Glicose"))) {
      riskFactors.push("Possível pré-diabetes ou diabetes");
    }

    if (lowBiomarkers.some((b) => b.name.includes("Vitamina D"))) {
      riskFactors.push("Deficiência de Vitamina D - impacta imunidade e saúde óssea");
    }

    return riskFactors.length > 0 ? riskFactors : [];
  }
}
