import { ScrollView, View, Text, TouchableOpacity, Share, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { SyntheticDataGenerator } from "@/lib/synthetic-data-generator";
import { BloodTestAnalyzer } from "@/lib/blood-test-analyzer";
import { LongevityBrain } from "@/lib/longevity-brain";
import { PDFReportGenerator } from "@/lib/pdf-report-generator";
import {
  Download,
  Share2,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle,
} from "lucide-react-native";

/**
 * Reports & Export Screen
 * Generate and export longevity reports for doctors
 */
export default function ReportsScreen() {
  const colors = useColors();
  const [selectedProfile, setSelectedProfile] = useState<"healthy" | "high_stress">(
    "high_stress"
  );
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Generate data
    const history = SyntheticDataGenerator.generate7DayHistory(selectedProfile);
    const biomarkers = SyntheticDataGenerator.generateBiomarkers(selectedProfile);
    const bloodTestReport = BloodTestAnalyzer.analyzeBloodTest(biomarkers);
    const correlationAlerts = LongevityBrain.analyzeCorrelations(history, biomarkers);

    const longevityScore = LongevityBrain.calculateLongevityScore(history, biomarkers);

    // Calculate Bio-Score based on health data
    const baseScore = Math.min(
      100,
      50 +
        (history[history.length - 1].steps >= 10000 ? 25 : 15) +
        (history[history.length - 1].sleepHours >= 7 ? 25 : 15) +
        (history[history.length - 1].restingHeartRate <= 70 ? 25 : 15)
    );

    const report = PDFReportGenerator.generateReport(
      "João Silva",
      baseScore,
      longevityScore,
      history,
      biomarkers,
      bloodTestReport,
      correlationAlerts
    );

    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const handleExportPDF = async () => {
    if (!generatedReport) return;

    const pdfContent = PDFReportGenerator.generatePDFContent(generatedReport);

    try {
      await Share.share({
        message: pdfContent,
        title: "Relatório de Longevidade - Bio-Twin OS",
        url: "data:text/plain;base64," + Buffer.from(pdfContent).toString("base64"),
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o relatório");
    }
  };

  const handleExportCSV = async () => {
    if (!generatedReport) return;

    const csvContent = PDFReportGenerator.generateCSVExport(generatedReport);

    try {
      await Share.share({
        message: csvContent,
        title: "Dados de Saúde - Bio-Twin OS",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar os dados");
    }
  };

  const handleExportJSON = async () => {
    if (!generatedReport) return;

    const jsonContent = PDFReportGenerator.generateJSONExport(generatedReport);

    try {
      await Share.share({
        message: jsonContent,
        title: "Dados JSON - Bio-Twin OS",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar os dados");
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Relatórios</Text>
          <Text className="text-sm text-muted mt-1">
            Gere e exporte relatórios para compartilhar com seu médico
          </Text>
        </View>

        {/* Profile Selector */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Perfil de Simulação</Text>
          <View className="flex-row gap-2">
            {(["healthy", "high_stress"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => {
                  setSelectedProfile(p);
                  setGeneratedReport(null);
                }}
                className={`flex-1 rounded-lg py-2 px-3 items-center`}
                style={{
                  backgroundColor: selectedProfile === p ? colors.primary : colors.surface,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color: selectedProfile === p ? colors.background : colors.foreground,
                  }}
                >
                  {p === "healthy" ? "Saudável" : "Estresse"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Report Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={generateReport}
            disabled={isGenerating}
            className="rounded-2xl py-4 items-center flex-row justify-center gap-2"
            style={{
              backgroundColor: colors.primary,
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? (
              <>
                <Text className="text-white font-semibold">Gerando...</Text>
              </>
            ) : (
              <>
                <FileText size={20} color={colors.background} />
                <Text className="text-white font-semibold">Gerar Relatório</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Generated Report Summary */}
        {generatedReport && (
          <>
            {/* Report Info */}
            <View className="px-6 mb-6">
              <View
                className="rounded-2xl p-4"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-sm text-muted">Paciente</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {generatedReport.patientName}
                    </Text>
                  </View>
                  <CheckCircle size={24} color={colors.success} />
                </View>

                <View className="flex-row gap-4 mb-4">
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">Bio-Score</Text>
                    <Text className="text-2xl font-bold text-primary">
                      {generatedReport.bioScore}/100
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">Longevity Score</Text>
                    <Text className="text-2xl font-bold text-primary">
                      {generatedReport.longevityScore}/100
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 text-xs text-muted">
                  <Calendar size={14} color={colors.muted} />
                  <Text className="text-xs text-muted">
                    Próxima avaliação: {generatedReport.nextCheckup.toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Export Options */}
            <View className="px-6 mb-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Opções de Exportação
              </Text>

              {/* PDF Export */}
              <TouchableOpacity
                onPress={handleExportPDF}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.error + "20" }}
                >
                  <FileText size={24} color={colors.error} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Exportar como PDF
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Relatório completo para seu médico
                  </Text>
                </View>
                <Download size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* CSV Export */}
              <TouchableOpacity
                onPress={handleExportCSV}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.success + "20" }}
                >
                  <BarChart3 size={24} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Exportar como CSV
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Dados brutos para análise em Excel
                  </Text>
                </View>
                <Download size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* JSON Export */}
              <TouchableOpacity
                onPress={handleExportJSON}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <FileText size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Exportar como JSON
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Integração com sistemas externos
                  </Text>
                </View>
                <Download size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Share Report */}
              <TouchableOpacity
                onPress={handleExportPDF}
                className="rounded-2xl p-4 flex-row items-center gap-3"
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.background + "30" }}
                >
                  <Share2 size={24} color={colors.background} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-background">
                    Compartilhar Relatório
                  </Text>
                  <Text className="text-xs" style={{ color: colors.background + "cc" }}>
                    Envie por email ou WhatsApp
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Report Details */}
            <View className="px-6 mb-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Resumo do Relatório
              </Text>

              <View
                className="rounded-2xl p-4"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground mb-3">
                  Recomendações Principais:
                </Text>
                <View className="gap-2">
                  {generatedReport.recommendations.slice(0, 3).map((rec: string, i: number) => (
                    <View key={i} className="flex-row gap-2">
                      <Text className="text-primary font-bold">•</Text>
                      <Text className="text-xs text-muted flex-1">{rec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {/* Info Section */}
        <View className="px-6 pb-6">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-xs font-semibold text-foreground mb-2">
              ℹ️ Sobre os Relatórios
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Os relatórios são gerados a partir de dados simulados para fins educacionais. Compartilhe com seu médico para discussão de saúde preventiva e longevidade.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
