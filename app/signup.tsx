import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, User, ArrowRight } from "lucide-react-native";

export default function SignupScreen() {
  const colors = useColors();
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme a senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Senhas não conferem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
      router.replace("../login" as any);
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar conta. Tente novamente.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-8">
          <Text className="text-4xl font-bold text-foreground">Criar Conta</Text>
          <Text className="text-sm text-muted mt-2">Comece seu jornada de saúde</Text>
        </View>

        {/* Form */}
        <View className="px-6 flex-1 justify-center">
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Nome Completo</Text>
            <View
              className="flex-row items-center rounded-lg px-4 py-3 border"
              style={{
                borderColor: errors.name ? colors.error : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <User size={20} color={colors.muted} />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="João Silva"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
            {errors.name && <Text className="text-xs text-error mt-1">{errors.name}</Text>}
          </View>

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

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Confirmar Senha</Text>
            <View
              className="flex-row items-center rounded-lg px-4 py-3 border"
              style={{
                borderColor: errors.confirmPassword ? colors.error : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Lock size={20} color={colors.muted} />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            {errors.confirmPassword && (
              <Text className="text-xs text-error mt-1">{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className="rounded-lg py-4 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: colors.primary,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text className="text-white font-semibold">
              {loading ? "Criando conta..." : "Criar Conta"}
            </Text>
            {!loading && <ArrowRight size={20} color="white" />}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="px-6 py-8 flex-row items-center justify-center gap-2">
          <Text className="text-sm text-muted">Já tem conta?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm font-semibold text-primary">Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
