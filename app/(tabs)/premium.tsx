import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Check, Lock, Zap, Brain, BarChart3, MessageCircle } from "lucide-react-native";

/**
 * Premium Upgrade Screen (Paywall)
 * Showcases premium features and upgrade benefits
 */
export default function PremiumScreen() {
  const colors = useColors();

  const premiumFeatures = [
    {
      icon: Brain,
      title: "Análise de DNA",
      description: "Sequenciamento genético para recomendações personalizadas",
      included: false,
    },
    {
      icon: MessageCircle,
      title: "Chat 24/7 com IA Médica",
      description: "Consultas instantâneas com assistente médico inteligente",
      included: false,
    },
    {
      icon: BarChart3,
      title: "Relatórios Mensais de Longevidade",
      description: "Análise detalhada de tendências e previsões de saúde",
      included: false,
    },
    {
      icon: Zap,
      title: "Insights Preditivos Avançados",
      description: "IA prevê problemas de saúde com 30 dias de antecedência",
      included: false,
    },
  ];

  const freeFeatures = [
    "Dashboard de Saúde",
    "Gêmeo Digital Básico",
    "Insights Diários",
    "Histórico de 7 dias",
  ];

  const premiumPlans = [
    {
      name: "Mensal",
      price: "R$ 29,90",
      period: "/mês",
      description: "Cancele a qualquer momento",
      popular: false,
    },
    {
      name: "Anual",
      price: "R$ 299",
      period: "/ano",
      description: "Economize R$ 60",
      popular: true,
      savings: "2 meses grátis",
    },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Hero */}
        <View
          className="px-6 pt-8 pb-6 rounded-b-3xl"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Zap size={20} color={colors.primary} />
            <Text className="text-xs font-semibold text-primary uppercase">Premium</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground mb-2">
            Desbloqueie Seu Potencial de Longevidade
          </Text>
          <Text className="text-sm text-muted">
            Acesso a análises avançadas de IA e consultas médicas 24/7
          </Text>
        </View>

        {/* Current Plan Status */}
        <View className="px-6 mt-6 mb-6">
          <View
            className="rounded-2xl p-4 flex-row items-center justify-between"
            style={{ backgroundColor: colors.surface }}
          >
            <View>
              <Text className="text-sm font-semibold text-muted">Plano Atual</Text>
              <Text className="text-2xl font-bold text-foreground mt-1">Gratuito</Text>
            </View>
            <Lock size={32} color={colors.primary} />
          </View>
        </View>

        {/* Free Features */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Incluído no Plano Gratuito
          </Text>
          <View className="gap-2">
            {freeFeatures.map((feature, index) => (
              <View key={index} className="flex-row items-center gap-3">
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.success }}
                >
                  <Check size={12} color={colors.background} />
                </View>
                <Text className="text-sm text-foreground">{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Features */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Desbloqueie com Premium
          </Text>
          <View className="gap-3">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View
                  key={index}
                  className="rounded-2xl p-4 flex-row items-start gap-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary + "20" }}
                  >
                    <Icon size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Pricing Plans */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Escolha Seu Plano
          </Text>
          <View className="gap-3">
            {premiumPlans.map((plan, index) => (
              <TouchableOpacity
                key={index}
                className={`rounded-2xl p-4 border-2 ${
                  plan.popular ? "border-primary" : ""
                }`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: plan.popular ? colors.primary : colors.border,
                }}
              >
                {plan.popular && (
                  <View
                    className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl rounded-tr-2xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-xs font-bold text-background">
                      MAIS POPULAR
                    </Text>
                  </View>
                )}

                <View className="flex-row items-start justify-between mb-3">
                  <View>
                    <Text className="text-lg font-bold text-foreground">
                      {plan.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {plan.description}
                    </Text>
                  </View>
                  {plan.savings && (
                    <View
                      className="px-2 py-1 rounded"
                      style={{ backgroundColor: colors.success + "20" }}
                    >
                      <Text className="text-xs font-semibold text-success">
                        {plan.savings}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-baseline gap-1 mb-4">
                  <Text className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </Text>
                  <Text className="text-sm text-muted">{plan.period}</Text>
                </View>

                <TouchableOpacity
                  className="w-full py-3 rounded-lg items-center"
                  style={{
                    backgroundColor: plan.popular ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color: plan.popular ? colors.background : colors.foreground,
                    }}
                  >
                    Começar Teste Grátis
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Benefits Summary */}
        <View className="px-6 mb-6">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-semibold text-foreground mb-3">
              ✨ Por que Premium?
            </Text>
            <View className="gap-2">
              <Text className="text-xs text-muted leading-relaxed">
                • <Text className="font-semibold">IA Médica 24/7</Text>: Consulte um assistente médico inteligente a qualquer hora
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                • <Text className="font-semibold">Análise de DNA</Text>: Recomendações baseadas em seu perfil genético
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                • <Text className="font-semibold">Previsões</Text>: IA prevê problemas de saúde com 30 dias de antecedência
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                • <Text className="font-semibold">Relatórios</Text>: Análise mensal detalhada de longevidade
              </Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View className="px-6 pb-6">
          <Text className="text-xs text-muted text-center">
            Teste grátis por 7 dias. Cancele a qualquer momento. Nenhum cartão de crédito necessário.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
