import { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../../context/ThemeContext.js'
import MarkdownContent from './MarkdownContent.js'

export default function ChatMessage({ role, content, media, isLast, onRegenerate }) {
  const { theme } = useAppTheme()
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={[styles.userBubble, { backgroundColor: theme.brand }]}>
          {media && (
            <View style={{ marginBottom: 8 }}>
              {media.kind === 'image' && <Image source={{ uri: media.dataUrl }} style={styles.mediaImage} />}
              {media.kind === 'video' && (
                <View style={styles.docChip}>
                  <Text style={{ fontSize: 20 }}>🎞️</Text>
                  <Text style={styles.docChipText} numberOfLines={1}>{media.name}</Text>
                </View>
              )}
              {media.kind === 'document' && (
                <View style={styles.docChip}>
                  <Text style={{ fontSize: 20 }}>📄</Text>
                  <Text style={styles.docChipText} numberOfLines={1}>{media.name}</Text>
                </View>
              )}
            </View>
          )}
          {!!content && <Text style={styles.userText}>{content}</Text>}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.assistantRow}>
      <View style={[styles.avatar, { backgroundColor: theme.brand }]}>
        <Text style={styles.avatarText}>A</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={[styles.assistantBubble, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <MarkdownContent text={content} />
        </View>
        <View style={styles.actionsRow}>
          <Pressable onPress={handleCopy} style={styles.actionButton}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{copied ? 'Copied' : 'Copy'}</Text>
          </Pressable>
          {isLast && onRegenerate && (
            <Pressable onPress={onRegenerate} style={styles.actionButton}>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>Regenerate</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  userBubble: { maxWidth: '85%', borderRadius: 18, borderTopRightRadius: 4, padding: 14 },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  mediaImage: { width: 180, height: 140, borderRadius: 12 },
  docChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 10 },
  docChipText: { color: '#fff', fontSize: 12, flexShrink: 1 },
  assistantRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  avatar: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  assistantBubble: { borderRadius: 18, borderTopLeftRadius: 4, borderWidth: 1, padding: 14 },
  actionsRow: { flexDirection: 'row', gap: 4, marginTop: 6, marginLeft: 4 },
  actionButton: { paddingVertical: 4, paddingHorizontal: 8 },
})
