import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { BiomarkerCard } from "@/components/cards/biomarker-card";
import { SyntheticDataGenerator } from "@/lib/synthetic-data-generator";
import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react-native";

/**
 * Exams Screen
 * Upload lab results and view biomarker data
 */
export default function ExamsScreen() {
  const colors = useColors();
  const [selectedProfile, setSelectedProfile] = useState<"healthy" | "high_stress">("high_stress");
  const [isLoading, setIsLoading] = useState(false);
  const [biomarkers, setBiomarkers] = useState(
    SyntheticDataGenerator.generateBiomarkers(selectedProfile)
  );
  const [lastUpload, setLastUpload] = useState<Date | null>(null);

  const ranges = SyntheticDataGenerator.getBiomarkerReferenceRanges();
  const analysis = SyntheticDataGenerator.analyzeBiomarkers(biomarkers);

  const handleSimulateUpload = async (profile: "healthy" | "high_stress") => {
    setIsLoading(true);
    setSelectedProfile(profile);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newBiomarkers = SyntheticDataGenerator.generateBiomarkers(profile);
    setBiomarkers(newBiomarkers);
    setLastUpload(new Date());
    setIsLoading(false);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Exames</Text>
          <Text className="text-sm text-muted mt-1">Resultados de laboratório e biomarcadores</Text>
        </View>

        {/* Upload Section */}
        <View className="px-6 mb-6">
          <View
            className="rounded-2xl p-6 border-2 border-dashed items-center justify-center"
            style={{ borderColor: colors.primary, backgroundColor: colors.surface }}
          >
            <Upload size={32} color={colors.primary} />
            <Text className="text-lg font-semibold text-foreground mt-3">Carregar Exame</Text>
            <Text className="text-xs text-muted text-center mt-2">
              Suporte: PDF, imagem (JPG, PNG)
            </Text>

            {/* Simulate upload buttons */}
            <View className="flex-row gap-3 mt-4 w-full">
              <TouchableOpacity
                onPress={() => handleSimulateUpload("healthy")}
                disabled={isLoading}
                className="flex-1 bg-success rounded-lg py-2 items-center"
              >
                <Text className="text-white text-xs font-semibold">Saudável</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSimulateUpload("high_stress")}
                disabled={isLoading}
                className="flex-1 bg-error rounded-lg py-2 items-center"
              >
                <Text className="text-white text-xs font-semibold">Estresse</Text>
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View className="mt-4 items-center">
                <ActivityIndicator size="small" color={colors.primary} />
                <Text className="text-xs text-muted mt-2">Processando exame...</Text>
              </View>
            )}

            {lastUpload && !isLoading && (
              <View className="flex-row items-center gap-2 mt-4">
                <CheckCircle size={16} color={colors.success} />
                <Text className="text-xs text-success">
                  Carregado: {lastUpload.toLocaleTimeString("pt-BR")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Biomarkers Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-semibold text-foreground">Biomarcadores</Text>
              <Text className="text-xs text-muted mt-1">Perfil: {selectedProfile === "healthy" ? "Saudável" : "Estresse Elevado"}</Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{
                backgroundColor: selectedProfile === "healthy" ? colors.success + "20" : colors.error + "20",
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{
                  color: selectedProfile === "healthy" ? colors.success : colors.error,
                }}
              >
                {selectedProfile === "healthy" ? "✓ OK" : "⚠ Alerta"}
              </Text>
            </View>
          </View>

          {/* Cortisol */}
          <BiomarkerCard
            name="Cortisol"
            value={biomarkers.cortisol}
            unit={ranges.cortisol.unit}
            minRef={ranges.cortisol.min}
            maxRef={ranges.cortisol.max}
            status={analysis.cortisol}
            trend={selectedProfile === "healthy" ? "improving" : "declining"}
          />

          {/* Vitamin D */}
          <BiomarkerCard
            name="Vitamina D"
            value={biomarkers.vitaminD}
            unit={ranges.vitaminD.unit}
            minRef={ranges.vitaminD.min}
            maxRef={ranges.vitaminD.max}
            status={analysis.vitaminD}
            trend={selectedProfile === "healthy" ? "improving" : "stable"}
          />

          {/* Hemoglobin */}
          <BiomarkerCard
            name="Hemoglobina"
            value={biomarkers.hemoglobin}
            unit={ranges.hemoglobin.unit}
            minRef={ranges.hemoglobin.min}
            maxRef={ranges.hemoglobin.max}
            status={analysis.hemoglobin}
          />

          {/* Glucose */}
          <BiomarkerCard
            name="Glicose (Jejum)"
            value={biomarkers.glucose}
            unit={ranges.glucose.unit}
            minRef={ranges.glucose.min}
            maxRef={ranges.glucose.max}
            status={analysis.glucose}
            trend={selectedProfile === "healthy" ? "stable" : "declining"}
          />

          {/* Triglycerides */}
          <BiomarkerCard
            name="Triglicerídeos"
            value={biomarkers.triglycerides}
            unit={ranges.triglycerides.unit}
            minRef={ranges.triglycerides.min}
            maxRef={ranges.triglycerides.max}
            status={analysis.triglycerides}
            trend={selectedProfile === "healthy" ? "improving" : "declining"}
          />

          {/* Cholesterol */}
          <BiomarkerCard
            name="Colesterol Total"
            value={biomarkers.cholesterol}
            unit={ranges.cholesterol.unit}
            minRef={ranges.cholesterol.min}
            maxRef={ranges.cholesterol.max}
            status={analysis.cholesterol}
            trend={selectedProfile === "healthy" ? "stable" : "declining"}
          />
        </View>

        {/* Info Section */}
        <View className="px-6 pb-6">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row gap-3">
              <FileText size={20} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Sobre os resultados</Text>
                <Text className="text-xs text-muted mt-2 leading-relaxed">
                  Os valores de referência são baseados em padrões clínicos. Consulte seu médico para interpretação completa dos resultados.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
