import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface HealthStatusCardProps {
  score: number;
  message: string;
  icon?: string;
}

/**
 * Health Status Card Component
 * Displays overall health score with progress bar
 */
export function HealthStatusCard({
  score,
  message,
  icon = "❤️",
}: HealthStatusCardProps) {
  const colors = useColors();

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-foreground">Status de Saúde</Text>
        <Text className="text-2xl">{icon}</Text>
      </View>

      {/* Health Score */}
      <View className="mb-6">
        <View className="flex-row items-baseline gap-2 mb-3">
          <Text className="text-5xl font-bold text-primary">{score}</Text>
          <Text className="text-2xl text-muted">/100</Text>
        </View>
        <View
          className="w-full h-4 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${score}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>

      <Text className="text-sm text-muted">{message}</Text>
    </View>
  );
}
