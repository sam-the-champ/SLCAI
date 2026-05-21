import { useEffect } from 'react'
import { useVoice } from '../lib/useVoice'

interface VoiceButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const { isListening, isSupported, transcript, startListening, stopListening } = useVoice()

  useEffect(() => {
    if (transcript.trim()) onTranscript(transcript.trim())
  }, [transcript])

  if (!isSupported) return null

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Speak your feelings'}
      style={{
        position: 'relative', width: 40, height: 40, borderRadius: '50%',
        background: isListening ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isListening ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: isListening ? '#f87171' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s',
      }}
    >
      {isListening && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(248,113,113,0.3)',
          animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
        }} />
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M19 10a7 7 0 0 1-14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    </button>
  )
}