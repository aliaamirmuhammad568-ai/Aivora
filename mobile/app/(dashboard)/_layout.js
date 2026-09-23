import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { useAppTheme } from '../../src/context/ThemeContext.js'

function TabIcon({ emoji, color }) {
  return <Text style={{ fontSize: 18, opacity: color === 'transparent' ? 0.4 : 1 }}>{emoji}</Text>
}

export default function DashboardLayout() {
  const { theme } = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarInactiveTintColor: theme.textDim,
        tabBarStyle: { backgroundColor: theme.bgAlt, borderTopColor: theme.cardBorder },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: () => <TabIcon emoji="🏠" /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: () => <TabIcon emoji="💬" /> }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: () => <TabIcon emoji="🕘" /> }} />
      <Tabs.Screen name="files" options={{ title: 'Files', tabBarIcon: () => <TabIcon emoji="📁" /> }} />
      <Tabs.Screen name="usage" options={{ title: 'Usage', tabBarIcon: () => <TabIcon emoji="📊" /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: () => <TabIcon emoji="⚙️" /> }} />
    </Tabs>
  )
}
