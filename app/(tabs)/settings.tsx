import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function SettingsScreen() {
  const colors = useColors();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-surface px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Configurações</Text>
          <Text className="text-sm text-muted mt-1">Personalize sua experiência</Text>
        </View>

        {/* Settings Sections */}
        <View className="px-6 py-6 gap-8">
          {/* Profile Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Perfil</Text>
            <View className="bg-surface rounded-xl p-4 gap-4">
              <View className="flex-row items-center gap-4">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <Text className="text-3xl">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">João Silva</Text>
                  <Text className="text-sm text-muted">joao@example.com</Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-primary">
                  Editar Perfil
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Preferences Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Preferências</Text>
            <View className="bg-surface rounded-xl overflow-hidden">
              {/* Notifications Toggle */}
              <View className="px-4 py-3 flex-row items-center justify-between border-b border-border">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Notificações</Text>
                  <Text className="text-xs text-muted mt-1">
                    Receba alertas de saúde
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary + "40" }}
                  thumbColor={notificationsEnabled ? colors.primary : colors.muted}
                />
              </View>

              {/* Dark Mode Toggle */}
              <View className="px-4 py-3 flex-row items-center justify-between border-b border-border">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Modo Escuro</Text>
                  <Text className="text-xs text-muted mt-1">
                    Tema premium dark mode
                  </Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: colors.border, true: colors.primary + "40" }}
                  thumbColor={darkModeEnabled ? colors.primary : colors.muted}
                />
              </View>

              {/* Data Sync Toggle */}
              <View className="px-4 py-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Sincronização Automática
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Sincronize dados de wearables
                  </Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primary + "40" }}
                  thumbColor={colors.primary}
                />
              </View>
            </View>
          </View>

          {/* Connected Devices Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Dispositivos Conectados
            </Text>
            <View className="bg-surface rounded-xl overflow-hidden">
              {[
                { name: "Apple Health", status: "Conectado", icon: "🍎" },
                { name: "Google Fit", status: "Desconectado", icon: "🔵" },
              ].map((device, idx) => (
                <View
                  key={idx}
                  className={`px-4 py-3 flex-row items-center justify-between ${
                    idx < 1 ? "border-b border-border" : ""
                  }`}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{device.icon}</Text>
                    <View>
                      <Text className="text-base font-medium text-foreground">
                        {device.name}
                      </Text>
                      <Text className="text-xs text-muted mt-1">{device.status}</Text>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text className="text-primary font-semibold text-sm">
                      {device.status === "Conectado" ? "Desconectar" : "Conectar"}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Privacy & Security Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Privacidade e Segurança
            </Text>
            <View className="bg-surface rounded-xl overflow-hidden">
              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-medium text-foreground">
                    Dados Criptografados
                  </Text>
                  <Text className="text-success font-semibold">✓</Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-base font-medium text-foreground">
                  Política de Privacidade
                </Text>
              </Pressable>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Sobre</Text>
            <View className="bg-surface rounded-xl p-4">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted">Versão</Text>
                  <Text className="text-foreground font-semibold">1.0.0</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted">Desenvolvido por</Text>
                  <Text className="text-foreground font-semibold">Bio-Twin Team</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted">Última atualização</Text>
                  <Text className="text-foreground font-semibold">Feb 05, 2026</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <Pressable
            style={({ pressed }) => [
              {
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 10,
                backgroundColor: colors.error,
                opacity: pressed ? 0.8 : 1,
                marginBottom: 20,
              },
            ]}
          >
            <Text className="text-center font-semibold text-background">
              Sair da Conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
