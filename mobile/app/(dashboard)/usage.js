import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../../src/components/Card.js'
import Badge from '../../src/components/Badge.js'
import Button from '../../src/components/Button.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { fetchUsage } from '../../src/data/usageClient.js'
import { useRouter } from 'expo-router'

export default function UsageScreen() {
  const { theme } = useAppTheme()
  const toast = useToast()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      fetchUsage()
        .then(setStats)
        .catch((err) => toast.error(err.message))
        .finally(() => setLoading(false))
    }, []),
  )

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <LoadingSpinner style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  const maxUsage = Math.max(1, ...(stats?.monthly.map((m) => m.value) || [1]))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.h1, { color: theme.text }]}>Usage & Billing</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>Your real usage, pulled live from your account.</Text>

        <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: theme.text, fontWeight: '700' }}>Current plan</Text>
              <Badge label="Free" tone="brand" />
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>Unlimited messages in free preview</Text>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={{ flex: 1 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Tokens used</Text>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 4 }}>{(stats?.tokensUsed ?? 0).toLocaleString()}</Text>
          </Card>
          <Card style={{ flex: 1 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Messages sent</Text>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 4 }}>{(stats?.messagesUsed ?? 0).toLocaleString()}</Text>
          </Card>
        </View>

        <Card style={{ marginTop: 14 }}>
          <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 10 }}>Messages per month</Text>
          {!stats?.monthly.length ? (
            <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 20, textAlign: 'center' }}>No chat activity yet.</Text>
          ) : (
            <View style={styles.chartRow}>
              {stats.monthly.map((m) => (
                <View key={m.month} style={styles.chartCol}>
                  <View style={[styles.bar, { height: Math.max(4, (m.value / maxUsage) * 90), backgroundColor: theme.brand }]} />
                  <Text style={{ color: theme.textDim, fontSize: 10 }}>{m.month}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={{ marginTop: 14, marginBottom: 24 }}>
          <Text style={{ color: theme.text, fontWeight: '700' }}>Need more capacity?</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4, marginBottom: 12 }}>
            Business plans include unlimited tokens and team analytics.
          </Text>
          <Button title="View plans" variant="secondary" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110 },
  chartCol: { alignItems: 'center', gap: 6, flex: 1 },
  bar: { width: 16, borderRadius: 6 },
})
