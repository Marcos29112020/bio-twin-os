import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { PredictiveInsightCard } from "@/components/cards/predictive-insight-card";

export default function InsightsScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-surface px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Insights de IA</Text>
          <Text className="text-sm text-muted mt-1">Análise preditiva de energia e estresse</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6 gap-6">
          {/* Predictive Insight Card */}
          <PredictiveInsightCard
            title="Seu nível de energia está em alta"
            description="Baseado na análise de seus dados de HRV, qualidade do sono e frequência cardíaca, o sistema prevê que você terá um nível de energia elevado nos próximos 6-8 horas."
            healthScore={78}
            stressLevel={32}
            recommendations={[
              "Aproveite o pico de energia para atividades importantes",
              "Mantenha a hidratação e evite cafeína após 14h",
              "Durma 7-9 horas para manter o padrão de energia",
            ]}
            onViewDetails={() => console.log("View details")}
          />

          {/* Previous Insights */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Análises Anteriores
            </Text>
            <View className="gap-3">
              {[
                { date: "Ontem", title: "Estresse elevado detectado", icon: "⚠️" },
                { date: "2 dias atrás", title: "Qualidade de sono excelente", icon: "😴" },
                { date: "3 dias atrás", title: "Frequência cardíaca normalizada", icon: "❤️" },
              ].map((item, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    {
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">{item.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-xs text-muted">{item.date}</Text>
                      <Text className="text-sm font-medium text-foreground">
                        {item.title}
                      </Text>
                    </View>
                    <Text className="text-muted">→</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
