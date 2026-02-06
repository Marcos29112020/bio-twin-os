import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, ArrowRight } from "lucide-react-native";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Email ou senha incorretos");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-8">
          <Text className="text-4xl font-bold text-foreground">Bio-Twin OS</Text>
          <Text className="text-sm text-muted mt-2">Seu Gêmeo Digital de Saúde</Text>
        </View>

        {/* Form */}
        <View className="px-6 flex-1 justify-center">
          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <View
              className="flex-row items-center rounded-lg px-4 py-3 border"
              style={{
                borderColor: errors.email ? colors.error : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Mail size={20} color={colors.muted} />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            {errors.email && <Text className="text-xs text-error mt-1">{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Senha</Text>
            <View
              className="flex-row items-center rounded-lg px-4 py-3 border"
              style={{
                borderColor: errors.password ? colors.error : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Lock size={20} color={colors.muted} />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            {errors.password && <Text className="text-xs text-error mt-1">{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="rounded-lg py-4 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: colors.primary,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text className="text-white font-semibold">
              {loading ? "Entrando..." : "Entrar"}
            </Text>
            {!loading && <ArrowRight size={20} color="white" />}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-sm text-primary">Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="px-6 py-8 flex-row items-center justify-center gap-2">
          <Text className="text-sm text-muted">Não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push("../signup" as any)}>
            <Text className="text-sm font-semibold text-primary">Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
