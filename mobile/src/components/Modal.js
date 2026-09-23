import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function Modal({ visible, onClose, title, children }) {
  const { theme } = useAppTheme()

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.dark ? '#12121e' : '#fff', borderColor: theme.cardBorder }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={{ color: theme.textMuted, fontSize: 18 }}>×</Text>
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  sheet: { borderRadius: 20, borderWidth: 1, padding: 20, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '700' },
})
