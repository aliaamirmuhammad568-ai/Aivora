import { useCallback, useMemo, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../../src/components/Card.js'
import Modal from '../../src/components/Modal.js'
import Input from '../../src/components/Input.js'
import Button from '../../src/components/Button.js'
import EmptyState from '../../src/components/EmptyState.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { listConversations, renameConversation, deleteConversation } from '../../src/data/conversationsClient.js'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function HistoryScreen() {
  const { theme } = useAppTheme()
  const toast = useToast()
  const router = useRouter()

  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [renaming, setRenaming] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => listConversations().then(setConversations).catch((err) => toast.error(err.message)), [])

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false))
    }, [load]),
  )

  const filtered = useMemo(
    () => conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  )

  const confirmRename = async () => {
    try {
      await renameConversation(renaming.id, renameValue)
      setConversations((cs) => cs.map((c) => (c.id === renaming.id ? { ...c, title: renameValue } : c)))
      toast.success('Conversation renamed')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setRenaming(null)
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteConversation(deleting.id)
      setConversations((cs) => cs.filter((c) => c.id !== deleting.id))
      toast.success('Conversation deleted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <LoadingSpinner style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.h1, { color: theme.text }]}>History</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations..."
          placeholderTextColor={theme.textDim}
          style={[styles.search, { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text }]}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="🕘" title={conversations.length === 0 ? 'No conversations yet' : 'No matches'} description="Start a chat to see it here." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <Card>
              <Pressable onPress={() => router.push(`/chat?c=${item.id}`)}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>{item.preview}</Text>
                <Text style={{ color: theme.textDim, fontSize: 11, marginTop: 6 }}>
                  {formatDate(item.updatedAt)} · {item.messageCount} messages
                </Text>
              </Pressable>
              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => {
                    setRenaming(item)
                    setRenameValue(item.title)
                  }}
                  style={styles.actionBtn}
                >
                  <Text style={{ color: theme.brand, fontSize: 12 }}>Rename</Text>
                </Pressable>
                <Pressable onPress={() => setDeleting(item)} style={styles.actionBtn}>
                  <Text style={{ color: theme.danger, fontSize: 12 }}>Delete</Text>
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}

      <Modal visible={!!renaming} onClose={() => setRenaming(null)} title="Rename conversation">
        <Input label="Title" value={renameValue} onChangeText={setRenameValue} style={{ marginBottom: 16 }} />
        <Button title="Save" onPress={confirmRename} />
      </Modal>

      <Modal visible={!!deleting} onClose={() => setDeleting(null)} title="Delete conversation">
        <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>
          Are you sure you want to delete "{deleting?.title}"? This cannot be undone.
        </Text>
        <Button title="Delete" variant="danger" onPress={confirmDelete} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  search: { borderWidth: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, fontSize: 14 },
  actionsRow: { flexDirection: 'row', gap: 16, marginTop: 10 },
  actionBtn: { paddingVertical: 4 },
})
