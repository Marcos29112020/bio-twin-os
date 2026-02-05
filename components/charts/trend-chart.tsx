import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface TrendDataPoint {
  day: string;
  value: number;
  label?: string;
}

export interface TrendChartProps {
  title: string;
  data: TrendDataPoint[];
  unit: string;
  color?: string;
  maxValue?: number;
  minValue?: number;
  showGrid?: boolean;
}

/**
 * Trend Chart Component
 * Displays 7-day trend data with simple line visualization
 * Uses SVG-free approach for Expo compatibility
 */
export function TrendChart({
  title,
  data,
  unit,
  color,
  maxValue,
  minValue,
  showGrid = true,
}: TrendChartProps) {
  const colors = useColors();
  const chartColor = color || colors.primary;
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48; // 24px padding on each side
  const chartHeight = 200;

  // Calculate min/max for scaling
  const values = data.map((d) => d.value);
  const dataMin = minValue ?? Math.min(...values);
  const dataMax = maxValue ?? Math.max(...values);
  const range = dataMax - dataMin || 1;

  // Calculate points for visualization
  const pointSpacing = chartWidth / (data.length - 1 || 1);
  const points = data.map((d, i) => ({
    x: i * pointSpacing,
    y: chartHeight - ((d.value - dataMin) / range) * chartHeight * 0.8,
    value: d.value,
    day: d.day,
  }));

  // Calculate average
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // Determine trend
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = secondAvg > firstAvg ? "up" : secondAvg < firstAvg ? "down" : "stable";
  const trendPercent = ((Math.abs(secondAvg - firstAvg) / firstAvg) * 100).toFixed(1);

  return (
    <View
      className="rounded-2xl p-6 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          <Text className="text-xs text-muted mt-1">Últimos 7 dias</Text>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-bold" style={{ color: chartColor }}>
            {average.toFixed(1)}
          </Text>
          <Text className="text-xs text-muted">{unit}</Text>
        </View>
      </View>

      {/* Chart Container */}
      <View className="relative mb-4" style={{ height: chartHeight }}>
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <View
                key={i}
                className="absolute w-full"
                style={{
                  top: chartHeight * ratio,
                  height: 1,
                  backgroundColor: colors.border,
                  opacity: 0.3,
                }}
              />
            ))}
          </>
        )}

        {/* Data points and connecting line */}
        <View className="absolute w-full h-full">
          {/* Simple line representation using bars */}
          <View className="flex-row justify-between items-end h-full px-1">
            {points.map((point, i) => {
              const heightPercent = ((point.value - dataMin) / range) * 100;
              return (
                <View
                  key={i}
                  className="flex-1 items-center justify-end mx-0.5"
                  style={{ height: chartHeight }}
                >
                  <View
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: chartColor,
                      opacity: 0.7,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* X-axis labels */}
      <View className="flex-row justify-between px-1 mb-4">
        {data.map((d, i) => (
          <Text key={i} className="text-xs text-muted">
            {d.day}
          </Text>
        ))}
      </View>

      {/* Stats */}
      <View className="flex-row justify-between pt-4 border-t" style={{ borderTopColor: colors.border }}>
        <View>
          <Text className="text-xs text-muted">Mínimo</Text>
          <Text className="text-sm font-semibold text-foreground">{dataMin.toFixed(1)}</Text>
        </View>
        <View>
          <Text className="text-xs text-muted">Máximo</Text>
          <Text className="text-sm font-semibold text-foreground">{dataMax.toFixed(1)}</Text>
        </View>
        <View>
          <Text className="text-xs text-muted">Tendência</Text>
          <Text className="text-sm font-semibold" style={{ color: chartColor }}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendPercent}%
          </Text>
        </View>
      </View>
    </View>
  );
}
