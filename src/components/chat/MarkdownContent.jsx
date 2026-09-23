// Lightweight markdown-ish renderer: handles code fences, bold, and lists
// without pulling in an external dependency.
function renderInline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span key={key}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  )
}

export default function MarkdownContent({ text }) {
  const blocks = text.split(/```(\w*)\n([\s\S]*?)```/g)
  const elements = []

  for (let i = 0; i < blocks.length; i += 3) {
    const textPart = blocks[i]
    const lang = blocks[i + 1]
    const code = blocks[i + 2]

    if (textPart) {
      const lines = textPart.trim().split('\n')
      let listBuffer = []
      lines.forEach((line, idx) => {
        const isListItem = /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)
        if (isListItem) {
          listBuffer.push(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
        } else {
          if (listBuffer.length) {
            elements.push(
              <ul key={`ul-${i}-${idx}`} className="list-disc pl-5 space-y-1 my-2">
                {listBuffer.map((item, li) => (
                  <li key={li}>{renderInline(item, li)}</li>
                ))}
              </ul>,
            )
            listBuffer = []
          }
          if (line.trim()) {
            elements.push(
              <p key={`p-${i}-${idx}`} className="mb-2 last:mb-0">
                {renderInline(line, idx)}
              </p>,
            )
          }
        }
      })
      if (listBuffer.length) {
        elements.push(
          <ul key={`ul-end-${i}`} className="list-disc pl-5 space-y-1 my-2">
            {listBuffer.map((item, li) => (
              <li key={li}>{renderInline(item, li)}</li>
            ))}
          </ul>,
        )
      }
    }

    if (code !== undefined) {
      elements.push(
        <pre key={`code-${i}`} className="bg-base-950 text-slate-100 rounded-xl p-4 my-3 overflow-x-auto text-xs leading-relaxed">
          <code>{code.trim()}</code>
        </pre>,
      )
    }
  }

  return <div className="text-sm leading-relaxed">{elements}</div>
}
