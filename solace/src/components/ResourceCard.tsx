import type { CountryResources } from '../data/resources'

export function ResourceCard({
  resources,
}: {
  resources: CountryResources
}) {
  const typeIcon = (type: string) =>
    (
      {
        hotline: '📞',
        text: '💬',
        chat: '🌐',
        app: '📱',
      }[type] ?? '📱'
    )

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 20,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 26 }}>
            {resources.flag}
          </span>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text-primary)',
              }}
            >
              {resources.country}
            </p>

            <p
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            >
              Auto-detected from your location
            </p>
          </div>
        </div>

        <a
          href={`tel:${resources.emergency}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: '#f87171',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: 20,
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
          }}
        >
          🚨 {resources.emergency}
        </a>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {resources.resources.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>
                {typeIcon(r.type)}
              </span>

              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.name}
                </p>

                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}
                >
                  {r.available}
                </p>
              </div>
            </div>

            {r.url ? (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--green)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Visit →
              </a>
            ) : (
              <a
                href={`tel:${r.contact.replace(/\s/g, '')}`}
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'var(--green)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.contact}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}