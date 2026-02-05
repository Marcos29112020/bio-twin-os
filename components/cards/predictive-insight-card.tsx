import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface PredictiveInsightCardProps {
  title: string;
  description: string;
  healthScore: number;
  stressLevel: number;
  recommendations: string[];
  onViewDetails?: () => void;
}

/**
 * Predictive Insight Card Component
 * Displays AI-generated health insights with progress bars
 * Features premium dark mode styling with gradient accents
 */
export function PredictiveInsightCard({
  title,
  description,
  healthScore,
  stressLevel,
  recommendations,
  onViewDetails,
}: PredictiveInsightCardProps) {
  const colors = useColors();

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Card Header */}
      <View className="flex-row items-center gap-3 mb-4">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Text className="text-2xl">✨</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">Insight Preditivo</Text>
          <Text className="text-xs text-muted">Baseado em IA</Text>
        </View>
      </View>

      {/* Insight Title */}
      <Text className="text-base font-semibold text-foreground mb-3">{title}</Text>

      {/* Insight Description */}
      <Text className="text-sm text-muted leading-relaxed mb-6">{description}</Text>

      {/* Health Progress Bar */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-foreground">Nível de Saúde</Text>
          <Text className="text-sm font-bold text-primary">{healthScore}%</Text>
        </View>
        <View
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${healthScore}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>

      {/* Stress Level Progress Bar */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-foreground">Nível de Estresse</Text>
          <Text className="text-sm font-bold text-warning">{stressLevel}%</Text>
        </View>
        <View
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${stressLevel}%`,
              backgroundColor: colors.warning,
            }}
          />
        </View>
      </View>

      {/* Recommendations */}
      <View className="bg-background/50 rounded-lg p-4 mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">Recomendações</Text>
        <View className="gap-2">
          {recommendations.slice(0, 3).map((rec, idx) => (
            <View key={idx} className="flex-row gap-2 items-start">
              <Text className="text-success font-bold">✓</Text>
              <Text className="text-xs text-muted flex-1">{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      {onViewDetails && (
        <Pressable
          onPress={onViewDetails}
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
          <Text className="text-center font-semibold text-background">
            Ver Análise Completa
          </Text>
        </Pressable>
      )}
    </View>
  );
}
