import { ScrollView, View, Text, RefreshControl, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHealthData } from "@/hooks/use-health-data";
import { BioScoreCard } from "@/components/cards/bio-score-card";
import { MetricCard } from "@/components/cards/metric-card";
import { DailyRecommendationCard } from "@/components/cards/daily-recommendation-card";
import { RecommendationEngine } from "@/lib/recommendation-engine";
import { useState } from "react";
import { Activity, Heart, Moon } from "lucide-react-native";

/**
 * Digital Twin Dashboard Screen
 * Displays Bio-Score, health metrics, and AI recommendations
 */
export default function DigitalTwinScreen() {
  const colors = useColors();
  const { data, permissions, refresh } = useHealthData();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate metrics
  const bioScore = RecommendationEngine.calculateBioScore(data);
  const recommendation = RecommendationEngine.generateDailyRecommendation(data);
  const activityStatus = RecommendationEngine.getActivityStatus(data.steps);
  const recoveryStatus = RecommendationEngine.getRecoveryStatus(data.sleepHours);
  const stressStatus = RecommendationEngine.getStressStatus(data.restingHeartRate);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (permissions.loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-muted mt-4">Carregando dados de saúde...</Text>
      </ScreenContainer>
    );
  }

  if (permissions.error) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <Text className="text-error font-semibold mb-2">Erro ao acessar dados de saúde</Text>
        <Text className="text-muted text-center">{permissions.error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Gêmeo Digital</Text>
          <Text className="text-sm text-muted mt-1">
            Última atualização: {data.timestamp.toLocaleTimeString("pt-BR")}
          </Text>
        </View>

        {/* Bio-Score Card */}
        <View className="px-6 mb-6">
          <BioScoreCard score={bioScore} label="Bio-Score" />
        </View>

        {/* Metrics Cards */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Métricas Diárias</Text>
          <View className="gap-4">
            {/* Activity Card */}
            <MetricCard
              title="Atividade"
              value={data.steps}
              unit="passos"
              icon={Activity}
              status={data.steps >= 8000 ? "good" : data.steps >= 5000 ? "warning" : "alert"}
              trend={data.steps >= 8000 ? "up" : data.steps >= 5000 ? "stable" : "down"}
              trendValue={activityStatus}
            />

            {/* Recovery Card */}
            <MetricCard
              title="Recuperação"
              value={data.sleepHours.toFixed(1)}
              unit="horas"
              icon={Moon}
              status={data.sleepHours >= 7 && data.sleepHours <= 9 ? "good" : data.sleepHours >= 6 ? "warning" : "alert"}
              trend={data.sleepHours >= 7 ? "up" : "stable"}
              trendValue={recoveryStatus}
            />

            {/* Stress Card */}
            <MetricCard
              title="Estresse"
              value={data.restingHeartRate}
              unit="bpm"
              icon={Heart}
              status={data.restingHeartRate <= 70 ? "good" : data.restingHeartRate <= 80 ? "warning" : "alert"}
              trend={data.restingHeartRate <= 70 ? "down" : "up"}
              trendValue={stressStatus}
            />
          </View>
        </View>

        {/* Daily Recommendation */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Recomendação do Dia</Text>
          <DailyRecommendationCard
            title={recommendation.title}
            description={recommendation.description}
            priority={recommendation.priority}
            icon={recommendation.icon}
          />
        </View>

        {/* Additional Info */}
        <View className="px-6 pb-6">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-semibold text-foreground mb-3">Dados Adicionais</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Calorias Queimadas</Text>
                <Text className="text-xs font-semibold text-foreground">{data.activeCalories} kcal</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Distância Percorrida</Text>
                <Text className="text-xs font-semibold text-foreground">{data.distance.toFixed(1)} km</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
