import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 500 }}>{label}</span>
        {hint && (
          <span
            style={{
              fontSize: 12,
              color: 'var(--g-text-quiet)',
            }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

const baseInput: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 'var(--g-radius-sm)',
  border: `1px solid var(--g-border-subtle)`,
  background: 'var(--g-bg-soft)',
  color: 'var(--g-text-main)',
  fontSize: 13,
  outline: 'none',
  transition: `border-color var(--g-transition-fast), box-shadow var(--g-transition-fast)`,
};

function applyFocusStyles(el: HTMLInputElement | HTMLTextAreaElement, active: boolean) {
  if (active) {
    el.style.borderColor = 'var(--g-accent-strong)';
    el.style.boxShadow = '0 0 0 1px rgba(52,211,153,0.55)';
  } else {
    el.style.borderColor = 'var(--g-border-subtle)';
    el.style.boxShadow = 'none';
  }
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...baseInput, ...(props.style || {}) }}
      onFocus={(event) => {
        props.onFocus?.(event);
        applyFocusStyles(event.currentTarget, true);
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        applyFocusStyles(event.currentTarget, false);
      }}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...baseInput, minHeight: 80, resize: 'vertical', ...(props.style || {}) }}
      onFocus={(event) => {
        props.onFocus?.(event);
        applyFocusStyles(event.currentTarget, true);
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        applyFocusStyles(event.currentTarget, false);
      }}
    />
  );
}
