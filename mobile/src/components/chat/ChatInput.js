import { useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'
import { useAppTheme } from '../../context/ThemeContext.js'
import { useToast } from '../../context/ToastContext.js'

const MAX_FILE_BYTES = 8 * 1024 * 1024

function kindFor(mimeType) {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'document'
}

export default function ChatInput({ onSend, disabled }) {
  const { theme } = useAppTheme()
  const toast = useToast()
  const [value, setValue] = useState('')
  const [media, setMedia] = useState(null)
  const [encoding, setEncoding] = useState(false)

  const pickPhotoOrVideo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      toast.error('Photo library permission is required.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      base64: true,
      quality: 0.8,
    })
    if (result.canceled || !result.assets?.[0]) return

    const asset = result.assets[0]
    const mimeType = asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg')
    setEncoding(true)
    try {
      let base64 = asset.base64
      if (!base64) base64 = await new File(asset.uri).base64()
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        toast.error(`File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`)
        return
      }
      setMedia({
        name: asset.fileName || `attachment.${mimeType.split('/')[1] || 'jpg'}`,
        mimeType,
        base64,
        dataUrl: `data:${mimeType};base64,${base64}`,
        kind: kindFor(mimeType),
      })
    } catch {
      toast.error('Could not read that file.')
    } finally {
      setEncoding(false)
    }
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv',
        'text/markdown',
      ],
      copyToCacheDirectory: true,
    })
    if (result.canceled || !result.assets?.[0]) return

    const asset = result.assets[0]
    if (asset.size && asset.size > MAX_FILE_BYTES) {
      toast.error(`File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`)
      return
    }
    setEncoding(true)
    try {
      const base64 = await new File(asset.uri).base64()
      setMedia({
        name: asset.name,
        mimeType: asset.mimeType || 'application/octet-stream',
        base64,
        kind: 'document',
      })
    } catch {
      toast.error('Could not read that file.')
    } finally {
      setEncoding(false)
    }
  }

  const handleSubmit = () => {
    if (!value.trim() && !media) return
    onSend(value.trim(), media)
    setValue('')
    setMedia(null)
  }

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg, borderTopColor: theme.cardBorder }]}>
      {media && (
        <View style={styles.previewRow}>
          {media.kind === 'image' ? (
            <Image source={{ uri: media.dataUrl }} style={styles.previewImage} />
          ) : (
            <View style={[styles.docPreview, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={{ fontSize: 18 }}>{media.kind === 'video' ? '🎞️' : '📄'}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={1}>{media.name}</Text>
            </View>
          )}
          <Pressable onPress={() => setMedia(null)} style={styles.removeButton}>
            <Text style={{ color: '#fff', fontSize: 12 }}>×</Text>
          </Pressable>
        </View>
      )}
      <View style={[styles.inputRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Pressable onPress={pickPhotoOrVideo} disabled={encoding} style={styles.iconButton}>
          <Text style={{ fontSize: 18 }}>🖼️</Text>
        </Pressable>
        <Pressable onPress={pickDocument} disabled={encoding} style={styles.iconButton}>
          <Text style={{ fontSize: 18 }}>📎</Text>
        </Pressable>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Message Aivora..."
          placeholderTextColor={theme.textDim}
          style={[styles.input, { color: theme.text }]}
          multiline
          editable={!disabled}
        />
        {encoding ? (
          <ActivityIndicator size="small" color={theme.brand} />
        ) : (
          <Pressable
            onPress={handleSubmit}
            disabled={disabled || (!value.trim() && !media)}
            style={[styles.sendButton, { backgroundColor: theme.brand, opacity: disabled || (!value.trim() && !media) ? 0.4 : 1 }]}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>➤</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1, padding: 12 },
  previewRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  previewImage: { width: 64, height: 64, borderRadius: 12 },
  docPreview: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, maxWidth: 200 },
  removeButton: { backgroundColor: '#0f172a', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 6, gap: 4 },
  iconButton: { padding: 8 },
  input: { flex: 1, fontSize: 14, maxHeight: 100, paddingVertical: 8, paddingHorizontal: 4 },
  sendButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
})
