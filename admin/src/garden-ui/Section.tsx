import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <h3
          style={{
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--g-text-quiet)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: 'var(--g-text-soft)',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
