import type { ReactNode } from 'react';

interface PageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function Page({ title, subtitle, children, rightSlot }: PageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 36px 40px',
        background: 'radial-gradient(circle at top left, #020617 0, #020617 45%, #020617 100%)',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  color: 'var(--g-text-soft)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {rightSlot && <div>{rightSlot}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}
