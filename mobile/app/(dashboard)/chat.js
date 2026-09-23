import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatMessage from '../../src/components/chat/ChatMessage.js'
import ChatInput from '../../src/components/chat/ChatInput.js'
import TypingIndicator from '../../src/components/chat/TypingIndicator.js'
import Modal from '../../src/components/Modal.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { sendChatMessage, regenerateLastMessage } from '../../src/data/aiClient.js'
import { listConversations, getConversationMessages } from '../../src/data/conversationsClient.js'

const introMessage = { id: 'intro', role: 'assistant', content: "Hi! I'm Aivora. Ask me anything — I can help with writing, code, analysis, and more." }

function mediaKind(mimeType) {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'document'
}

export default function ChatScreen() {
  const { theme } = useAppTheme()
  const toast = useToast()
  const router = useRouter()
  const params = useLocalSearchParams()

  const [conversations, setConversations] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeId, setActiveId] = useState(params.c ? String(params.c) : null)
  const [messages, setMessages] = useState([introMessage])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)

  const refreshConversations = useCallback(() => listConversations().then(setConversations).catch(() => {}), [])

  useEffect(() => {
    refreshConversations()
  }, [refreshConversations])

  useEffect(() => {
    if (!activeId) {
      setMessages([introMessage])
      return
    }
    setMessagesLoading(true)
    getConversationMessages(activeId)
      .then((loaded) =>
        loaded.map((m) => ({
          ...m,
          media: m.media
            ? { ...m.media, dataUrl: `data:${m.media.mimeType};base64,${m.media.base64}`, kind: mediaKind(m.media.mimeType) }
            : null,
        })),
      )
      .then(setMessages)
      .catch((err) => toast.error(err.message))
      .finally(() => setMessagesLoading(false))
  }, [activeId])

  const defaultMessageFor = (media) => {
    if (media?.kind === 'image') return 'Describe this image.'
    if (media?.kind === 'video') return 'Describe this video.'
    if (media?.kind === 'document') return 'Summarize this document.'
    return ''
  }

  const handleSend = async (text, media) => {
    if (!text && !media) return
    const finalText = text || defaultMessageFor(media)
    const userMsg = { id: `local-${Date.now()}`, role: 'user', content: finalText, media }
    setMessages((m) => [...m, userMsg])
    setTyping(true)
    try {
      const { conversationId, content } = await sendChatMessage({ conversationId: activeId, message: finalText, media })
      setMessages((m) => [...m, { id: `local-${Date.now()}-r`, role: 'assistant', content }])
      if (!activeId) setActiveId(String(conversationId))
      refreshConversations()
    } catch (err) {
      setMessages((m) => [...m, { id: `local-${Date.now()}-e`, role: 'assistant', content: `⚠️ ${err.message}` }])
    } finally {
      setTyping(false)
    }
  }

  const handleRegenerate = async () => {
    if (!activeId) return
    setTyping(true)
    setMessages((m) => m.slice(0, -1))
    try {
      const { content } = await regenerateLastMessage(activeId)
      setMessages((m) => [...m, { id: `local-${Date.now()}-r`, role: 'assistant', content }])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTyping(false)
    }
  }

  const handleNewChat = () => {
    setActiveId(null)
    setMessages([introMessage])
    setPickerOpen(false)
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Pressable onPress={() => setPickerOpen(true)} style={styles.headerButton}>
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>🕘 Conversations</Text>
        </Pressable>
        <Pressable onPress={handleNewChat} style={styles.headerButton}>
          <Text style={{ color: theme.brand, fontSize: 13, fontWeight: '700' }}>+ New chat</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        {messagesLoading ? (
          <LoadingSpinner style={{ flex: 1 }} />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <ChatMessage
                role={item.role}
                content={item.content}
                media={item.media}
                isLast={item.role === 'assistant' && item.id === lastAssistantId}
                onRegenerate={activeId ? handleRegenerate : undefined}
              />
            )}
            ListFooterComponent={typing ? <TypingIndicator /> : null}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        <ChatInput onSend={handleSend} disabled={typing} />
      </KeyboardAvoidingView>

      <Modal visible={pickerOpen} onClose={() => setPickerOpen(false)} title="Conversations">
        {conversations.length === 0 ? (
          <Text style={{ color: theme.textMuted, fontSize: 13, paddingVertical: 12 }}>No conversations yet.</Text>
        ) : (
          conversations.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                setActiveId(String(c.id))
                setPickerOpen(false)
              }}
              style={styles.convoRow}
            >
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{c.title}</Text>
              <Text style={{ color: theme.textDim, fontSize: 12 }} numberOfLines={1}>{c.preview}</Text>
            </Pressable>
          ))
        )}
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  headerButton: { paddingVertical: 4, paddingHorizontal: 6 },
  convoRow: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(148,163,184,0.15)' },
})
