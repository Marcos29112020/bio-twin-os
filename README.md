# 🧬 Bio-Twin OS - Digital Twin Health System

**Bio-Twin OS** é um aplicativo móvel inovador que funciona como um "Gêmeo Digital" de sua saúde, utilizando inteligência artificial para análise preditiva de longevidade, correlação de dados biométricos e recomendações personalizadas baseadas em padrões de saúde.

## 🎯 Visão Geral

Bio-Twin OS centraliza dados de wearables (Apple Health, Google Fit), exames laboratoriais e métricas de saúde em um dashboard inteligente que:

- **Monitora** frequência cardíaca, variabilidade cardíaca (HRV), qualidade do sono e atividade física
- **Analisa** correlações entre múltiplas métricas para detectar padrões de risco
- **Prediz** problemas de saúde com até 30 dias de antecedência
- **Recomenda** ações específicas baseadas em IA (meditação, caminhada, soneca, etc.)
- **Exporta** relatórios profissionais para compartilhar com médicos

## ✨ Features Principais

### 🏥 Dashboard Premium Dark Mode
- **Bio-Score Animado**: Indicador 0-100 com cores dinâmicas (verde/amarelo/vermelho)
- **3 Cards de Métricas**: Atividade (passos), Recuperação (sono), Estresse (frequência cardíaca)
- **Gráficos de Tendência**: Visualização de 7 dias com análise de padrões
- **Pull-to-Refresh**: Sincronização manual de dados

### 🧠 Cérebro de Longevidade (Correlation Engine)
Detecta automaticamente 6 tipos de correlações inteligentes:

1. **Fadiga Crônica**: Baixa atividade + sono insuficiente → alerta de risco de esgotamento
2. **Estresse Crônico**: FC elevada + sono inadequado → recomenda meditação/relaxamento
3. **Crise de Recuperação**: HRV baixa + FC elevada + sono insuficiente → alerta crítico
4. **Síndrome Metabólica**: Sedentarismo + triglicerídeos elevados → recomenda atividade física
5. **Supressão Imunológica**: Vitamina D baixa + cortisol elevado + sono inadequado → alerta de imunidade
6. **Padrões de Risco**: Análise de tendências para identificar degradação de saúde

### 📊 Análise de Exames de Sangue
Simulação inteligente de biomarcadores com análise automática:

- **Cortisol** (8-20 µg/dL): Indicador de estresse crônico
- **Vitamina D** (30-100 ng/mL): Essencial para imunidade e saúde óssea
- **Hemoglobina** (12-16 g/dL): Capacidade de transporte de oxigênio
- **Glicose** (70-100 mg/dL): Controle metabólico
- **Triglicerídeos** (<150 mg/dL): Risco cardiovascular
- **Colesterol Total** (<200 mg/dL): Saúde cardiovascular

Cada biomarcador inclui:
- Status (low/normal/high)
- Severidade (critical/warning/info/normal)
- Interpretação clínica
- Recomendações personalizadas
- Testes de acompanhamento sugeridos

### 🤖 Insights Preditivos com IA
Sistema inteligente que gera recomendações baseadas em padrões:

- **Recomendação do Dia**: Muda dinamicamente baseada nos dados (ex: "Priorize uma soneca de 20min hoje" se sono < 6h)
- **Ações Específicas**: Meditação 5min, caminhada 30min, soneca 20min, alongamento, respiração profunda
- **Prioridades**: Urgent (vermelho), Important (amarelo), Informational (azul)
- **Impacto Estimado**: Quanto cada ação pode melhorar o Bio-Score

### 💎 Sistema Premium
Interface de upgrade com 4 benefícios exclusivos:

1. **Análise de DNA**: Recomendações personalizadas baseadas em genética
2. **Chat 24/7 com IA Médica**: Consultas instantâneas com assistente inteligente
3. **Relatórios Mensais de Longevidade**: Análise detalhada de tendências
4. **Insights Preditivos Avançados**: Previsões com 30 dias de antecedência

Planos de preço:
- **Mensal**: R$ 29,90/mês (cancele a qualquer momento)
- **Anual**: R$ 299/ano (economize 2 meses)
- **Teste Grátis**: 7 dias sem cartão de crédito

### 📄 Gerador de Relatórios
Exporte seus dados em múltiplos formatos:

