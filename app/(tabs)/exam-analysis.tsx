import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react-native";

interface Biomarker {
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
  interpretation: string;
}

interface ExamAnalysis {
  examType: string;
  date: string;
  biomarkers: Biomarker[];
  overallAnalysis: string;
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
}

export default function ExamAnalysisScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState<ExamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);

  const analyzeExamMutation = trpc.exams.analyzeExam.useMutation();

  const handleAnalyzeExam = async () => {
    if (!selectedFile) {
      Alert.alert("Erro", "Selecione um arquivo para analisar");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeExamMutation.mutateAsync({
        fileUrl: selectedFile.url,
        fileName: selectedFile.name,
      });

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        Alert.alert("Erro", result.error || "Falha ao analisar exame");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar análise");
      console.error("Error analyzing exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBiomarkerColor = (status: string) => {
    switch (status) {
      case "low":
        return colors.warning;
      case "high":
        return colors.error;
      default:
        return colors.success;
    }
  };

  const getBiomarkerIcon = (status: string) => {
    switch (status) {
      case "low":
        return <TrendingDown size={16} color={colors.warning} />;
      case "high":
        return <TrendingUp size={16} color={colors.error} />;
      default:
        return <CheckCircle size={16} color={colors.success} />;
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Análise de Exames</Text>
          <Text className="text-sm text-muted mt-1">Processe seus exames com IA</Text>
        </View>

        {!analysis ? (
          <>
            {/* Upload Section */}
            <View className="px-6 mb-8">
              <View
                className="rounded-lg p-6 border-2 border-dashed items-center"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "10",
                }}
              >
                <AlertCircle size={40} color={colors.primary} />
                <Text className="text-sm font-semibold text-foreground mt-4">
                  Selecione um arquivo
                </Text>
                <Text className="text-xs text-muted text-center mt-2">
                  PDF, JPG ou PNG com resultados de exame
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    // Simulate file selection
                    setSelectedFile({
                      name: "hemograma.pdf",
                      url: "https://example.com/hemograma.pdf",
                    });
                  }}
                  className="mt-6 px-6 py-3 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-sm font-semibold text-background">
                    Escolher Arquivo
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedFile && (
                <View className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                  <Text className="text-xs font-semibold text-muted mb-1">
                    Arquivo selecionado:
                  </Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedFile.name}
                  </Text>
                </View>
              )}
            </View>

            {/* Analyze Button */}
            <View className="px-6 mb-8">
              <TouchableOpacity
                onPress={handleAnalyzeExam}
                disabled={loading || !selectedFile}
                className="py-4 rounded-lg items-center"
                style={{
                  backgroundColor: colors.primary,
                  opacity: loading || !selectedFile ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-base font-semibold text-background">
                    Analisar Exame
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View className="px-6">
              <View
                className="rounded-lg p-4"
                style={{
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
              >
                <Text className="text-xs font-semibold text-foreground mb-2">
                  🔬 Como funciona
                </Text>
                <Text className="text-xs text-foreground leading-relaxed">
                  Nossa IA processa seus exames e extrai automaticamente os biomarcadores,
                  comparando com valores de referência e gerando recomendações personalizadas.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <View className="px-6 mb-8">
              {/* Exam Type and Date */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-foreground mb-2">
                  {analysis.examType}
                </Text>
                <Text className="text-sm text-muted">{analysis.date}</Text>
              </View>

              {/* Overall Analysis */}
              <View
                className="rounded-lg p-4 mb-6"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Análise Geral
                </Text>
                <Text className="text-xs text-muted leading-relaxed">
                  {analysis.overallAnalysis}
                </Text>
              </View>

              {/* Biomarkers */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-foreground mb-4">
                  Biomarcadores
                </Text>
                {analysis.biomarkers.map((biomarker, index) => (
                  <View
                    key={index}
                    className="rounded-lg p-4 mb-3 flex-row items-start"
                    style={{
                      backgroundColor: colors.surface,
                      borderLeftWidth: 4,
                      borderLeftColor: getBiomarkerColor(biomarker.status),
                    }}
                  >
                    <View className="mr-3 mt-1">
                      {getBiomarkerIcon(biomarker.status)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {biomarker.name}
                        </Text>
                        <Text
                          className="text-sm font-bold"
                          style={{ color: getBiomarkerColor(biomarker.status) }}
                        >
                          {biomarker.value} {biomarker.unit}
                        </Text>
                      </View>
                      <Text className="text-xs text-muted mb-2">
                        Ref: {biomarker.referenceMin} - {biomarker.referenceMax}
                      </Text>
                      <Text className="text-xs text-foreground">
                        {biomarker.interpretation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Risk Factors */}
              {analysis.riskFactors.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    ⚠️ Fatores de Risco
                  </Text>
                  {analysis.riskFactors.map((factor, index) => (
                    <View
                      key={index}
                      className="rounded-lg p-3 mb-2 flex-row items-start"
                      style={{
                        backgroundColor: colors.error + "15",
                        borderColor: colors.error,
                        borderWidth: 1,
                      }}
                    >
                      <AlertCircle size={16} color={colors.error} className="mr-2 mt-0.5" />
                      <Text className="text-xs text-foreground flex-1">{factor}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    💡 Recomendações
                  </Text>
                  {analysis.recommendations.map((rec, index) => (
                    <View
                      key={index}
                      className="rounded-lg p-3 mb-2 flex-row items-start"
                      style={{
                        backgroundColor: colors.primary + "15",
                        borderColor: colors.primary,
                        borderWidth: 1,
                      }}
                    >
                      <CheckCircle size={16} color={colors.primary} className="mr-2 mt-0.5" />
                      <Text className="text-xs text-foreground flex-1">{rec}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Next Steps */}
              {analysis.nextSteps.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    📋 Próximos Passos
                  </Text>
                  {analysis.nextSteps.map((step, index) => (
                    <View
                      key={index}
                      className="rounded-lg p-3 mb-2"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                      }}
                    >
                      <Text className="text-xs text-foreground">
                        {index + 1}. {step}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* New Analysis Button */}
              <TouchableOpacity
                onPress={() => {
                  setAnalysis(null);
                  setSelectedFile(null);
                }}
                className="py-4 rounded-lg items-center"
                style={{
                  backgroundColor: colors.primary + "20",
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
              >
                <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                  Analisar Outro Exame
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
