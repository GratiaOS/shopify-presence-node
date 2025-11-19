import React, { useEffect, useState } from 'react';
import type { IdentityLayer } from '../types';
import { api } from '../lib/api';

type IdentityResponse = {
  identity: IdentityLayer;
  isNew: boolean;
};

type RespondOutput = {
  reply: string;
};

export default function IdentityPage() {
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<IdentityLayer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [testReply, setTestReply] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get<IdentityResponse>('/identity')
      .then((res) => {
        if (!mounted) return;
        setIdentity(res.identity);
        setIsNew(res.isNew);
      })
      .catch((err) => {
        console.error('[admin] failed to load identity', err);
        setError(err instanceof Error ? err.message : 'Failed to load identity');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (path: string, value: string) => {
    setIdentity((prev) => {
      if (!prev) return prev;
      const clone: IdentityLayer = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let ref: Record<string, unknown> = clone as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i += 1) {
        const key = parts[i];
        ref[key] = { ...(ref[key] as Record<string, unknown>) };
        ref = ref[key] as Record<string, unknown>;
      }
      ref[parts.at(-1) as string] = value;
      return clone;
    });
  };

  const saveIdentity = async () => {
    if (!identity) return;
    setSaving(true);
    setError(null);
    const payload: IdentityLayer = {
      ...identity,
      updatedAt: new Date().toISOString(),
    };
    try {
      await api.post('/configure/identity', payload);
      setIdentity(payload);
      setIsNew(false);
    } catch (err) {
      console.error('[admin] save identity failed', err);
      setError(err instanceof Error ? err.message : 'Failed to save identity');
    } finally {
      setSaving(false);
    }
  };

  const runTest = async () => {
    if (!identity) return;
    setTesting(true);
    setTestReply('');
    setError(null);
    try {
      const res = await api.post<RespondOutput>('/respond', {
        shopId: identity.shopId,
        mode: 'support',
        payload: {
          channel: 'chat',
          customerMessage: 'How long does shipping to France usually take?',
        },
      });
      setTestReply(res.reply);
    } catch (err) {
      console.error('[admin] test support failed', err);
      setError(err instanceof Error ? err.message : 'Support test failed');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!identity) {
    return (
      <div style={{ padding: 24 }}>
        <p>Unable to load identity.</p>
        {error && <p style={{ color: '#b00' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Identity Layer</h1>
      <p style={{ color: '#555' }}>Configure tone, rituals, and guardrails for this shop.</p>

      {isNew && (
        <div
          style={{
            padding: 12,
            background: '#fffae8',
            border: '1px solid #ead188',
            borderRadius: 8,
            margin: '16px 0',
          }}
        >
          <strong>New identity detected.</strong> Update the defaults and save to personalize.
        </div>
      )}

      {error && (
        <div style={{ margin: '12px 0', color: '#b00' }}>
          Error: {error}
        </div>
      )}

      <section style={{ marginTop: 20 }}>
        <h2>Tone</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Style
          <input
            value={identity.tone.style}
            onChange={(event) => updateField('tone.style', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Formality
          <input
            value={identity.tone.formality}
            onChange={(event) => updateField('tone.formality', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Length
          <input
            value={identity.tone.length}
            onChange={(event) => updateField('tone.length', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Rituals</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Greeting
          <input
            value={identity.rituals.greeting ?? ''}
            onChange={(event) => updateField('rituals.greeting', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Closing
          <input
            value={identity.rituals.closing ?? ''}
            onChange={(event) => updateField('rituals.closing', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Fallback
          <input
            value={identity.rituals.fallback ?? ''}
            onChange={(event) => updateField('rituals.fallback', event.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
      </section>

      <button
        type="button"
        onClick={saveIdentity}
        disabled={saving}
        style={{
          marginTop: 24,
          padding: '10px 16px',
          borderRadius: 4,
          border: 'none',
          background: saving ? '#999' : '#111',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {saving ? 'Saving…' : 'Save Identity'}
      </button>

      <hr style={{ margin: '40px 0' }} />

      <section>
        <h2>Test Support Mode</h2>
        <p style={{ color: '#555' }}>Run the active identity through Support-mode.</p>
        <button
          type="button"
          onClick={runTest}
          disabled={testing}
          style={{
            padding: '10px 16px',
            borderRadius: 4,
            border: 'none',
            background: testing ? '#999' : '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {testing ? 'Testing…' : 'Run test'}
        </button>
        {testReply && (
          <pre
            style={{
              background: '#f6f6f6',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              whiteSpace: 'pre-wrap',
            }}
          >
            {testReply}
          </pre>
        )}
      </section>
    </div>
  );
}