- **PDF**: Relatório profissional para compartilhar com médico
- **CSV**: Dados brutos para análise em Excel/Google Sheets
- **JSON**: Integração com sistemas externos e APIs

Cada relatório inclui:
- Bio-Score e Longevity Score
- Histórico de 7 dias (passos, sono, FC, HRV)
- Análise de biomarcadores
- Alertas de correlação
- Recomendações personalizadas
- Próxima data de avaliação

## 🏗️ Arquitetura

### Frontend (React Native + Expo)
```
app/
├── (tabs)/
│   ├── index.tsx              # Dashboard principal
│   ├── digital-twin.tsx       # Bio-Score com métricas
│   ├── health.tsx             # Detalhes de saúde
│   ├── insights-premium.tsx   # Insights preditivos
│   ├── exams.tsx              # Upload de exames
│   ├── premium.tsx            # Tela de upgrade
│   ├── reports.tsx            # Gerador de relatórios
│   ├── settings.tsx           # Configurações
│   └── _layout.tsx            # Navegação tab bar
components/
├── cards/
│   ├── bio-score-card.tsx
│   ├── metric-card.tsx
│   ├── predictive-insight-card.tsx
│   ├── health-status-card.tsx
│   ├── sleep-quality-card.tsx
│   └── biomarker-card.tsx
├── charts/
│   ├── hrv-chart.tsx
│   └── trend-chart.tsx
└── screen-container.tsx
hooks/
├── use-health-data.ts         # Integração com Apple Health/Google Fit
└── use-colors.ts
lib/
├── synthetic-data-generator.ts     # Gerador de dados realistas
├── recommendation-engine.ts        # Motor de recomendações
├── predictive-insights.ts          # Engine de insights preditivos
├── longevity-brain.ts              # Correlation engine
├── blood-test-analyzer.ts          # Análise de biomarcadores
└── pdf-report-generator.ts         # Gerador de relatórios
```

### Backend (tRPC + FastAPI)
```
server/
├── routers.ts                 # Endpoints tRPC
├── db.ts                      # Helpers de banco de dados
├── _core/
│   ├── index.ts               # Servidor Express
│   ├── llm.ts                 # Integração com OpenAI
│   └── trpc.ts                # Setup tRPC
drizzle/
└── schema.ts                  # Schema do banco de dados
```

### Banco de Dados (MySQL + Drizzle ORM)
```sql
-- Dados de saúde
healthData (
  id, userId, date,
  steps, sleepHours, restingHeartRate, hrvVariability,
  activeCalories, timestamp
)

-- Resultados de exames
labResults (
  id, userId, date,
  cortisol, vitaminD, hemoglobin, glucose,
  triglycerides, cholesterol, timestamp
)

-- Insights gerados por IA
aiInsights (
  id, userId, date,
  title, description, actionType, priority,
  bioScoreImpact, timestamp
)
```

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- pnpm ou npm
- Expo CLI
- iOS 13+ ou Android 8+

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd bio-twin-os

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Rodando no Expo Go

```bash
# Gere o QR code
pnpm qr

# Escaneie com seu iPhone/Android usando Expo Go
# iOS: Camera app → escanear QR
# Android: Expo Go app → escanear QR
```

### Rodando em Simulador

```bash
# iOS (macOS apenas)
pnpm ios

# Android
pnpm android

# Web
pnpm dev:metro
```

## 📊 Estrutura de Dados

### Perfis de Simulação

O app inclui 4 perfis realistas para testes:

**1. Healthy (Saudável)**
- Passos: 10,000-12,000/dia
- Sono: 7-8 horas/noite
- FC Repouso: 60-65 bpm
- HRV: 50-60 ms
- Bio-Score: 85-95

**2. Irregular Sleep (Sono Irregular)**
- Passos: 7,000-9,000/dia
- Sono: 5-6 horas/noite (variável)
- FC Repouso: 70-75 bpm
- HRV: 35-45 ms
- Bio-Score: 60-70

**3. High Stress (Estresse Elevado)**
- Passos: 5,000-7,000/dia
- Sono: 6-7 horas/noite
- FC Repouso: 75-85 bpm
- HRV: 25-35 ms
- Bio-Score: 40-50

**4. Sedentary (Sedentário)**
- Passos: 2,000-4,000/dia
- Sono: 6-7 horas/noite
- FC Repouso: 80-90 bpm
- HRV: 20-30 ms
- Bio-Score: 30-40

## 🧪 Testes

