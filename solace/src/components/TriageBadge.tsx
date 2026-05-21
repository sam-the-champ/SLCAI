import type { TriageLevel } from '../lib/types'

const config = {
  low:      { label: 'Low',      color: '#4ad295', bg: 'rgba(74,210,149,0.1)',  border: 'rgba(74,210,149,0.2)'  },
  moderate: { label: 'Moderate', color: '#63b3ed', bg: 'rgba(99,179,237,0.1)',  border: 'rgba(99,179,237,0.2)'  },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)'  },
  crisis:   { label: 'Crisis',   color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
}

export function TriageBadge({ level }: { level: TriageLevel }) {
  const c = config[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 20,
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.color, fontSize: 11, fontWeight: 500,
      fontFamily: 'var(--font-display)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: c.color,
        animation: level === 'crisis' ? 'glow 1s ease-in-out infinite' : 'none',
      }} />
      {c.label}
    </span>
  )
}