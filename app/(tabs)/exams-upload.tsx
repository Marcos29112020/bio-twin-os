import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList } from "react-native";
import { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { examService } from "@/lib/supabase";
import { Upload, FileText, Image as ImageIcon, Trash2, Download } from "lucide-react-native";

interface ExamFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export default function ExamsUploadScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [exams, setExams] = useState<ExamFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load exams on mount
  useEffect(() => {
    const loadExams = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await examService.getExams(user.id);
        if (error) throw error;

        if (data) {
          setExams(data);
        }
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [user?.id]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
      });

      if (!result.canceled && result.assets[0]) {
        await uploadExam(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar documento");
      console.error("Error picking document:", error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadExam({
          uri: asset.uri,
          name: asset.fileName || `exam-${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          mimeType: asset.type === "image" ? "image/jpeg" : "image/png",
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar imagem");
      console.error("Error picking image:", error);
    }
  };

  const uploadExam = async (file: any) => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const fileName = file.name || "document";
      const fileType = file.mimeType?.includes("pdf") ? "pdf" : "image";

      const { data: examData, error: uploadError } = await examService.uploadExam(
        user.id,
        file.uri,
        fileName,
        fileType
      );

      if (uploadError) throw uploadError;

      // Reload exams
      const { data } = await examService.getExams(user.id);
      if (data) setExams(data);

      Alert.alert(
        "Sucesso!",
        "Exame enviado com sucesso! 🎉\n\nNossa IA está processando os dados e extraindo biomarcadores. Você receberá uma análise em breve.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar exame");
      console.error("Error uploading exam:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteExam = async (examId: string, fileName: string) => {
    if (!user?.id) return;

    Alert.alert("Deletar Exame", "Tem certeza que deseja deletar este exame?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await examService.deleteExam(user.id, examId, fileName);
            if (error) throw error;

            setExams(exams.filter((e) => e.id !== examId));
            Alert.alert("Sucesso", "Exame deletado");
          } catch (error) {
            Alert.alert("Erro", "Falha ao deletar exame");
            console.error("Error deleting exam:", error);
          }
        },
      },
    ]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Meus Exames</Text>
          <Text className="text-sm text-muted mt-1">Upload de PDF, JPG ou IMG</Text>
        </View>

        {/* Upload Buttons */}
        <View className="px-6 mb-8">
          <View className="gap-3">
            {/* PDF Upload */}
            <TouchableOpacity
              onPress={handlePickDocument}
              disabled={uploading}
              className="rounded-lg py-4 flex-row items-center justify-center gap-3"
              style={{
                backgroundColor: colors.primary,
                opacity: uploading ? 0.6 : 1,
              }}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <FileText size={20} color="white" />
                  <Text className="text-white font-semibold">Upload PDF</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Image Upload */}
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={uploading}
              className="rounded-lg py-4 flex-row items-center justify-center gap-3 border"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.surface,
                opacity: uploading ? 0.6 : 1,
              }}
            >
              {uploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <ImageIcon size={20} color={colors.primary} />
                  <Text style={{ color: colors.primary }} className="font-semibold">
                    Upload Imagem
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View className="px-6 mb-8">
          <View
            className="rounded-lg p-4"
            style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary, borderWidth: 1 }}
          >
            <Text className="text-xs font-semibold text-foreground mb-2">📋 Como Funciona</Text>
            <Text className="text-xs text-foreground leading-relaxed">
              1. Upload seu exame (PDF, JPG ou IMG){"\n"}
              2. Nossa IA analisa o arquivo{"\n"}
              3. Biomarcadores são extraídos automaticamente{"\n"}
              4. Você recebe análise personalizada
            </Text>
          </View>
        </View>

        {/* Exams List */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Exames Enviados ({exams.length})
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : exams.length === 0 ? (
            <View
              className="rounded-lg p-6 items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Upload size={40} color={colors.muted} />
              <Text className="text-sm text-muted mt-2">Nenhum exame enviado ainda</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={exams}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  className="rounded-lg p-4 mb-3 flex-row items-center justify-between"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      {item.type.includes("pdf") ? (
                        <FileText size={16} color={colors.primary} />
                      ) : (
                        <ImageIcon size={16} color={colors.primary} />
                      )}
                      <Text className="text-sm font-semibold text-foreground flex-1" numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Text className="text-xs text-muted">{formatFileSize(item.size)}</Text>
                      <Text className="text-xs text-muted">•</Text>
                      <Text className="text-xs text-muted">{formatDate(item.uploadedAt)}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 ml-2">
                    <TouchableOpacity
                      onPress={() => {
                        // Download functionality could be added here
                        Alert.alert("Download", "Abrindo arquivo...");
                      }}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <Download size={16} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteExam(item.id, item.name)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.error + "20" }}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