O projeto inclui 49 testes automatizados:

```bash
# Rodar todos os testes
pnpm test

# Rodar com cobertura
pnpm test:coverage

# Watch mode
pnpm test:watch
```

**Cobertura de Testes:**
- 20 testes para RecommendationEngine
- 19 testes para PredictiveInsightsEngine
- 10 testes para LongevityBrain e BloodTestAnalyzer

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Backend
DATABASE_URL=mysql://user:password@localhost:3306/bio_twin_os
OPENAI_API_KEY=sk-...
NODE_ENV=development

# Frontend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=Bio-Twin OS
```

### Permissões (iOS/Android)

**iOS (Info.plist):**
```xml
<key>NSHealthShareUsageDescription</key>
<string>Bio-Twin OS precisa acessar seus dados de saúde para análise de longevidade</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Bio-Twin OS precisa atualizar seus dados de saúde</string>
```

**Android (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.BODY_SENSORS" />
<uses-permission android:name="android.permission.READ_HEALTH_DATA" />
<uses-permission android:name="android.permission.WRITE_HEALTH_DATA" />
```

## 📱 Telas do App

1. **Dashboard** (Home)
   - Bio-Score animado
   - 3 cards de métricas (Atividade, Recuperação, Estresse)
   - Ações rápidas

2. **Digital Twin**
   - Bio-Score detalhado
   - Gráficos de tendência (7 dias)
   - Análise de padrões

3. **Health Details**
   - Histórico de saúde
   - Métricas detalhadas
   - Comparação com valores de referência

4. **Insights Premium**
   - Recomendação do dia
   - Histórico de insights
   - Ações prioritárias

5. **Exams**
   - Upload simulado de exames
   - Análise de biomarcadores
   - Comparação com valores de referência

6. **Premium**
   - Benefícios exclusivos
   - Planos de preço
   - Teste grátis

7. **Reports**
   - Geração de relatórios
   - Exportação (PDF, CSV, JSON)
   - Compartilhamento

8. **Settings**
   - Preferências do app
   - Gerenciamento de dados
   - Sobre o app

## 🤝 Integração com APIs

### Apple Health (iOS)
```typescript
import { useHealthData } from '@/hooks/use-health-data';

const { steps, heartRate, sleepHours, loading } = useHealthData();
```

### Google Fit (Android)
```typescript
// Mesmo hook, funciona em ambas plataformas
const { steps, heartRate, sleepHours, loading } = useHealthData();
```

### OpenAI GPT-4o (Backend)
```typescript
const insight = await invokeLLM({
  systemPrompt: "Você é um médico especialista em longevidade...",
  userPrompt: `Analise estes dados de saúde: ${JSON.stringify(healthData)}`,
});
```

## 📈 Métricas e KPIs

**Bio-Score Calculation:**
```
Bio-Score = 50 + 
  (steps >= 10,000 ? 25 : 15) +
  (sleep >= 7h ? 25 : 15) +
  (restingHR <= 70 ? 25 : 15) -
  (correlationAlerts impact)
```

**Longevity Score:**
```
LongevityScore = 
  (Bio-Score * 0.4) +
  (Biomarker Health * 0.3) +
  (Pattern Analysis * 0.3)
```

## 🔐 Segurança

- Autenticação via Manus OAuth
- Dados criptografados em repouso
- Conexão HTTPS obrigatória
- Tokens JWT com expiração
- Validação de entrada em todos os endpoints

## 🚀 Próximos Passos

1. **Integração com Wearables Reais**
   - Apple Watch integration
   - Fitbit API
   - Garmin Connect

2. **Sincronização em Background**
   - expo-background-fetch
   - Sincronização a cada 6 horas
   - Geração de insights noturnos

3. **Notificações Push**
   - Alertas em tempo real
   - Sugestões de ações
   - Lembretes de atividade

4. **Machine Learning**
   - Modelos preditivos personalizados
   - Análise de padrões históricos
   - Recomendações adaptativas

5. **Social Features**
   - Compartilhamento de achievements
   - Desafios com amigos
   - Comunidade de saúde

## 📚 Documentação

- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👥 Suporte

Para suporte, envie um email para support@biotwin.os ou abra uma issue no GitHub.

---

**Bio-Twin OS** - Seu Gêmeo Digital de Saúde 🧬💚

Desenvolvido com ❤️ para longevidade e bem-estar
