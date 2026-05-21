import { useState, useEffect } from 'react'
import { getEntries, deleteEntry } from '../lib/journal'
import { TriageBadge } from './TriageBadge'
import type { MoodEntry } from '../lib/types'

const triageEmoji: Record<string, string> = {
  low: '🟢', moderate: '🔵', high: '🟠', crisis: '🔴'
}

export function MoodJournal() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  useEffect(() => { setEntries(getEntries()) }, [])

  const handleDelete = (id: string) => { deleteEntry(id); setEntries(getEntries()) }

  if (entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>📔</p>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: 6 }}>
          No entries yet
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
          Your mood history will appear here after your first check-in.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className="animate-fade-up"
          style={{
            animationDelay: `${i * 60}ms`,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18,
            padding: '16px 18px',
            backdropFilter: 'blur(20px)',
            position: 'relative',
          }}
        >
          {/* Top row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{triageEmoji[entry.triageLevel]}</span>
              <TriageBadge level={entry.triageLevel} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 11, color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-display)',
              }}>
                {entry.date}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.15)',
                  borderRadius: 8, padding: '3px 7px',
                  color: 'rgba(248,113,113,0.6)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.15)'
                  e.currentTarget.style.color = '#f87171'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.08)'
                  e.currentTarget.style.color = 'rgba(248,113,113,0.6)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />

          {/* Note */}
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            fontWeight: 300,
            wordBreak: 'break-word',
          }}>
            {entry.note}
          </p>
        </div>
      ))}
    </div>
  )
}