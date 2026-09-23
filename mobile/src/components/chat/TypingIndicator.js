import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../../context/ThemeContext.js'

const phrases = ['Thinking...', 'Reading your message...', 'Working on it...', 'Putting a response together...', 'Almost there...']

export default function TypingIndicator() {
  const { theme } = useAppTheme()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: theme.brand }]}>
        <Text style={styles.avatarText}>A</Text>
      </View>
      <View style={[styles.bubble, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={{ color: theme.textMuted, fontSize: 13 }}>{phrases[index]}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  avatar: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  bubble: { borderRadius: 18, borderTopLeftRadius: 4, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14 },
})
