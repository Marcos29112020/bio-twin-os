import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export interface BioScoreCardProps {
  score: number; // 0-100
  label?: string;
}

/**
 * Bio-Score Card Component
 * Displays animated circular progress indicator (0-100)
 * Premium dark mode styling with gradient effect
 */
export function BioScoreCard({ score, label = "Bio-Score" }: BioScoreCardProps) {
  const colors = useColors();
  const animatedScore = useSharedValue(0);

  // Animate score on mount and when score changes
  useEffect(() => {
    animatedScore.value = withTiming(Math.min(score, 100), {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, animatedScore]);

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.primary;
    if (score >= 40) return colors.warning;
    return colors.error;
  };

  // Determine status text
  const getStatusText = () => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Baixo";
  };

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden items-center"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-6">{label}</Text>

      {/* Circular Progress Visualization */}
      <View className="relative items-center justify-center mb-6">
        {/* Score Display */}
        <View
          className="w-40 h-40 rounded-full items-center justify-center"
          style={{
            backgroundColor: colors.background,
            borderWidth: 4,
            borderColor: getScoreColor(),
          }}
        >
          <Text className="text-5xl font-bold" style={{ color: getScoreColor() }}>
            {Math.round(score)}
          </Text>
          <Text className="text-sm text-muted mt-1">/100</Text>
        </View>
      </View>

      {/* Status */}
      <Text className="text-base font-semibold" style={{ color: getScoreColor() }}>
        {getStatusText()}
      </Text>
      <Text className="text-xs text-muted mt-2">Saúde Geral</Text>

      {/* Progress Bar */}
      <View className="w-full mt-6">
        <View
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <Animated.View
            style={{
              width: `${Math.min(score, 100)}%`,
              height: "100%",
              backgroundColor: getScoreColor(),
              borderRadius: 6,
            }}
          />
        </View>
      </View>
    </View>
  );
}
