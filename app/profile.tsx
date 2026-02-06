import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { profileService } from "@/lib/supabase";
import { Camera, LogOut, Save, User } from "lucide-react-native";

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await profileService.getProfile(user.id);
        if (error) throw error;

        if (data) {
          setName(data.name || "");
          setAge(data.age || "");
          if (data.photo_url) {
            setPhotoUri(data.photo_url);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar foto");
      console.error("Error picking photo:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    if (!name.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }

    setSaving(true);
    try {
      let photoUrl = photoUri;

      // Upload photo if changed
      if (photoUri && photoUri.startsWith("file://")) {
        const { url, error: uploadError } = await profileService.uploadProfilePhoto(
          user.id,
          photoUri,
          `profile-${Date.now()}.jpg`
        );

        if (uploadError) throw uploadError;
        photoUrl = url;
      }

      // Update profile
      const { error } = await profileService.upsertProfile(user.id, {
        name: name.trim(),
        age: age ? parseInt(age) : undefined,
        photo_url: photoUrl || undefined,
      });

      if (error) throw error;

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar perfil");
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("../login" as any);
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Meu Perfil</Text>
          <Text className="text-sm text-muted mt-1">{user?.email}</Text>
        </View>

        {/* Profile Photo */}
        <View className="px-6 mb-8">
          <View className="items-center">
            {photoUri ? (
              <View className="relative">
                <Image
                  source={{ uri: photoUri }}
                  className="w-32 h-32 rounded-full"
                  style={{ backgroundColor: colors.surface }}
                />
                <TouchableOpacity
                  onPress={handlePickPhoto}
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Camera size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickPhoto}
                className="w-32 h-32 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="items-center gap-2">
                  <User size={40} color={colors.muted} />
                  <Text className="text-xs text-muted">Adicionar foto</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form */}
        <View className="px-6 mb-8">
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Nome Completo</Text>
            <TextInput
              className="rounded-lg px-4 py-3 text-foreground"
              placeholder="Seu nome"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              editable={!saving}
              style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
            />
          </View>

          {/* Age Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Idade</Text>
            <TextInput
              className="rounded-lg px-4 py-3 text-foreground"
              placeholder="Sua idade"
              placeholderTextColor={colors.muted}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              editable={!saving}
              style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
            />
          </View>

          {/* Email (Read-only) */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <View
              className="rounded-lg px-4 py-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
            >
              <Text className="text-foreground">{user?.email}</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={saving || loading}
            className="rounded-lg py-4 flex-row items-center justify-center gap-2 mb-4"
            style={{
              backgroundColor: colors.primary,
              opacity: saving || loading ? 0.6 : 1,
            }}
          >
            <Save size={20} color="white" />
            <Text className="text-white font-semibold">
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-lg py-4 flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colors.error + "20", borderColor: colors.error, borderWidth: 1 }}
          >
            <LogOut size={20} color={colors.error} />
            <Text className="font-semibold" style={{ color: colors.error }}>
              Fazer Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View className="px-6 mb-6">
          <View
            className="rounded-lg p-4"
            style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary, borderWidth: 1 }}
          >
            <Text className="text-xs font-semibold text-foreground mb-1">💡 Dica</Text>
            <Text className="text-xs text-foreground leading-relaxed">
              Seus dados de perfil são salvos de forma segura no Supabase. Você pode atualizar suas informações a qualquer momento.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
