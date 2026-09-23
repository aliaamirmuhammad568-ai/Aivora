import { createContext, useCallback, useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppTheme } from './ThemeContext.js'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const { theme } = useAppTheme()

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), duration)
    },
    [removeToast],
  )

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }

  const toneColor = { success: theme.success, error: theme.danger, info: theme.brand }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <SafeAreaView pointerEvents="none" style={styles.wrap}>
        {toasts.map((t) => (
          <View
            key={t.id}
            style={[
              styles.toast,
              { backgroundColor: theme.dark ? theme.base900 || '#0a0a14' : theme.white || '#fff', borderColor: toneColor[t.type] },
            ]}
          >
            <Text style={[styles.text, { color: theme.text }]}>{t.message}</Text>
          </View>
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, padding: 12, gap: 8 },
  toast: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8, shadowOpacity: 0.15, shadowRadius: 8 },
  text: { fontSize: 14 },
})
