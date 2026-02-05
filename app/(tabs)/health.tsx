import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function HealthScreen() {
  const colors = useColors();
  const [selectedTab, setSelectedTab] = useState<"hrv" | "sleep" | "heart" | "stress">("hrv");

  const tabs = [
    { id: "hrv", label: "HRV" },
    { id: "sleep", label: "Sono" },
    { id: "heart", label: "Frequência" },
    { id: "stress", label: "Estresse" },
  ] as const;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-surface px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Detalhes de Saúde</Text>
          <Text className="text-sm text-muted mt-1">Acompanhe seus dados biométricos</Text>
        </View>

        {/* Tab Selector */}
        <View className="px-6 py-4 flex-row gap-2">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setSelectedTab(tab.id)}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedTab === tab.id ? colors.primary : colors.surface,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                className={`font-semibold text-sm ${
                  selectedTab === tab.id ? "text-background" : "text-foreground"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content Area */}
        <View className="px-6 pb-8">
          {/* Chart Placeholder */}
          <View
            className="w-full h-64 rounded-2xl mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted text-sm">Gráfico de {tabs.find(t => t.id === selectedTab)?.label}</Text>
            </View>
          </View>

          {/* Statistics Cards */}
          <View className="gap-3">
            <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
              <View>
                <Text className="text-muted text-xs mb-1">Média</Text>
                <Text className="text-2xl font-bold text-foreground">72</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-primary font-bold">bpm</Text>
              </View>
            </View>

            <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
              <View>
                <Text className="text-muted text-xs mb-1">Máximo</Text>
                <Text className="text-2xl font-bold text-foreground">95</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-error/20 items-center justify-center">
                <Text className="text-error font-bold">↑</Text>
              </View>
            </View>

            <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
              <View>
                <Text className="text-muted text-xs mb-1">Mínimo</Text>
                <Text className="text-2xl font-bold text-foreground">58</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center">
                <Text className="text-success font-bold">↓</Text>
              </View>
            </View>

            <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
              <View>
                <Text className="text-muted text-xs mb-1">Tendência</Text>
                <Text className="text-2xl font-bold text-foreground">+5%</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-primary font-bold">📈</Text>
              </View>
            </View>
          </View>

          {/* Historical Data Section */}
          <View className="mt-8">
            <Text className="text-lg font-semibold text-foreground mb-4">Histórico Recente</Text>
            <View className="gap-2">
              {[
                { time: "Hoje, 14:30", value: "76 bpm", status: "Normal" },
                { time: "Ontem, 14:15", value: "72 bpm", status: "Normal" },
                { time: "2 dias atrás", value: "68 bpm", status: "Bom" },
              ].map((item, idx) => (
                <View
                  key={idx}
                  className="bg-surface rounded-lg p-3 flex-row justify-between items-center"
                >
                  <View>
                    <Text className="text-foreground font-medium">{item.time}</Text>
                    <Text className="text-muted text-xs mt-1">{item.value}</Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.success + "20" }}
                  >
                    <Text className="text-success text-xs font-semibold">
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
