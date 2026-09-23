import { useCallback, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../../src/components/Card.js'
import Badge from '../../src/components/Badge.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useAuth } from '../../src/context/AuthContext.js'
import { fetchUsage } from '../../src/data/usageClient.js'
import { listConversations } from '../../src/data/conversationsClient.js'
import { listFiles } from '../../src/data/filesClient.js'
import { fetchActivity } from '../../src/data/activityClient.js'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Yesterday' : `${days}d ago`
}

export default function DashboardHomeScreen() {
  const { theme } = useAppTheme()
  const { user } = useAuth()
  const router = useRouter()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const [usage, setUsage] = useState(null)
  const [conversations, setConversations] = useState([])
  const [files, setFiles] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(() => {
    return Promise.all([
      fetchUsage().catch(() => null),
      listConversations().catch(() => []),
      listFiles().catch(() => []),
      fetchActivity().catch(() => []),
    ]).then(([u, c, f, a]) => {
      setUsage(u)
      setConversations(c)
      setFiles(f)
      setActivity(a)
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false))
    }, [load]),
  )

  const onRefresh = () => {
    setRefreshing(true)
    load().finally(() => setRefreshing(false))
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <LoadingSpinner style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  const maxUsage = Math.max(1, ...(usage?.monthly.map((m) => m.value) || [1]))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brand} />}
      >
        <Text style={[styles.h1, { color: theme.text }]}>Welcome back, {firstName} 👋</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>Here's what's happening in your workspace.</Text>

        <View style={styles.statsRow}>
          <Card style={{ flex: 1 }}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Messages</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{(usage?.messagesUsed ?? 0).toLocaleString()}</Text>
            <Badge label="Free · Unlimited" tone="green" />
          </Card>
          <Card style={{ flex: 1 }}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Tokens used</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{(usage?.tokensUsed ?? 0).toLocaleString()}</Text>
          </Card>
        </View>

        <Card style={{ marginTop: 14 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Messages per month</Text>
          {!usage?.monthly.length ? (
            <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 20, textAlign: 'center' }}>
              No chat activity yet.
            </Text>
          ) : (
            <View style={styles.chartRow}>
              {usage.monthly.map((m) => (
                <View key={m.month} style={styles.chartCol}>
                  <View style={[styles.bar, { height: Math.max(4, (m.value / maxUsage) * 80), backgroundColor: theme.brand }]} />
                  <Text style={[styles.chartLabel, { color: theme.textDim }]}>{m.month}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Recent activity</Text>
          {activity.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 12 }}>No activity yet.</Text>
          ) : (
            activity.map((a) => (
              <View key={a.id} style={styles.activityRow}>
                <Text style={{ fontSize: 16 }}>{a.type === 'chat' ? '💬' : a.type === 'file' ? '📁' : '⚙️'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 13 }}>{a.label}</Text>
                  <Text style={{ color: theme.textDim, fontSize: 11 }}>{timeAgo(a.createdAt)}</Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Recent conversations</Text>
          {conversations.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 12 }}>No conversations yet.</Text>
          ) : (
            conversations.slice(0, 4).map((c) => (
              <View key={c.id} style={styles.listRow}>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }} numberOfLines={1}>{c.title}</Text>
                <Text style={{ color: theme.textDim, fontSize: 11 }}>{timeAgo(c.updatedAt)}</Text>
              </View>
            ))
          )}
        </Card>

        <Card style={{ marginTop: 14, marginBottom: 24 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Recent files</Text>
          {files.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 12 }}>No files yet.</Text>
          ) : (
            files.slice(0, 4).map((f) => (
              <View key={f.id} style={styles.listRow}>
                <Text style={{ color: theme.text, fontSize: 13 }} numberOfLines={1}>{f.name}</Text>
                <Text style={{ color: theme.textDim, fontSize: 11 }}>{timeAgo(f.createdAt)}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 24, fontWeight: '800', marginVertical: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  chartCol: { alignItems: 'center', gap: 6, flex: 1 },
  bar: { width: 16, borderRadius: 6 },
  chartLabel: { fontSize: 10 },
  activityRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 8 },
  listRow: { paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(148,163,184,0.15)' },
})
