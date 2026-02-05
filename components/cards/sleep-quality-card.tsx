import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface SleepQualityCardProps {
  duration: string;
  quality: string;
  icon?: string;
}

/**
 * Sleep Quality Card Component
 * Displays sleep duration and quality metrics
 */
export function SleepQualityCard({
  duration,
  quality,
  icon = "😴",
}: SleepQualityCardProps) {
  const colors = useColors();

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-lg font-semibold text-foreground">Qualidade do Sono</Text>
          <Text className="text-xs text-muted">Última noite</Text>
        </View>
        <Text className="text-2xl">{icon}</Text>
      </View>

      {/* Sleep Chart Placeholder */}
      <View
        className="w-full h-32 rounded-xl mb-4 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-muted text-sm">Gráfico de Sono</Text>
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-muted mb-1">Duração</Text>
          <Text className="text-xl font-bold text-foreground">{duration}</Text>
        </View>
        <View>
          <Text className="text-xs text-muted mb-1">Qualidade</Text>
          <Text className="text-xl font-bold text-success">{quality}</Text>
        </View>
      </View>
    </View>
  );
}
