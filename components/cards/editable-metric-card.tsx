import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { Edit2, Save, X } from "lucide-react-native";

interface EditableMetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  onSave: (value: number) => Promise<void>;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export function EditableMetricCard({
  title,
  value,
  unit,
  icon,
  color,
  onSave,
  minValue = 0,
  maxValue = 10000,
  step = 1,
}: EditableMetricCardProps) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const numValue = parseFloat(inputValue);

    if (isNaN(numValue)) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    if (numValue < minValue || numValue > maxValue) {
      Alert.alert("Erro", `Valor deve estar entre ${minValue} e ${maxValue}`);
      return;
    }

    setSaving(true);
    try {
      await onSave(numValue);
      setIsEditing(false);
      Alert.alert("Sucesso", "Valor atualizado!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar valor");
      console.error("Error saving metric:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setInputValue(value.toString());
    setIsEditing(false);
  };

  return (
    <View
      className="rounded-lg p-4 mb-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View>{icon}</View>
          <Text className="text-sm font-semibold text-foreground">{title}</Text>
        </View>
        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="p-2"
            style={{ backgroundColor: color + "20" }}
          >
            <Edit2 size={16} color={color} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View className="gap-3">
          <TextInput
            className="rounded-lg px-3 py-2 text-foreground text-lg font-bold"
            placeholder="0"
            placeholderTextColor={colors.muted}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="decimal-pad"
            style={{
              backgroundColor: colors.background,
              borderColor: color,
              borderWidth: 2,
            }}
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="flex-1 rounded-lg py-2 flex-row items-center justify-center gap-2"
              style={{
                backgroundColor: color,
                opacity: saving ? 0.6 : 1,
              }}
            >
              <Save size={16} color="white" />
              <Text className="text-white font-semibold text-sm">
                {saving ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              disabled={saving}
              className="flex-1 rounded-lg py-2 flex-row items-center justify-center gap-2 border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <X size={16} color={colors.foreground} />
              <Text className="text-foreground font-semibold text-sm">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text className="text-3xl font-bold" style={{ color }}>
            {value}
          </Text>
          <Text className="text-xs text-muted mt-1">{unit}</Text>
        </View>
      )}
    </View>
  );
}
