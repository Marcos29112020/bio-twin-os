import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db.js";
import { invokeLLM } from "./_core/llm.js";
import { OCRAnalyzer } from "./ocr-analyzer.js";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Health Data Routes
  health: router({
    addData: protectedProcedure
      .input(
        z.object({
          dataType: z.enum(["hrv", "sleep", "heart_rate", "stress"]),
          value: z.string(),
          source: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await db.addHealthData({
          userId: ctx.user.id,
          dataType: input.dataType,
          value: input.value,
          source: input.source || "manual",
        });
        return { id, success: true };
      }),

    getLatest: protectedProcedure
      .input(z.object({ dataType: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getLatestHealthData(ctx.user.id, input.dataType);
      }),

    getHistory: protectedProcedure
      .input(
        z.object({
          dataType: z.string().optional(),
          limit: z.number().default(100),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getUserHealthData(ctx.user.id, input.dataType, input.limit);
      }),
  }),

  // Exam Analysis Routes
  exams: router({
    analyzeExam: publicProcedure
      .input(
        z.object({
          fileUrl: z.string().url(),
          fileName: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Fetch file content from URL
          const response = await fetch(input.fileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }

          // Get file content as text
          const fileContent = await response.text();

          // Analyze with OCR/AI
          const analysis = await OCRAnalyzer.analyzeExamFile(fileContent, input.fileName);

          return {
            success: true,
            data: analysis,
            error: null,
          };
        } catch (error) {
          console.error("Error analyzing exam:", error);
          return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),

  // Lab Results Routes
  labs: router({
    upload: protectedProcedure
      .input(
        z.object({
          testName: z.string(),
          results: z.string(), // JSON string
          pdfUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await db.addLabResult({
          userId: ctx.user.id,
          testName: input.testName,
          results: input.results,
          pdfUrl: input.pdfUrl,
        });
        return { id, success: true };
      }),

    getResults: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return db.getUserLabResults(ctx.user.id, input.limit);
      }),
  }),

  // AI Insights Routes
  insights: router({
    generateInsight: protectedProcedure
      .input(
        z.object({
          healthData: z.record(z.string(), z.any()), // Object with HRV, sleep, heart rate data
          labResults: z.array(z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Call OpenAI GPT-4o with system prompt for longevity analyst
          const systemPrompt = `You are an expert longevity analyst and health data specialist. 
Analyze the provided health data (HRV, sleep quality, heart rate, stress levels) and lab results.
Provide a comprehensive assessment of the user's health status, energy levels, and stress predictions.
Return a JSON object with: energyLevel (0-100), stressLevel (0-100), healthScore (0-100), analysis (string), and recommendations (array of strings).`;

          const userMessage = `Please analyze this health data and provide insights:
${JSON.stringify(input.healthData, null, 2)}
${input.labResults ? `\nLab Results:\n${JSON.stringify(input.labResults, null, 2)}` : ""}`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "health_insight",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    energyLevel: { type: "integer", description: "Energy level 0-100" },
                    stressLevel: { type: "integer", description: "Stress level 0-100" },
                    healthScore: { type: "integer", description: "Overall health score 0-100" },
                    analysis: { type: "string", description: "Detailed health analysis" },
                    recommendations: {
                      type: "array",
                      items: { type: "string" },
                      description: "Health recommendations",
                    },
                  },
                  required: ["energyLevel", "stressLevel", "healthScore", "analysis", "recommendations"],
                  additionalProperties: false,
                },
              },
            },
          });

          // Parse the response
          const content = response.choices[0].message.content;
          const parsed = typeof content === "string" ? JSON.parse(content) : content;

          // Save to database
          const id = await db.addAIInsight({
            userId: ctx.user.id,
            energyLevel: parsed.energyLevel,
            stressLevel: parsed.stressLevel,
            healthScore: parsed.healthScore,
            analysis: parsed.analysis,
            recommendations: JSON.stringify(parsed.recommendations),
          });

          return {
            id,
            ...parsed,
            success: true,
          };
        } catch (error) {
          console.error("Error generating insight:", error);
          throw error;
        }
      }),

    getLatest: protectedProcedure.query(async ({ ctx }) => {
      return db.getLatestAIInsight(ctx.user.id);
    }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        const insights = await db.getUserAIInsights(ctx.user.id, input.limit);
        return insights.map((insight) => ({
          ...insight,
          recommendations: JSON.parse(insight.recommendations || "[]"),
        }));
      }),
  }),
});

export type AppRouter = typeof appRouter;
