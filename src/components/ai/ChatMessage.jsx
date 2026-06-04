
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  // Inline formatting helper (**bold**, *italic*, `code`)
  const parseInline = (text) => {
    if (!text) return ''
    const tokens = []
    let currentText = text
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/

    let keyCounter = 0

    while (currentText) {
      const match = currentText.match(inlineRegex)
      if (!match) {
        tokens.push(currentText)
        break
      }

      const matchIndex = match.index
      const matchedString = match[0]

      // Add preceding plain text
      if (matchIndex > 0) {
        tokens.push(currentText.substring(0, matchIndex))
      }

      // Add styled token
      const key = `${currentText.length}-${keyCounter++}`
      if (matchedString.startsWith('**') && matchedString.endsWith('**')) {
        tokens.push(
          <strong key={key} className="font-extrabold text-slate-950">
            {matchedString.slice(2, -2)}
          </strong>
        )
      } else if (matchedString.startsWith('*') && matchedString.endsWith('*')) {
        tokens.push(
          <em key={key} className="italic text-slate-800">
            {matchedString.slice(1, -1)}
          </em>
        )
      } else if (matchedString.startsWith('`') && matchedString.endsWith('`')) {
        tokens.push(
          <code key={key} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-sky-600 font-mono text-[11px] font-medium">
            {matchedString.slice(1, -1)}
          </code>
        )
      }

      currentText = currentText.substring(matchIndex + matchedString.length)
    }

    return tokens
  }

  const renderContent = (text) => {
    if (!text) return null

    const parts = []
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim()
      })
      lastIndex = codeBlockRegex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        return (
          <div key={`code-${index}`} className="my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-300 border-b border-slate-700 text-[10px] uppercase font-bold tracking-wider select-none">
              <span>{part.language}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(part.content)}
                className="hover:text-white text-slate-400 transition-colors cursor-pointer px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-650"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-100 leading-relaxed">
              <code>{part.content}</code>
            </pre>
          </div>
        )
      }

      const lines = part.content.split('\n')
      const blockElements = []
      let listItems = []

      const flushList = (key) => {
        if (listItems.length > 0) {
          blockElements.push(
            <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-slate-700">
              {listItems.map((li, i) => (
                <li key={`li-${key}-${i}`}>{parseInline(li)}</li>
              ))}
            </ul>
          )
          listItems = []
        }
      }

      lines.forEach((line, lineIdx) => {
        const trimmed = line.trim()

        if (!trimmed) {
          flushList(lineIdx)
          blockElements.push(<div key={`space-${lineIdx}`} className="h-1.5" />)
          return
        }

        // Headers
        if (line.startsWith('# ')) {
          flushList(lineIdx)
          blockElements.push(
            <h1 key={`h1-${lineIdx}`} className="text-lg font-black text-slate-900 mt-4 mb-2 border-b border-slate-100 pb-1">
              {parseInline(line.slice(2))}
            </h1>
          )
        } else if (line.startsWith('## ')) {
          flushList(lineIdx)
          blockElements.push(
            <h2 key={`h2-${lineIdx}`} className="text-base font-extrabold text-slate-900 mt-3 mb-1">
              {parseInline(line.slice(3))}
            </h2>
          )
        } else if (line.startsWith('### ')) {
          flushList(lineIdx)
          blockElements.push(
            <h3 key={`h3-${lineIdx}`} className="text-sm font-bold text-slate-800 mt-2 mb-1">
              {parseInline(line.slice(4))}
            </h3>
          )
        }
        // Blockquotes and Warnings / Alerts
        else if (line.startsWith('> ')) {
          flushList(lineIdx)
          const alertTypeMatch = line.match(/^>\s+\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)
          if (alertTypeMatch) {
            const type = alertTypeMatch[1]
            let colorClass = 'border-cyan-500 bg-cyan-50/50 text-cyan-800'
            if (type === 'IMPORTANT' || type === 'WARNING') {
              colorClass = 'border-amber-500 bg-amber-50/50 text-amber-800'
            } else if (type === 'CAUTION') {
              colorClass = 'border-red-500 bg-red-50/50 text-red-800'
            }
            blockElements.push(
              <div key={`alert-${lineIdx}`} className={`border-l-4 p-2.5 my-2 rounded-r-lg text-[11px] font-bold ${colorClass}`}>
                {type} Alert
              </div>
            )
          } else {
            blockElements.push(
              <blockquote key={`bq-${lineIdx}`} className="border-l-4 border-slate-200 pl-3 my-2 italic text-slate-500">
                {parseInline(line.slice(2))}
              </blockquote>
            )
          }
        }
        // Bullet points
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          listItems.push(line.slice(2))
        }
        // Normal paragraphs
        else {
          flushList(lineIdx)
          blockElements.push(
            <p key={`p-${lineIdx}`} className="my-1 text-slate-700 leading-relaxed">
              {parseInline(line)}
            </p>
          )
        }
      })

      flushList(lines.length)
      return <div key={`block-${index}`}>{blockElements}</div>
    })
  }

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-[13px] shadow-sm leading-relaxed
          ${isUser 
            ? 'bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-br-none border border-slate-800' 
            : 'bg-white text-slate-700 rounded-bl-none border border-slate-150 shadow-sm text-left'
          }`}
      >
        <div className={`flex items-center gap-1.5 mb-1 text-[9px] font-black tracking-wider uppercase select-none
          ${isUser ? 'text-slate-400' : 'text-cyan-500'}`}
        >
          <span>{isUser ? 'You' : 'Sam Fitness Concierge'}</span>
        </div>
        <div className="space-y-0.5">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  )
}
