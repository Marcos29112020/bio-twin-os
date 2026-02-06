import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView, Text, TextInput, View, TouchableOpacity, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { profileService, authService } from "@/lib/supabase";
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
  const [hasChanges, setHasChanges] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await profileService.getProfile(user.id);
        if (error) {
          console.warn("Profile not found, creating new one");
        }

        if (data) {
          setName(data.name || "");
          setAge(data.age?.toString() || "");
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
        setHasChanges(true);
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

      // Upload photo if changed and is a local file
      if (photoUri && photoUri.startsWith("file://")) {
        const { url, error: uploadError } = await profileService.uploadProfilePhoto(
          user.id,
          photoUri,
          `profile-${Date.now()}.jpg`
        );

        if (uploadError) {
          throw uploadError;
        }
        photoUrl = url;
      }

      // Update profile
      const { data: profileData, error: profileError } = await profileService.upsertProfile(
        user.id,
        {
          name: name.trim(),
          age: age ? parseInt(age) : undefined,
          photo_url: photoUrl || undefined,
        }
      );

      if (profileError) {
        throw profileError;
      }

      setHasChanges(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Falha ao salvar perfil. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Fazer logout?", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: async () => {
          try {
            const { error } = await authService.signOut();
            if (error) throw error;
            
            await signOut();
            router.replace("../login" as any);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Erro", "Falha ao fazer logout. Tente novamente.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Carregando perfil...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Text className="text-3xl font-bold text-foreground">Meu Perfil</Text>
          <Text className="text-sm text-muted mt-1">{user?.email}</Text>
        </View>

        {/* Profile Photo */}
        <View className="px-6 my-8">
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
                  disabled={saving}
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }}
                >
                  <Camera size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickPhoto}
                disabled={saving}
                className="w-32 h-32 rounded-full items-center justify-center border-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: saving ? 0.6 : 1,
                }}
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
              className="rounded-lg px-4 py-3 text-foreground border"
              placeholder="Seu nome"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setHasChanges(true);
              }}
              editable={!saving}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                opacity: saving ? 0.6 : 1,
              }}
            />
          </View>

          {/* Age Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Idade</Text>
            <TextInput
              className="rounded-lg px-4 py-3 text-foreground border"
              placeholder="Sua idade"
              placeholderTextColor={colors.muted}
              value={age}
              onChangeText={(text) => {
                setAge(text);
                setHasChanges(true);
              }}
              keyboardType="number-pad"
              editable={!saving}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                opacity: saving ? 0.6 : 1,
              }}
            />
          </View>

          {/* Email (Read-only) */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <View
              className="rounded-lg px-4 py-3 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Text className="text-foreground">{user?.email}</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={saving || !hasChanges}
            style={{
              backgroundColor: colors.primary,
              opacity: saving || !hasChanges ? 0.5 : 1,
            }}
            className="flex-row items-center justify-center rounded-lg py-4 mb-4"
          >
            <Save size={20} color="white" />
            <Text className="text-background font-semibold ml-2">
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={saving}
            style={{
              backgroundColor: colors.error,
              opacity: saving ? 0.6 : 1,
            }}
            className="flex-row items-center justify-center rounded-lg py-4"
          >
            <LogOut size={20} color="white" />
            <Text className="text-background font-semibold ml-2">Fazer Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
