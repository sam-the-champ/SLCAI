import { useState, useRef, useEffect } from 'react'
import { chat } from '../lib/gemma'
import { VoiceButton } from './VoiceButton'
import type { Message, TriageLevel } from '../lib/types'

interface Props { initialMessages: Message[]; triageLevel: TriageLevel }

export function ChatInterface({ initialMessages, triageLevel }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleVoiceTranscript = (text: string) => {
    setInput(prev => (prev + ' ' + text).trim())
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)
    try {
      const reply = await chat(updated, triageLevel)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. If you're in crisis, please call your local emergency number.",
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
    }}>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '8px 4px 16px',
        minHeight: 0,
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className="animate-fade-up"
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {m.role === 'assistant' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(74,210,149,0.25), rgba(56,161,105,0.15))',
                border: '1px solid rgba(74,210,149,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, marginBottom: 2,
              }}>🌿</div>
            )}

            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              fontSize: 14,
              lineHeight: 1.75,
              fontWeight: 300,
              wordBreak: 'break-word',
              ...(m.role === 'user' ? {
                background: 'linear-gradient(135deg, rgba(74,210,149,0.2), rgba(56,161,105,0.12))',
                border: '1px solid rgba(74,210,149,0.25)',
                borderRadius: '18px 18px 4px 18px',
                color: 'rgba(255,255,255,0.92)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '18px 18px 18px 4px',
                color: 'rgba(255,255,255,0.78)',
              }),
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(74,210,149,0.25), rgba(56,161,105,0.15))',
              border: '1px solid rgba(74,210,149,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🌿</div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '18px 18px 18px 4px',
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {[1, 2, 3].map(n => (
                <span key={n} className={`animate-bounce-${n}`} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'rgba(74,210,149,0.6)',
                  display: 'block', flexShrink: 0,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Crisis banner */}
      {triageLevel === 'crisis' && (
        <div style={{
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 12, padding: '8px 14px',
          marginBottom: 10,
          textAlign: 'center',
          fontSize: 12, color: '#f87171', fontWeight: 500,
        }}>
          🚨 If you're in danger, please call emergency services now
        </div>
      )}

      {/* Input bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '8px 10px 8px 6px',
        backdropFilter: 'blur(20px)',
      }}>
        <VoiceButton onTranscript={handleVoiceTranscript} disabled={loading} />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or speak how you're feeling..."
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.88)',
            caretColor: '#4ad295',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 300,
            resize: 'none',
            maxHeight: 120,
            lineHeight: 1.6,
            padding: '6px 4px',
          }}
          onInput={e => {
            const t = e.target as HTMLTextAreaElement
            t.style.height = 'auto'
            t.style.height = Math.min(t.scrollHeight, 120) + 'px'
          }}
        />

        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: input.trim() && !loading
              ? 'linear-gradient(135deg, #4ad295, #38a169)'
              : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
            boxShadow: input.trim() && !loading ? '0 0 16px rgba(74,210,149,0.3)' : 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}