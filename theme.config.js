/** @type {const} */
const themeColors = {
  primary: { light: '#00D9FF', dark: '#00D9FF' },
  secondary: { light: '#FF6B9D', dark: '#FF6B9D' },
  background: { light: '#ffffff', dark: '#0F1419' },
  surface: { light: '#f5f5f5', dark: '#1A1F2E' },
  foreground: { light: '#11181C', dark: '#F0F4F8' },
  muted: { light: '#687076', dark: '#8B92A0' },
  border: { light: '#E5E7EB', dark: '#2D3748' },
  success: { light: '#22C55E', dark: '#00D973' },
  warning: { light: '#F59E0B', dark: '#FFB84D' },
  error: { light: '#EF4444', dark: '#FF4757' },
  accent: { light: '#00D9FF', dark: '#00D9FF' },
};

module.exports = { themeColors };

// Gradients for charts
const gradients = {
  hrv: ['#00D9FF', '#0099CC'],
  sleep: ['#9D4EDD', '#5A189A'],
  energy: ['#FFB84D', '#FF6B9D'],
  stress: ['#FF4757', '#FFB84D'],
};

module.exports = { themeColors, gradients };
