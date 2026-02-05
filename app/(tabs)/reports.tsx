import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { SyntheticDataGenerator } from "@/lib/synthetic-data-generator";
import { BloodTestAnalyzer } from "@/lib/blood-test-analyzer";
import { LongevityBrain } from "@/lib/longevity-brain";
import { PDFReportGenerator } from "@/lib/pdf-report-generator";
import { PDFService } from "@/lib/pdf-service";
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
  const [isExporting, setIsExporting] = useState(false);

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

    setIsExporting(true);
    try {
      await PDFService.sharePDFReport(generatedReport);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o relatório PDF");
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!generatedReport) return;

    setIsExporting(true);
    try {
      await PDFService.shareCSV(generatedReport);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar os dados CSV");
      console.error("CSV export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    if (!generatedReport) return;

    setIsExporting(true);
    try {
      await PDFService.shareJSON(generatedReport);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar os dados JSON");
      console.error("JSON export error:", error);
    } finally {
      setIsExporting(false);
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
                disabled={isExporting}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-3"
                style={{
                  backgroundColor: colors.surface,
                  opacity: isExporting ? 0.6 : 1,
                }}
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
                disabled={isExporting}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-3"
                style={{
                  backgroundColor: colors.surface,
                  opacity: isExporting ? 0.6 : 1,
                }}
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
                disabled={isExporting}
                className="rounded-2xl p-4 flex-row items-center gap-3 mb-6"
                style={{
                  backgroundColor: colors.surface,
                  opacity: isExporting ? 0.6 : 1,
                }}
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
            </View>

            {/* Info Box */}
            <View className="px-6 mb-6">
              <View
                className="rounded-2xl p-4"
                style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary, borderWidth: 1 }}
              >
                <Text className="text-xs font-semibold text-foreground mb-2">
                  💡 Dica
                </Text>
                <Text className="text-xs text-foreground leading-relaxed">
                  Compartilhe seus relatórios com seu médico para análise profissional. Os dados são
                  simulados para fins educacionais.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Empty State */}
        {!generatedReport && !isGenerating && (
          <View className="px-6 py-12 items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <FileText size={32} color={colors.muted} />
            </View>
            <Text className="text-lg font-semibold text-foreground text-center">
              Nenhum relatório gerado
            </Text>
            <Text className="text-sm text-muted text-center mt-2">
              Clique em "Gerar Relatório" para criar seu primeiro relatório de longevidade
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
