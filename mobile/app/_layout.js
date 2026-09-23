import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext.js'
import { AuthProvider, useAuth } from '../src/context/AuthContext.js'
import { ToastProvider } from '../src/context/ToastContext.js'
import LoadingSpinner from '../src/components/LoadingSpinner.js'
import { View } from 'react-native'

function RootNavigator() {
  const { user, loading } = useAuth()
  const { theme } = useAppTheme()

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <LoadingSpinner style={{ flex: 1 }} />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(dashboard)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
