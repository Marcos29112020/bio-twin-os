import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { profileService, authService } from "@/lib/supabase";
import { Mail, Lock, User, ArrowRight } from "lucide-react-native";

export default function SignupScreen() {
  const colors = useColors();
  const router = useRouter();
  const { signUp, user } = useAuth();

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
      // 1. Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await authService.signUp(email, password);
      
      if (signUpError) {
        Alert.alert("Erro", (signUpError as any).message || "Falha ao criar conta");
        setLoading(false);
        return;
      }

      if (!signUpData?.user?.id) {
        Alert.alert("Erro", "Falha ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      // 2. Create user profile
      const { data: profileData, error: profileError } = await profileService.upsertProfile(
        signUpData.user.id,
        {
          name: name,
          age: undefined,
          photo_url: undefined,
          bio: undefined,
        }
      );

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue anyway, profile can be updated later
      }

      Alert.alert(
        "Sucesso!",
        "Conta criada com sucesso! Um email de confirmação foi enviado para " + email + ". Faça login para continuar."
      );
      
      router.replace("../login" as any);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Falha ao criar conta. Tente novamente."
      );
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
          <Text className="text-sm text-muted mt-2">Comece sua jornada de saúde</Text>
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
          <View className="mb-8">
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

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              opacity: loading ? 0.6 : 1,
            }}
            className="flex-row items-center justify-center rounded-lg py-4 mb-4"
          >
            <Text className="text-background font-semibold mr-2">
              {loading ? "Criando conta..." : "Criar Conta"}
            </Text>
            <ArrowRight size={20} color={colors.background} />
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-muted">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.replace("../login" as any)} disabled={loading}>
              <Text className="text-primary font-semibold">Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
