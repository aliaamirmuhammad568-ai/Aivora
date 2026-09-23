import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../../context/ThemeContext.js'

function InlineText({ text, style }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} style={{ fontWeight: '700' }}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  )
}

export default function MarkdownContent({ text }) {
  const { theme } = useAppTheme()
  const blocks = text.split(/```(\w*)\n([\s\S]*?)```/g)
  const elements = []

  for (let i = 0; i < blocks.length; i += 3) {
    const textPart = blocks[i]
    const code = blocks[i + 2]

    if (textPart) {
      const lines = textPart.trim().split('\n')
      lines.forEach((line, idx) => {
        const isListItem = /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)
        if (isListItem) {
          const content = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')
          elements.push(
            <View key={`li-${i}-${idx}`} style={styles.listItem}>
              <Text style={{ color: theme.text }}>{'• '}</Text>
              <InlineText text={content} style={{ color: theme.text, flex: 1, fontSize: 14, lineHeight: 20 }} />
            </View>,
          )
        } else if (line.trim()) {
          elements.push(<InlineText key={`p-${i}-${idx}`} text={line} style={[styles.paragraph, { color: theme.text }]} />)
        }
      })
    }

    if (code !== undefined) {
      elements.push(
        <View key={`code-${i}`} style={[styles.codeBlock, { backgroundColor: theme.dark ? '#05050a' : '#0f172a' }]}>
          <Text style={styles.codeText}>{code.trim()}</Text>
        </View>,
      )
    }
  }

  return <View>{elements}</View>
}

const styles = StyleSheet.create({
  paragraph: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  listItem: { flexDirection: 'row', marginBottom: 4 },
  codeBlock: { borderRadius: 12, padding: 12, marginVertical: 6 },
  codeText: { color: '#f1f5f9', fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
})
