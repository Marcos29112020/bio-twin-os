import { ScrollView, Text, View, Pressable, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { HealthStatusCard } from "@/components/cards/health-status-card";
import { SleepQualityCard } from "@/components/cards/sleep-quality-card";
import { HRVChart } from "@/components/charts/hrv-chart";

export default function HomeScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header with Greeting */}
        <View className="bg-surface px-6 pt-6 pb-4">
          <Text className="text-4xl font-bold text-foreground">Olá, João</Text>
          <Text className="text-sm text-muted mt-1">Quinta-feira, 5 de Fevereiro</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6 gap-6">
          {/* Health Status Card */}
          <HealthStatusCard
            score={78}
            message="Seu nível de saúde geral está excelente. Continue mantendo seus hábitos!"
            icon="❤️"
          />

          {/* HRV Chart Card */}
          <HRVChart />

          {/* Sleep Quality Card */}
          <SleepQualityCard duration="7h 32m" quality="Excelente" icon="😴" />

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Ações Rápidas</Text>
            <View className="gap-2">
              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">📱</Text>
                  <Text className="text-base font-semibold text-background flex-1">
                    Conectar Wearable
                  </Text>
                  <Text className="text-background">→</Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: colors.error,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">📄</Text>
                  <Text className="text-base font-semibold text-background flex-1">
                    Upload de Exame
                  </Text>
                  <Text className="text-background">→</Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: colors.warning,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">✨</Text>
                  <Text className="text-base font-semibold text-background flex-1">
                    Ver Análise de IA
                  </Text>
                  <Text className="text-background">→</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Last Sync Info */}
          <View className="bg-background/50 rounded-lg p-4">
            <Text className="text-xs text-muted">
              ⏱️ Última sincronização: Há 2 minutos
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
