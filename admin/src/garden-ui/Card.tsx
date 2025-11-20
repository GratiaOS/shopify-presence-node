import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Card({ title, description, children, footer }: CardProps) {
  return (
    <section
      style={{
        background: 'var(--g-bg-elevated)',
        borderRadius: 'var(--g-radius-lg)',
        border: `1px solid var(--g-border-subtle)`,
        boxShadow: 'var(--g-shadow-subtle)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {(title || description) && (
        <header>
          {title && (
            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: description ? 4 : 0,
              }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--g-text-soft)',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer
          style={{
            marginTop: 4,
            paddingTop: 12,
            borderTop: `1px solid rgba(148,163,184,0.25)`,
          }}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}
