import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getTheme } from '../theme/colors.js'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'aivora-theme-override'

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme()
  const [override, setOverride] = useState(null) // 'dark' | 'light' | null (follow system)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'dark' || v === 'light') setOverride(v)
      })
      .catch(() => {})
  }, [])

  const scheme = override || systemScheme || 'dark'
  const theme = useMemo(() => getTheme(scheme), [scheme])

  const setScheme = (value) => {
    setOverride(value)
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {})
  }

  return <ThemeContext.Provider value={{ theme, scheme, setScheme }}>{children}</ThemeContext.Provider>
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider')
  return ctx
}
