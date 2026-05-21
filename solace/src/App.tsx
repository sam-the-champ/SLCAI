import { useState } from 'react'
import { assessMood } from './lib/gemma'
import { saveEntry } from './lib/journal'
import { AssessmentPanel } from './components/AssessmentPanel'
import { ChatInterface } from './components/ChatInterface'
import { MoodJournal } from './components/MoodJournal'
import { VoiceButton } from './components/VoiceButton'
import type { Assessment, Message } from './lib/types'
import './index.css'

type Screen = 'home' | 'loading' | 'assessment' | 'chat' | 'journal'

const MOODS = [
  { label: 'Anxious', emoji: '😰' },
  { label: 'Sad', emoji: '😔' },
  { label: 'Angry', emoji: '😤' },
  { label: 'Numb', emoji: '😶' },
  { label: 'Stressed', emoji: '😩' },
  { label: 'Lonely', emoji: '🫂' },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [input, setInput] = useState('')
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [error, setError] = useState('')

  const handleVoiceTranscript = (text: string) => {
    setInput(prev => (prev + ' ' + text).trim())
  }

  const handleMoodTap = (label: string) => {
    setInput(prev =>
      prev ? `${prev} I'm feeling ${label.toLowerCase()}.` : `I'm feeling ${label.toLowerCase()}.`
    )
  }

  const handleSubmit = async () => {
    const text = input.trim()
    if (!text) return
    setError('')
    setScreen('loading')
    try {
      const result = await assessMood(text)
      setAssessment(result)
      saveEntry(result.triageLevel, text)
      setScreen('assessment')
    } catch {
      setError('Something went wrong. Check your API key and try again.')
      setScreen('home')
    }
  }

  const handleContinueToChat = () => {
    if (!assessment) return
    setChatMessages([{
      role: 'assistant',
      content: `${assessment.affirmation} I'm here and I'm listening. What would you like to talk about?`,
    }])
    setScreen('chat')
  }

  const handleReset = () => {
    setScreen('home')
    setInput('')
    setAssessment(null)
    setChatMessages([])
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,210,149,0.13) 0%, transparent 70%)',
        top: -150, right: -150, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,179,237,0.1) 0%, transparent 70%)',
        bottom: -80, left: -100, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
        top: '45%', left: '35%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,11,18,0.8)',
        padding: '14px 20px',
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4ad295, #38a169)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, boxShadow: '0 0 16px rgba(74,210,149,0.4)',
            }}>🌿</div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              background: 'linear-gradient(135deg, #4ad295, #63b3ed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Solace</span>
          </button>
          <button
            onClick={() => setScreen(screen === 'journal' ? 'home' : 'journal')}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, padding: '6px 14px',
              borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontWeight: 400, transition: 'all 0.2s',
            }}
          >
            {screen === 'journal' ? '← Back' : '📔 Journal'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 40px', position: 'relative', zIndex: 1 }}>

        {/* HOME */}
        {screen === 'home' && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: 28, lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: 8,
              }}>
                How are you{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #4ad295, #63b3ed)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>feeling</span>
                {' '}today?
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300 }}>
                No judgment · No sign-up · Just a safe space to be honest
              </p>
            </div>

            {/* Mood chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {MOODS.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => handleMoodTap(m.label)}
                  className={`animate-fade-up delay-${(i + 1) * 100 > 500 ? 500 : (i + 1) * 100}`}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14, padding: '13px 8px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(74,210,149,0.08)'
                    el.style.borderColor = 'rgba(74,210,149,0.3)'
                    el.style.transform = 'translateY(-2px)'
                    el.style.color = 'var(--green)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = 'var(--surface)'
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'translateY(0)'
                    el.style.color = 'var(--text-secondary)'
                  }}
                >
                  <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 400 }}>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Input card */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20, overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              transition: 'border-color 0.2s',
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit() }}
                placeholder="Or tell me in your own words... what's going on?"
                rows={4}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                  fontSize: 14, fontWeight: 300, padding: '18px 20px 10px',
                  resize: 'none', lineHeight: 1.7,
                }}
              />
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '10px 14px 14px',
              }}>
                <VoiceButton onTranscript={handleVoiceTranscript} />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim()
                      ? 'linear-gradient(135deg, #4ad295, #38a169)'
                      : 'rgba(255,255,255,0.06)',
                    border: 'none', borderRadius: 12,
                    color: input.trim() ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                    padding: '10px 20px', cursor: input.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: input.trim() ? '0 4px 20px rgba(74,210,149,0.3)' : 'none',
                    transition: 'all 0.25s',
                  }}
                >
                  Talk to Solace →
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 12, padding: '12px 16px',
                color: 'rgba(248,113,113,0.9)', fontSize: 13, textAlign: 'center',
              }}>{error}</div>
            )}

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
              Your conversations are private and never stored on our servers
            </p>
          </div>
        )}

        {/* LOADING */}
        {screen === 'loading' && (
          <div className="animate-fade-in" style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', gap: 24,
          }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid rgba(74,210,149,0.15)',
              }} />
              <div className="animate-spin" style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#4ad295',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>🌿</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>
                Listening carefully...
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Taking a moment to understand what you shared
              </p>
            </div>
          </div>
        )}

        {/* ASSESSMENT */}
        {screen === 'assessment' && assessment && (
          <AssessmentPanel assessment={assessment} onContinue={handleContinueToChat} />
        )}

        {/* CHAT */}
        {screen === 'chat' && assessment && (
          <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            <ChatInterface initialMessages={chatMessages} triageLevel={assessment.triageLevel} />
          </div>
        )}

        {/* JOURNAL */}
        {screen === 'journal' && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
                Mood Journal
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Your last 30 check-ins, stored only on this device
              </p>
            </div>
            <MoodJournal />
          </div>
        )}
      </main>
    </div>
  )
}