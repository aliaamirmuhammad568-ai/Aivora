import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, icon }) {
  const { theme } = useAppTheme()
  const isDisabled = disabled || loading

  const variants = {
    primary: { backgroundColor: theme.brand, borderColor: theme.brand },
    secondary: { backgroundColor: theme.card, borderColor: theme.cardBorder },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    danger: { backgroundColor: theme.danger, borderColor: theme.danger },
  }
  const textColors = {
    primary: '#fff',
    secondary: theme.text,
    ghost: theme.brand,
    danger: '#fff',
  }
  const sizes = { sm: { paddingVertical: 8, paddingHorizontal: 14 }, md: { paddingVertical: 12, paddingHorizontal: 18 }, lg: { paddingVertical: 15, paddingHorizontal: 22 } }
  const fontSizes = { sm: 13, md: 14, lg: 16 }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variants[variant],
        sizes[size],
        { opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColors[variant], fontSize: fontSizes[size] }]}>{title}</Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  text: { fontWeight: '600' },
})
