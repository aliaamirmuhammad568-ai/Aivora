import { ActivityIndicator, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function LoadingSpinner({ size = 'large', style }) {
  const { theme } = useAppTheme()
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 24 }, style]}>
      <ActivityIndicator size={size} color={theme.brand} />
    </View>
  )
}
