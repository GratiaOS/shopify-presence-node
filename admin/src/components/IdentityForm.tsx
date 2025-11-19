import React, { useEffect, useState } from 'react';
import type { IdentityLayer } from '../types';

interface IdentityFormProps {
  identity: IdentityLayer;
  isNew: boolean;
  onSave: (identity: IdentityLayer) => Promise<void> | void;
}

export const IdentityForm: React.FC<IdentityFormProps> = ({ identity, onSave, isNew }) => {
  const [localIdentity, setLocalIdentity] = useState<IdentityLayer>(identity);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalIdentity(identity);
  }, [identity]);

  const updateField = (path: string, value: string) => {
    setLocalIdentity((prev) => {
      const segments = path.split('.');
      const clone: any = JSON.parse(JSON.stringify(prev)) as IdentityLayer;
      let cursor = clone;
      for (let i = 0; i < segments.length - 1; i += 1) {
        cursor = cursor[segments[i]];
      }
      cursor[segments.at(-1)!] = value;
      return clone;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(localIdentity);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0 }}>Identity</h2>
        <p style={{ margin: '4px 0', color: '#555' }}>
          {isNew ? 'No stored identity yet — using defaults.' : `Last updated: ${new Date(localIdentity.updatedAt).toLocaleString()}`}
        </p>
      </div>

      <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <legend>Tone</legend>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ flex: 1, minWidth: 180 }}>
            Style
            <input
              type="text"
              value={localIdentity.tone.style}
              onChange={(event) => updateField('tone.style', event.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          <label style={{ flex: 1, minWidth: 180 }}>
            Formality
            <input
              type="text"
              value={localIdentity.tone.formality}
              onChange={(event) => updateField('tone.formality', event.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          <label style={{ flex: 1, minWidth: 180 }}>
            Length
            <input
              type="text"
              value={localIdentity.tone.length}
              onChange={(event) => updateField('tone.length', event.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <legend>Rituals</legend>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Greeting
          <input
            type="text"
            value={localIdentity.rituals.greeting ?? ''}
            onChange={(event) => updateField('rituals.greeting', event.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Closing
          <input
            type="text"
            value={localIdentity.rituals.closing ?? ''}
            onChange={(event) => updateField('rituals.closing', event.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 0 }}>
          Fallback
          <textarea
            value={localIdentity.rituals.fallback ?? ''}
            onChange={(event) => updateField('rituals.fallback', event.target.value)}
            style={{ width: '100%', padding: 8, minHeight: 72 }}
          />
        </label>
      </fieldset>

      <fieldset style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <legend>Policies</legend>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Refund
          <input
            type="text"
            value={localIdentity.policies.refund ?? ''}
            onChange={(event) => updateField('policies.refund', event.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Shipping
          <input
            type="text"
            value={localIdentity.policies.shipping ?? ''}
            onChange={(event) => updateField('policies.shipping', event.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 0 }}>
          Support hours
          <input
            type="text"
            value={localIdentity.policies.customer_support_hours ?? ''}
            onChange={(event) => updateField('policies.customer_support_hours', event.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={saving}
        style={{
          alignSelf: 'flex-start',
          padding: '10px 16px',
          borderRadius: 4,
          border: 'none',
          background: '#0a0a0a',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {saving ? 'Saving…' : 'Save identity'}
      </button>
    </form>
  );
};
