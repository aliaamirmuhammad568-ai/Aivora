// Matches the web app's brand palette (tailwind.config.js) so the mobile
// app feels like the same product.
export const colors = {
  brand50: '#f2f0ff',
  brand100: '#e6e1ff',
  brand300: '#a794ff',
  brand400: '#8b6bff',
  brand500: '#7c4dff',
  brand600: '#6a2df0',
  accent400: '#4fd1ff',
  accent500: '#22b8f2',

  base950: '#05050a',
  base900: '#0a0a14',
  base800: '#121220',
  base700: '#1b1b2e',
  base600: '#26263e',

  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',

  red400: '#f87171',
  red500: '#ef4444',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  emerald400: '#34d399',
  emerald500: '#10b981',
}

export function getTheme(scheme) {
  const dark = scheme === 'dark'
  return {
    scheme,
    dark,
    bg: dark ? colors.base950 : colors.white,
    bgAlt: dark ? colors.base900 : colors.slate50,
    card: dark ? 'rgba(255,255,255,0.04)' : colors.white,
    cardBorder: dark ? 'rgba(255,255,255,0.10)' : colors.slate200,
    text: dark ? colors.white : colors.slate900,
    textMuted: dark ? colors.slate400 : colors.slate500,
    textDim: dark ? colors.slate500 : colors.slate400,
    inputBg: dark ? 'rgba(255,255,255,0.05)' : colors.white,
    border: dark ? 'rgba(255,255,255,0.10)' : colors.slate300,
    brand: colors.brand500,
    brandSoft: dark ? 'rgba(124,77,255,0.15)' : colors.brand50,
    danger: colors.red500,
    success: colors.emerald500,
    warning: colors.amber500,
  }
}
