import React, { useState } from 'react';

interface TestSupportProps {
  shopId: string;
}

type SupportResponse = {
  reply: string;
};

export const TestSupport: React.FC<TestSupportProps> = ({ shopId }) => {
  const [message, setMessage] = useState('Hi, how long does shipping to France usually take?');
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setReply(null);

      const res = await fetch('/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shopId,
          mode: 'support',
          payload: {
            customerMessage: message,
            channel: 'chat',
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`respond failed: ${res.status}`);
      }

      const data = (await res.json()) as SupportResponse;
      setReply(data.reply);
    } catch (err) {
      console.error('[Admin] support test error', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 style={{ marginBottom: 8 }}>Test Support-mode</h2>
      <p style={{ marginTop: 0, color: '#555' }}>Send a sample customer question through your configured Presence Node.</p>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={{ width: '100%', minHeight: 90, padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={runTest}
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Asking…' : 'Send test message'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#c00', marginTop: 12 }}>
          Error: {error}
        </p>
      )}

      {reply && (
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: '#f8f8f8',
            borderRadius: 4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {reply}
        </pre>
      )}
    </section>
  );
};
