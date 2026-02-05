import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { AlertCircle, CheckCircle, TrendingDown } from "lucide-react-native";

export interface BiomarkerCardProps {
  name: string;
  value: number;
  unit: string;
  minRef: number;
  maxRef: number;
  status: "low" | "normal" | "high";
  trend?: "improving" | "stable" | "declining";
}

/**
 * Biomarker Card Component
 * Displays lab results with reference ranges and status
 */
export function BiomarkerCard({
  name,
  value,
  unit,
  minRef,
  maxRef,
  status,
  trend,
}: BiomarkerCardProps) {
  const colors = useColors();

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return colors.success;
      case "low":
        return colors.warning;
      case "high":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "normal":
        return "Normal";
      case "low":
        return "Baixo";
      case "high":
        return "Elevado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "normal":
        return <CheckCircle size={16} color={colors.success} />;
      case "low":
      case "high":
        return <AlertCircle size={16} color={getStatusColor()} />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return "↑";
      case "declining":
        return "↓";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  // Calculate position in reference range
  const range = maxRef - minRef;
  const position = ((value - minRef) / range) * 100;
  const clampedPosition = Math.max(0, Math.min(100, position));

  return (
    <View
      className="rounded-2xl p-4 mb-3 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{name}</Text>
          <Text className="text-xs text-muted mt-1">
            Ref: {minRef} - {maxRef} {unit}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          {getStatusIcon()}
          <Text className="text-xs font-semibold" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Value */}
      <View className="flex-row items-baseline gap-2 mb-3">
        <Text className="text-2xl font-bold text-foreground">{value.toFixed(1)}</Text>
        <Text className="text-xs text-muted">{unit}</Text>
        {trend && (
          <Text className="text-xs font-semibold" style={{ color: getStatusColor() }}>
            {getTrendIcon()}
          </Text>
        )}
      </View>

      {/* Reference Range Bar */}
      <View className="mb-3">
        <View
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${clampedPosition}%`,
              backgroundColor: getStatusColor(),
            }}
          />
        </View>
      </View>

      {/* Status message */}
      {status !== "normal" && (
        <View
          className="p-2 rounded-lg"
          style={{ backgroundColor: getStatusColor() + "15" }}
        >
          <Text className="text-xs" style={{ color: getStatusColor() }}>
            {status === "low"
              ? `Seu nível de ${name.toLowerCase()} está abaixo do recomendado.`
              : `Seu nível de ${name.toLowerCase()} está acima do recomendado.`}
          </Text>
        </View>
      )}
    </View>
  );
}
