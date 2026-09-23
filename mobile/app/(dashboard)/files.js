import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'
import Card from '../../src/components/Card.js'
import Button from '../../src/components/Button.js'
import EmptyState from '../../src/components/EmptyState.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { listFiles, uploadFile, deleteFile } from '../../src/data/filesClient.js'

const MAX_FILE_BYTES = 8 * 1024 * 1024

function iconFor(mimeType) {
  if (mimeType?.startsWith('image/')) return '🖼️'
  if (mimeType?.startsWith('video/')) return '🎞️'
  if (mimeType === 'application/pdf') return '📕'
  return '📄'
}

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.ceil(bytes / 1024)} KB`
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function FilesScreen() {
  const { theme } = useAppTheme()
  const toast = useToast()

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(() => listFiles().then(setFiles).catch((err) => toast.error(err.message)), [])

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false))
    }, [load]),
  )

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false })
    if (result.canceled || !result.assets?.[0]) return

    const asset = result.assets[0]
    if (asset.size && asset.size > MAX_FILE_BYTES) {
      toast.error(`File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`)
      return
    }

    setUploading(true)
    try {
      const base64 = await new File(asset.uri).base64()
      const uploaded = await uploadFile({ name: asset.name, mimeType: asset.mimeType || 'application/octet-stream', base64 })
      setFiles((fs) => [uploaded, ...fs])
      toast.success(`${asset.name} uploaded`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, name) => {
    try {
      await deleteFile(id)
      setFiles((fs) => fs.filter((f) => f.id !== id))
      toast.info(`Deleted ${name}`)
    } catch (err) {
      toast.error(err.message)
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
        <Text style={[styles.h1, { color: theme.text }]}>Files</Text>
        <Button title={uploading ? 'Uploading...' : '+ Upload file'} onPress={handlePick} loading={uploading} size="sm" />
      </View>

      {files.length === 0 ? (
        <EmptyState icon="📁" title="No files yet" description="Upload a file to get started." />
      ) : (
        <FlatList
          data={files}
          keyExtractor={(f) => String(f.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <Card style={styles.fileRow}>
              <Text style={{ fontSize: 22 }}>{iconFor(item.mimeType)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '600', fontSize: 13 }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ color: theme.textDim, fontSize: 11 }}>{formatSize(item.size)} · {formatDate(item.createdAt)}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id, item.name)} hitSlop={8}>
                <Text style={{ color: theme.danger, fontSize: 12 }}>Delete</Text>
              </Pressable>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  h1: { fontSize: 22, fontWeight: '800' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
})
