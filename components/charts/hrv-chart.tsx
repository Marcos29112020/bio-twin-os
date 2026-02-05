import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

/**
 * HRV Chart Component
 * Displays Heart Rate Variability data
 * Victory Native requires additional Skia setup, so using a placeholder for MVP
 */
export function HRVChart() {
  const colors = useColors();

  return (
    <View className="w-full h-64 rounded-2xl p-4" style={{ backgroundColor: colors.surface }}>
      <Text className="text-sm text-muted mb-4">Variabilidade da Frequência Cardíaca (HRV)</Text>
      
      {/* Placeholder Chart */}
      <View className="flex-1 items-center justify-center border border-border rounded-lg">
        <Text className="text-muted text-xs">Gráfico de HRV</Text>
        <Text className="text-foreground text-2xl font-bold mt-2">45 ms</Text>
        <Text className="text-success text-sm mt-1">↑ 8% vs. ontem</Text>
      </View>
    </View>
  );
}
