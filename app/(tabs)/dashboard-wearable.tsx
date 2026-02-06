import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useWearableData } from "@/hooks/use-wearable-data";
import { EditableMetricCard } from "@/components/cards/editable-metric-card";
import { Activity, Moon, Heart, RefreshCw, Smartphone } from "lucide-react-native";
import { RecommendationEngine } from "@/lib/recommendation-engine";

export default function DashboardWearableScreen() {
  const colors = useColors();
  const { data, history, trend, syncStatus, isLoading, error, refresh, requestPermissions } = useWearableData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      Alert.alert("Erro", "Falha ao sincronizar dados");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRequestPermissions = async () => {
    try {
      await requestPermissions();
      Alert.alert("Sucesso", "Permissões de saúde solicitadas");
    } catch (err) {
      Alert.alert("Erro", "Falha ao solicitar permissões");
    }
  };

  const bioScore = data
    ? RecommendationEngine.calculateBioScore({
        steps: data.steps,
        sleepHours: data.sleepHours,
        restingHeartRate: data.restingHeartRate,
        activeCalories: data.activeCalories,
        distance: data.distance,
        timestamp: data.timestamp,
      })
    : 0;

  const getBioScoreColor = () => {
    if (bioScore >= 80) return colors.success;
    if (bioScore >= 60) return colors.warning;
    return colors.error;
  };

  const getBioScoreStatus = () => {
    if (bioScore >= 80) return "Excelente";
    if (bioScore >= 60) return "Bom";
    return "Precisa melhorar";
  };

  const getSourceLabel = () => {
    if (!data) return "Sem dados";
    switch (data.source) {
      case "apple-health":
        return "Apple Health";
      case "google-fit":
        return "Google Fit";
      case "manual":
        return "Entrada Manual";
      default:
        return "Simulado";
    }
  };

  const getLastSyncTime = () => {
    if (!syncStatus.lastSync) return "Nunca";
    const now = new Date();
    const diff = now.getTime() - syncStatus.lastSync.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator color={colors.primary} size="large" />
        <Text className="text-sm text-muted mt-4">Carregando dados de wearables...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
            <Text className="text-sm text-muted mt-1">Dados de Wearables</Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={refreshing || syncStatus.issyncing}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: colors.primary + "20",
              opacity: refreshing || syncStatus.issyncing ? 0.6 : 1,
            }}
          >
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Data Source Info */}
        {data && (
          <View className="px-6 mb-4 flex-row items-center gap-2">
            <Smartphone size={14} color={colors.primary} />
            <Text className="text-xs font-semibold text-muted">
              Fonte: {getSourceLabel()} • Sincronizado: {getLastSyncTime()}
            </Text>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className="mx-6 mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.error + "20" }}>
            <Text className="text-xs font-semibold text-error mb-1">⚠️ Erro</Text>
            <Text className="text-xs text-foreground">{error}</Text>
          </View>
        )}

        {/* Permission Request */}
        {!data && !error && (
          <View className="mx-6 mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.primary + "15" }}>
            <Text className="text-sm font-semibold text-foreground mb-3">
              📱 Conectar Wearables
            </Text>
            <Text className="text-xs text-muted mb-4">
              Permita acesso aos seus dados de saúde para sincronização automática.
            </Text>
            <TouchableOpacity
              onPress={handleRequestPermissions}
              className="py-2 px-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-sm font-semibold text-background">
                Solicitar Permissões
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bio Score */}
        {data && (
          <>
            <View className="px-6 mb-8">
              <View
                className="rounded-lg p-6 items-center"
                style={{
                  backgroundColor: getBioScoreColor() + "15",
                  borderColor: getBioScoreColor(),
                  borderWidth: 2,
                }}
              >
                <Text className="text-sm font-semibold text-muted mb-2">Bio-Score</Text>
                <Text
                  className="text-5xl font-bold"
                  style={{ color: getBioScoreColor() }}
                >
                  {Math.round(bioScore)}
                </Text>
                <Text className="text-sm text-foreground mt-2 font-semibold">
                  {getBioScoreStatus()}
                </Text>
                <View
                  className="w-full h-2 rounded-full mt-4"
                  style={{ backgroundColor: colors.border }}
                >
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${bioScore}%`,
                      backgroundColor: getBioScoreColor(),
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Wearable Metrics */}
            <View className="px-6 mb-8">
              <Text className="text-lg font-semibold text-foreground mb-4">
                Métricas em Tempo Real
              </Text>

              <View
                className="rounded-lg p-4 mb-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Activity size={20} color={colors.primary} />
                  <View>
                    <Text className="text-xs text-muted">Passos</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {data.steps.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">
                  {Math.round((data.steps / 10000) * 100)}%
                </Text>
              </View>

              <View
                className="rounded-lg p-4 mb-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.warning,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Moon size={20} color={colors.warning} />
                  <View>
                    <Text className="text-xs text-muted">Sono</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {data.sleepHours.toFixed(1)}h
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">
                  {Math.round((data.sleepHours / 9) * 100)}%
                </Text>
              </View>

              <View
                className="rounded-lg p-4 mb-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.error,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Heart size={20} color={colors.error} />
                  <View>
                    <Text className="text-xs text-muted">FC em Repouso</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {data.restingHeartRate} bpm
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">Normal</Text>
              </View>

              <View
                className="rounded-lg p-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.success,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Activity size={20} color={colors.success} />
                  <View>
                    <Text className="text-xs text-muted">Calorias Ativas</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {Math.round(data.activeCalories)} kcal
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">
                  {Math.round((data.activeCalories / 600) * 100)}%
                </Text>
              </View>
            </View>

            {/* Sync Status */}
            <View className="px-6 mb-8">
              <View
                className="rounded-lg p-4"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text className="text-xs font-semibold text-muted mb-2">
                  📊 Status de Sincronização
                </Text>
                <Text className="text-xs text-foreground">
                  Pontos de dados: {syncStatus.dataPoints}
                </Text>
                <Text className="text-xs text-foreground mt-1">
                  Última sincronização: {getLastSyncTime()}
                </Text>
              </View>
            </View>

            {/* Trend Info */}
            {trend.length > 0 && (
              <View className="px-6 mb-8">
                <View
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: colors.primary + "10",
                    borderColor: colors.primary,
                    borderWidth: 1,
                  }}
                >
                  <Text className="text-xs font-semibold text-foreground mb-2">
                    📈 Tendência (7 dias)
                  </Text>
                  <Text className="text-xs text-foreground">
                    Média de passos: {Math.round(trend.reduce((sum, d) => sum + d.steps, 0) / trend.length).toLocaleString()}
                  </Text>
                  <Text className="text-xs text-foreground mt-1">
                    Média de sono: {(trend.reduce((sum, d) => sum + d.sleepHours, 0) / trend.length).toFixed(1)}h
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
