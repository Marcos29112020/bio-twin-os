import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { healthDataService } from "@/lib/supabase";
import { EditableMetricCard } from "@/components/cards/editable-metric-card";
import { Activity, Moon, Heart, RefreshCw } from "lucide-react-native";
import { RecommendationEngine } from "@/lib/recommendation-engine";

const calculateBioScore = (data: any) => RecommendationEngine.calculateBioScore(data);

interface HealthMetrics {
  steps: number;
  sleepHours: number;
  restingHeartRate: number;
  date: string;
}

export default function DashboardDynamicScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<HealthMetrics>({
    steps: 0,
    sleepHours: 0,
    restingHeartRate: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [bioScore, setBioScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load health data on mount
  useEffect(() => {
    const loadHealthData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await healthDataService.getHealthData(user.id, 1);

        if (error) throw error;

        if (data && Array.isArray(data) && data.length > 0) {
          const healthData = data[0] as any;
          setMetrics({
            steps: healthData.steps || 0,
            sleepHours: healthData.sleep_hours || 0,
            restingHeartRate: healthData.resting_heart_rate || 0,
            date: healthData.date || new Date().toISOString().split("T")[0],
          });

          // Calculate bio score
          const score = calculateBioScore({
            steps: healthData.steps || 0,
            sleepHours: healthData.sleep_hours || 0,
            restingHeartRate: healthData.resting_heart_rate || 0,
            stressLevel: 50,
          });
          setBioScore(score);
        }
      } catch (error) {
        console.error("Error loading health data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, [user?.id]);

  const handleSaveMetric = async (metricName: string, value: number) => {
    if (!user?.id) return;

    try {
      let updatedMetrics = { ...metrics };

      if (metricName === "steps") {
        updatedMetrics.steps = value;
      } else if (metricName === "sleepHours") {
        updatedMetrics.sleepHours = value;
      } else if (metricName === "restingHeartRate") {
        updatedMetrics.restingHeartRate = value;
      }

      const { error } = await healthDataService.saveHealthData(user.id, {
        date: metrics.date,
        steps: updatedMetrics.steps,
        sleep_hours: updatedMetrics.sleepHours,
        resting_heart_rate: updatedMetrics.restingHeartRate,
      });

      if (error) throw error;

      setMetrics(updatedMetrics);

      // Recalculate bio score
      const score = calculateBioScore({
        steps: updatedMetrics.steps,
        sleepHours: updatedMetrics.sleepHours,
        restingHeartRate: updatedMetrics.restingHeartRate,
        stressLevel: 50,
      });
      setBioScore(score);
    } catch (error) {
      console.error("Error saving metric:", error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (!user?.id) return;

      const { data, error } = await healthDataService.getHealthData(user.id, 1);

      if (error) throw error;

      if (data && Array.isArray(data) && data.length > 0) {
        const healthData = data[0] as any;
        setMetrics({
          steps: healthData.steps || 0,
          sleepHours: healthData.sleep_hours || 0,
          restingHeartRate: healthData.resting_heart_rate || 0,
          date: healthData.date || new Date().toISOString().split("T")[0],
        });

        const score = calculateBioScore({
          steps: healthData.steps || 0,
          sleepHours: healthData.sleep_hours || 0,
          restingHeartRate: healthData.resting_heart_rate || 0,
          stressLevel: 50,
        });
        setBioScore(score);
      }

      Alert.alert("Sucesso", "Dados sincronizados!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao sincronizar dados");
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getBioScoreColor = () => {
    if (bioScore >= 80) return colors.success;
    if (bioScore >= 60) return colors.warning;
    return colors.error;
  };

  const getBioScoreStatus = () => {
    if (bioScore >= 80) return "Excelente";
    if (bioScore >= 60) return "Bom";
    return "Precisa melhorar";
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator color={colors.primary} size="large" />
        <Text className="text-sm text-muted mt-4">Carregando dados...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
            <Text className="text-sm text-muted mt-1">Dados de hoje</Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: colors.primary + "20",
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            <RefreshCw
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Bio Score */}
        <View className="px-6 mb-8">
          <View
            className="rounded-lg p-6 items-center"
            style={{
              backgroundColor: getBioScoreColor() + "15",
              borderColor: getBioScoreColor(),
              borderWidth: 2,
            }}
          >
            <Text className="text-sm font-semibold text-muted mb-2">Bio-Score</Text>
            <Text
              className="text-5xl font-bold"
              style={{ color: getBioScoreColor() }}
            >
              {Math.round(bioScore)}
            </Text>
            <Text className="text-sm text-foreground mt-2 font-semibold">
              {getBioScoreStatus()}
            </Text>
            <View
              className="w-full h-2 rounded-full mt-4"
              style={{ backgroundColor: colors.border }}
            >
              <View
                className="h-2 rounded-full"
                style={{
                  width: `${bioScore}%`,
                  backgroundColor: getBioScoreColor(),
                }}
              />
            </View>
          </View>
        </View>

        {/* Editable Metrics */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Métricas</Text>

          <EditableMetricCard
            title="Passos"
            value={metrics.steps}
            unit="passos"
            icon={<Activity size={20} color={colors.primary} />}
            color={colors.primary}
            onSave={(value) => handleSaveMetric("steps", value)}
            minValue={0}
            maxValue={50000}
          />

          <EditableMetricCard
            title="Sono"
            value={metrics.sleepHours}
            unit="horas"
            icon={<Moon size={20} color={colors.warning} />}
            color={colors.warning}
            onSave={(value) => handleSaveMetric("sleepHours", value)}
            minValue={0}
            maxValue={24}
          />

          <EditableMetricCard
            title="Frequência Cardíaca em Repouso"
            value={metrics.restingHeartRate}
            unit="bpm"
            icon={<Heart size={20} color={colors.error} />}
            color={colors.error}
            onSave={(value) => handleSaveMetric("restingHeartRate", value)}
            minValue={40}
            maxValue={120}
          />
        </View>

        {/* Info Box */}
        <View className="px-6 mb-8">
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.primary + "10",
              borderColor: colors.primary,
              borderWidth: 1,
            }}
          >
            <Text className="text-xs font-semibold text-foreground mb-2">
              💡 Dica
            </Text>
            <Text className="text-xs text-foreground leading-relaxed">
              Toque no ícone de edição para atualizar suas métricas manualmente. O Bio-Score é recalculado automaticamente com base nos seus dados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
