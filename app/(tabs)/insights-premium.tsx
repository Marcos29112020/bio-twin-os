import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { SyntheticDataGenerator } from "@/lib/synthetic-data-generator";
import { PredictiveInsightsEngine } from "@/lib/predictive-insights";
import type { PredictiveInsight } from "@/lib/predictive-insights";
import {
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Zap,
  Droplets,
  Clock,
} from "lucide-react-native";

/**
 * Premium Insights Screen
 * Displays AI-powered predictive insights with actionable recommendations
 */
export default function InsightsPremiumScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<"healthy" | "high_stress" | "irregular_sleep">(
    "high_stress"
  );
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateInsights();
  }, [profile]);

  const generateInsights = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate 7-day history
    const history = SyntheticDataGenerator.generate7DayHistory(profile);
    const biomarkers = SyntheticDataGenerator.generateBiomarkers(profile);

    // Generate insights
    const newInsights = PredictiveInsightsEngine.generateInsights(history, biomarkers);
    setInsights(newInsights);
    setIsLoading(false);
  };

  const handleCompleteAction = (insightId: string) => {
    setCompletedActions((prev) => new Set([...prev, insightId]));
  };

  const getInsightIcon = (insight: PredictiveInsight) => {
    switch (insight.icon) {
      case "alert":
        return <AlertCircle size={24} color={colors.error} />;
      case "meditation":
        return <Zap size={24} color={colors.primary} />;
      case "water":
        return <Droplets size={24} color={colors.primary} />;
      case "trend":
        return <TrendingUp size={24} color={colors.success} />;
      case "tip":
      default:
        return <Lightbulb size={24} color={colors.warning} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return colors.error;
      case "important":
        return colors.warning;
      case "informational":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "🚨 Urgente";
      case "important":
        return "⚠️ Importante";
      case "informational":
        return "ℹ️ Informativo";
      default:
        return "Info";
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Insights Premium</Text>
          <Text className="text-sm text-muted mt-1">
            Recomendações personalizadas baseadas em IA
          </Text>
        </View>

        {/* Profile Selector */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Simular Perfil</Text>
          <View className="flex-row gap-2">
            {(["healthy", "high_stress", "irregular_sleep"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setProfile(p)}
                className={`flex-1 rounded-lg py-2 px-3 items-center ${
                  profile === p ? "bg-primary" : ""
                }`}
                style={{
                  backgroundColor: profile === p ? colors.primary : colors.surface,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color: profile === p ? colors.background : colors.foreground,
                  }}
                >
                  {p === "healthy"
                    ? "Saudável"
                    : p === "high_stress"
                      ? "Estresse"
                      : "Sono Irregular"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className="px-6 items-center justify-center py-12">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted mt-4">Analisando seus dados...</Text>
          </View>
        )}

        {/* Insights List */}
        {!isLoading && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-foreground">
                {insights.length} Insights Gerados
              </Text>
              <Text className="text-xs text-muted">
                {completedActions.size} completados
              </Text>
            </View>

            <View className="gap-4">
              {insights.map((insight) => {
                const isCompleted = completedActions.has(insight.id);

                return (
                  <View
                    key={insight.id}
                    className="rounded-2xl p-4 overflow-hidden"
                    style={{
                      backgroundColor: colors.surface,
                      opacity: isCompleted ? 0.6 : 1,
                    }}
                  >
                    {/* Header */}
                    <View className="flex-row items-start gap-3 mb-3">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: getPriorityColor(insight.priority) + "20",
                        }}
                      >
                        {getInsightIcon(insight)}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text
                            className="text-xs font-semibold uppercase"
                            style={{ color: getPriorityColor(insight.priority) }}
                          >
                            {getPriorityLabel(insight.priority)}
                          </Text>
                          {insight.timeToAct && (
                            <View className="flex-row items-center gap-1">
                              <Clock size={12} color={colors.muted} />
                              <Text className="text-xs text-muted">{insight.timeToAct}</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-base font-bold text-foreground">
                          {insight.title}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text className="text-sm text-muted leading-relaxed mb-3">
                      {insight.description}
                    </Text>

                    {/* Action Box */}
                    <View
                      className="rounded-lg p-3 mb-3"
                      style={{
                        backgroundColor: getPriorityColor(insight.priority) + "10",
                        borderLeftWidth: 3,
                        borderLeftColor: getPriorityColor(insight.priority),
                      }}
                    >
                      <Text className="text-xs font-semibold text-muted mb-1">
                        Ação Recomendada:
                      </Text>
                      <Text className="text-sm font-bold text-foreground">
                        {insight.action}
                      </Text>
                    </View>

                    {/* Impact & CTA */}
                    <View className="flex-row items-center justify-between">
                      {insight.estimatedImpact && (
                        <Text className="text-xs text-success font-semibold">
                          ✓ {insight.estimatedImpact}
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={() => handleCompleteAction(insight.id)}
                        disabled={isCompleted}
                        className={`px-4 py-2 rounded-lg ${
                          isCompleted ? "opacity-50" : ""
                        }`}
                        style={{
                          backgroundColor: isCompleted
                            ? colors.border
                            : getPriorityColor(insight.priority),
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color: isCompleted ? colors.muted : colors.background,
                          }}
                        >
                          {isCompleted ? "✓ Feito" : "Marcar"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Info Section */}
        {!isLoading && insights.length === 0 && (
          <View className="px-6 items-center justify-center py-12">
            <Text className="text-muted text-center">Nenhum insight gerado</Text>
          </View>
        )}

        {/* Footer */}
        <View className="px-6 pb-6">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-xs font-semibold text-foreground mb-2">
              💡 Como funciona
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Nosso sistema de IA analisa seus dados de saúde, histórico de 7 dias e
              biomarcadores para gerar insights personalizados com ações específicas.
              Quanto mais dados você compartilhar, melhores serão as recomendações.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
