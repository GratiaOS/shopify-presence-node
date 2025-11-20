import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}

export function Button({ children, variant = 'primary', style, ...rest }: ButtonProps) {
  const base: CSSProperties = {
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    padding: '7px 16px',
    cursor: 'pointer',
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'background-color 140ms ease-out, border-color 140ms ease-out, transform 80ms ease-out, box-shadow 140ms ease-out',
  };

  const variants: Record<typeof variant, CSSProperties> = {
    primary: {
      background: 'var(--g-accent)',
      color: '#022c22',
      boxShadow: '0 12px 30px rgba(34,197,94,0.5)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--g-text-soft)',
      borderColor: 'var(--g-border-subtle)',
    },
  };

  return (
    <button
      {...rest}
      style={{ ...base, ...variants[variant], ...(style || {}) }}
      onMouseDown={(event) => {
        rest.onMouseDown?.(event);
        event.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(event) => {
        rest.onMouseUp?.(event);
        event.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );
}
