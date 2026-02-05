# Bio-Twin OS - Design Specification

## Overview
Bio-Twin OS é um sistema de "Gêmeo Digital" que centraliza dados de wearables (Apple Health/Google Fit) e exames laboratoriais para prever níveis de energia e estresse através de IA. A interface segue as Apple Human Interface Guidelines com dark mode premium.

## Screen List

1. **Onboarding Screen** - Apresentação inicial do app e permissões
2. **Authentication Screen** - Login/Sign-up com Clerk ou Firebase
3. **Dashboard (Home)** - Visão geral de saúde com gráficos em tempo real
4. **Health Details Screen** - Detalhes de HRV, qualidade do sono, frequência cardíaca
5. **Wearable Integration Screen** - Conectar Apple Health/Google Fit
6. **Lab Results Screen** - Upload e OCR de exames laboratoriais
7. **AI Insights Screen** - Análise preditiva de energia e estresse
8. **Settings Screen** - Configurações do app e preferências

## Primary Content and Functionality

### Dashboard (Home Screen)
**Content:**
- Header com saudação personalizada e data
- Card de status geral de saúde (0-100%)
- Gráfico de HRV (Heart Rate Variability) - linha com área preenchida
- Gráfico de qualidade do sono - barras por noite
- Card de insight preditivo com barra de progresso
- Botões de ação rápida: "Conectar Wearable", "Upload Exame", "Ver Análise IA"

**Functionality:**
- Sincronização automática com wearables
- Atualização de gráficos em tempo real
- Navegação para detalhes ao tocar em gráficos

### Health Details Screen
**Content:**
- Tabs: HRV | Sono | Frequência Cardíaca | Estresse
- Gráficos detalhados com timeline
- Estatísticas: média, máximo, mínimo, tendência
- Histórico em lista com timestamps

**Functionality:**
- Filtro por período (7 dias, 30 dias, 90 dias)
- Exportar dados em PDF
- Compartilhar insights

### Wearable Integration Screen
**Content:**
- Lista de wearables disponíveis (Apple Health, Google Fit, Fitbit, Garmin)
- Status de conexão (conectado/desconectado)
- Última sincronização
- Permissões solicitadas

**Functionality:**
- Conectar/desconectar wearables
- Sincronização manual
- Histórico de sincronizações

### Lab Results Screen
**Content:**
- Upload de PDF de exames
- Galeria de exames anteriores
- Dados extraídos por OCR em cards
- Comparação com valores de referência

**Functionality:**
- Upload de múltiplos PDFs
- OCR automático
- Armazenamento criptografado
- Visualização de histórico

### AI Insights Screen
**Content:**
- Card de análise preditiva com ícone de IA
- Recomendações personalizadas
- Gráfico de tendência de energia/estresse
- Histórico de análises anteriores

**Functionality:**
- Gerar análise sob demanda
- Análises automáticas diárias
- Compartilhar insights com médico

### Settings Screen
**Content:**
- Perfil do usuário
- Preferências de notificação
- Privacidade e segurança
- Sobre o app

**Functionality:**
- Editar dados pessoais
- Gerenciar permissões
- Logout

## Key User Flows

### Flow 1: Primeiro Uso
1. Usuário abre app → Onboarding
2. Faz login com Clerk/Firebase
3. Concede permissões de saúde
4. Conecta wearable (Apple Health/Google Fit)
5. Vê dashboard com dados iniciais
6. Recebe primeiro insight de IA

### Flow 2: Análise Diária
1. Usuário abre app → Dashboard
2. Vê gráficos atualizados de HRV e sono
3. Toca em "Card de Insight Preditivo"
4. Vê análise de IA sobre energia/estresse
5. Recebe recomendações personalizadas

### Flow 3: Upload de Exame
1. Usuário vai para "Lab Results"
2. Toca em "Upload Exame"
3. Seleciona PDF do exame
4. OCR extrai dados automaticamente
5. Dados aparecem em cards com valores de referência
6. IA analisa em contexto com wearables

## Color Choices

### Premium Dark Mode Palette
- **Primary Accent**: `#00D9FF` (Cyan vibrante - energia, vitalidade)
- **Secondary Accent**: `#FF6B9D` (Rosa/Magenta - saúde, cuidado)
- **Background**: `#0F1419` (Preto profundo com azul)
- **Surface**: `#1A1F2E` (Cinza escuro para cards)
- **Foreground**: `#F0F4F8` (Branco frio para texto)
- **Muted**: `#8B92A0` (Cinza médio para texto secundário)
- **Success**: `#00D973` (Verde para dados positivos)
- **Warning**: `#FFB84D` (Laranja para alertas)
- **Error**: `#FF4757` (Vermelho para problemas)

### Semantic Colors
- **HRV Gradient**: `#00D9FF` → `#0099CC` (Cyan para azul)
- **Sleep Quality**: `#9D4EDD` → `#5A189A` (Púrpura para sono profundo)
- **Energy Level**: `#FFB84D` → `#FF6B9D` (Laranja para vermelho - energia baixa)
- **Stress Level**: `#FF4757` → `#FFB84D` (Vermelho para laranja - estresse)

## Typography
- **Headlines**: SF Pro Display, Bold, 28-32pt
- **Subheadings**: SF Pro Display, Semibold, 18-20pt
- **Body**: SF Pro Text, Regular, 16-17pt
- **Captions**: SF Pro Text, Regular, 12-14pt

## Spacing & Layout
- **Padding**: 16pt padrão, 12pt compacto, 24pt generoso
- **Corner Radius**: 12pt para cards, 8pt para botões
- **Elevation**: Subtle shadows para profundidade (dark mode)
- **Safe Area**: Respeita notch e home indicator

## Interaction Patterns
- **Tap Feedback**: Scale 0.97 + haptic light
- **Long Press**: Ações contextuais em cards
- **Swipe**: Navegar entre tabs de dados
- **Pull-to-Refresh**: Sincronizar dados de wearables
- **Haptic Feedback**: Light para ações, Medium para confirmações
