import type { Assessment } from '../lib/types'
import { TriageBadge } from './TriageBadge'
import { ResourceCard } from './ResourceCard'
import { getResourcesByTimezone } from '../data/resources'

interface Props { assessment: Assessment; onContinue: () => void }

const GlassCard = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 20, padding: 20, backdropFilter: 'blur(20px)', ...style,
  }}>
    {children}
  </div>
)

export function AssessmentPanel({ assessment, onContinue }: Props) {
  const resources = getResourcesByTimezone()
  const isCrisis = assessment.triageLevel === 'crisis'

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {isCrisis && (
        <div style={{
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 20, padding: 20,
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#f87171', marginBottom: 6 }}>
            You are not alone.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(248,113,113,0.8)', marginBottom: 14, lineHeight: 1.6 }}>
            Please reach out to a crisis line right now. Someone is ready to listen.
          </p>
          <a href={`tel:${resources.emergency}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)',
            color: '#f87171', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 14, padding: '10px 20px',
            borderRadius: 12, textDecoration: 'none',
          }}>
            🚨 Call {resources.emergency} now
          </a>
        </div>
      )}

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            What I heard
          </p>
          <TriageBadge level={assessment.triageLevel} />
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, fontWeight: 300 }}>
          {assessment.summary}
        </p>
      </GlassCard>

      {assessment.patterns.length > 0 && (
        <GlassCard>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Patterns I noticed
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {assessment.patterns.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: 'var(--green)', marginTop: 2, fontSize: 10 }}>◆</span>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 300 }}>{p}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {assessment.strategies.length > 0 && (
        <div style={{
          background: 'rgba(74,210,149,0.06)', border: '1px solid rgba(74,210,149,0.15)',
          borderRadius: 20, padding: 20,
        }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Things that can help right now
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {assessment.strategies.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: 'var(--green)', marginTop: 2 }}>✦</span>
                <p style={{ fontSize: 13, color: 'rgba(74,210,149,0.85)', lineHeight: 1.65, fontWeight: 300 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <GlassCard style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 22, marginBottom: 10 }}>💬</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7, fontWeight: 300 }}>
          "{assessment.affirmation}"
        </p>
      </GlassCard>

      <ResourceCard resources={resources} />

      <button
        onClick={onContinue}
        style={{
          width: '100%', padding: '15px',
          background: 'linear-gradient(135deg, #4ad295, #38a169)',
          border: 'none', borderRadius: 16,
          color: '#fff', fontFamily: 'var(--font-display)',
          fontWeight: 600, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(74,210,149,0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(74,210,149,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(74,210,149,0.3)'
        }}
      >
        Keep talking →
      </button>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
        Solace is an AI companion, not a therapist. In an emergency, call {resources.emergency}.
      </p>
    </div>
  )
}