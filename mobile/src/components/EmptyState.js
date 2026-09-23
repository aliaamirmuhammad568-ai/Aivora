import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function EmptyState({ icon, title, description, action }) {
  const { theme } = useAppTheme()
  return (
    <View style={styles.wrap}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {description && <Text style={[styles.desc, { color: theme.textMuted }]}>{description}</Text>}
      {action}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  icon: { fontSize: 32, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  desc: { fontSize: 13, textAlign: 'center', marginBottom: 16 },
})
