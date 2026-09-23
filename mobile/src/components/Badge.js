import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function Badge({ label, tone = 'brand' }) {
  const { theme } = useAppTheme()
  const tones = {
    brand: { bg: theme.dark ? 'rgba(124,77,255,0.18)' : '#f2f0ff', fg: theme.brand },
    green: { bg: theme.dark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', fg: theme.success },
    amber: { bg: theme.dark ? 'rgba(245,158,11,0.15)' : '#fffbeb', fg: theme.warning },
    red: { bg: theme.dark ? 'rgba(239,68,68,0.15)' : '#fef2f2', fg: theme.danger },
  }
  const t = tones[tone] || tones.brand

  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '600' },
})
