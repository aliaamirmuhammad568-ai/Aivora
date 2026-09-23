import { StyleSheet, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function Card({ children, style }) {
  const { theme } = useAppTheme()
  return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16 },
})
