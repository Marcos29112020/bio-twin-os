import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { AlertCircle, Lightbulb, TrendingUp } from "lucide-react-native";

export interface DailyRecommendationCardProps {
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  icon?: "alert" | "tip" | "trend";
}

/**
 * Daily Recommendation Card Component
 * Displays AI-generated health recommendations based on data
 */
export function DailyRecommendationCard({
  title,
  description,
  priority = "medium",
  icon = "tip",
}: DailyRecommendationCardProps) {
  const colors = useColors();

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (icon) {
      case "alert":
        return <AlertCircle size={24} color={getPriorityColor()} />;
      case "trend":
        return <TrendingUp size={24} color={getPriorityColor()} />;
      case "tip":
      default:
        return <Lightbulb size={24} color={getPriorityColor()} />;
    }
  };

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header */}
      <View className="flex-row items-start gap-4 mb-4">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: getPriorityColor() + "20" }}
        >
          {getIcon()}
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-muted uppercase">
            {priority === "high" ? "⚠️ Importante" : priority === "medium" ? "💡 Recomendação" : "✓ Dica"}
          </Text>
          <Text className="text-lg font-bold text-foreground mt-1">{title}</Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-sm text-muted leading-relaxed">{description}</Text>

      {/* Priority indicator */}
      <View className="mt-4 pt-4 border-t" style={{ borderTopColor: colors.border }}>
        <View className="flex-row items-center gap-2">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getPriorityColor() }}
          />
          <Text className="text-xs text-muted">
            {priority === "high" ? "Ação imediata recomendada" : priority === "medium" ? "Considere implementar hoje" : "Bom hábito para manter"}
          </Text>
        </View>
      </View>
    </View>
  );
}
