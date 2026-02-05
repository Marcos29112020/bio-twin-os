import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { LucideIcon } from "lucide-react-native";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "good" | "warning" | "alert";
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

/**
 * Metric Card Component
 * Displays individual health metrics with icon and status
 */
export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  status = "good",
  trend,
  trendValue,
}: MetricCardProps) {
  const colors = useColors();

  const getStatusColor = () => {
    switch (status) {
      case "good":
        return colors.success;
      case "warning":
        return colors.warning;
      case "alert":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  return (
    <View
      className="flex-1 rounded-2xl p-4 items-start"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header with icon */}
      <View className="flex-row items-center justify-between w-full mb-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: getStatusColor() + "20" }}
        >
          <Icon size={20} color={getStatusColor()} />
        </View>
        {trend && (
          <Text className="text-sm font-semibold" style={{ color: getStatusColor() }}>
            {getTrendIcon()} {trendValue}
          </Text>
        )}
      </View>

      {/* Title */}
      <Text className="text-xs text-muted mb-2">{title}</Text>

      {/* Value */}
      <View className="flex-row items-baseline gap-1">
        <Text className="text-2xl font-bold text-foreground">{value}</Text>
        {unit && <Text className="text-xs text-muted">{unit}</Text>}
      </View>
    </View>
  );
}
