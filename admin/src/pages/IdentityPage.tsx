import React, { useEffect, useState } from 'react';
import type { IdentityLayer } from '../types';
import { api } from '../lib/api';
import { Page } from '../garden-ui/Page';
import { Card } from '../garden-ui/Card';
import { Section } from '../garden-ui/Section';
import { Field, TextInput, TextArea } from '../garden-ui/Field';
import { Button } from '../garden-ui/Button';

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
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState('How long does shipping to France usually take?');
  const [testReply, setTestReply] = useState('');
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
    const payload: IdentityLayer = { ...identity, updatedAt: new Date().toISOString() };
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
          customerMessage: testMessage,
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
    return (
      <Page title="Shopify Presence Node" subtitle="Configure identity and test replies in your Garden voice.">
        <Card>
          <p>Loading…</p>
        </Card>
      </Page>
    );
  }

  if (!identity) {
    return (
      <Page title="Shopify Presence Node" subtitle="Configure identity and test replies in your Garden voice.">
        <Card title="Unable to load identity">
          <p>We couldn\'t load this shop\'s Identity Layer.</p>
          {error && <p style={{ color: '#f87171' }}>{error}</p>}
        </Card>
      </Page>
    );
  }

  return (
    <Page
      title="Shopify Presence Node"
      subtitle="Configure identity and test replies in your Garden voice."
      rightSlot={
        <Button
          variant="ghost"
          type="button"
          onClick={() => window.open('/admin/docs/presence-node-for-merchants.md', '_blank', 'noopener,noreferrer')}
        >
          Help: Presence Node →
        </Button>
      }
    >
      {error && (
        <Card>
          <p style={{ color: '#f87171', margin: 0 }}>Error: {error}</p>
        </Card>
      )}
      {isNew && (
        <Card>
          <strong>New identity detected.</strong> Update the defaults and save to personalize this Presence Node.
        </Card>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1fr)',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <Card
          title="Identity"
          description="Tone, rituals, and guardrails for this shop."
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--g-text-quiet)' }}>
                Last updated {new Date(identity.updatedAt).toLocaleString()}
              </span>
              <Button onClick={saveIdentity} disabled={saving} style={{ minWidth: 140 }}>
                {saving ? 'Saving…' : 'Save identity'}
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Section title="Tone">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                <Field label="Style">
                  <TextInput value={identity.tone.style} onChange={(event) => updateField('tone.style', event.target.value)} />
                </Field>
                <Field label="Formality">
                  <TextInput value={identity.tone.formality} onChange={(event) => updateField('tone.formality', event.target.value)} />
                </Field>
                <Field label="Length">
                  <TextInput value={identity.tone.length} onChange={(event) => updateField('tone.length', event.target.value)} />
                </Field>
              </div>
            </Section>

            <Section title="Rituals" description="Greeting, closing, and fallback response.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Greeting">
                  <TextInput value={identity.rituals.greeting ?? ''} onChange={(event) => updateField('rituals.greeting', event.target.value)} />
                </Field>
                <Field label="Closing">
                  <TextInput value={identity.rituals.closing ?? ''} onChange={(event) => updateField('rituals.closing', event.target.value)} />
                </Field>
                <Field label="Fallback">
                  <TextInput value={identity.rituals.fallback ?? ''} onChange={(event) => updateField('rituals.fallback', event.target.value)} />
                </Field>
              </div>
            </Section>

            <Section title="Policies">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Shipping">
                  <TextArea value={identity.policies.shipping ?? ''} onChange={(event) => updateField('policies.shipping', event.target.value)} />
                </Field>
                <Field label="Refund">
                  <TextArea value={identity.policies.refund ?? ''} onChange={(event) => updateField('policies.refund', event.target.value)} />
                </Field>
                <Field label="Support hours">
                  <TextInput
                    value={identity.policies.customer_support_hours ?? ''}
                    onChange={(event) => updateField('policies.customer_support_hours', event.target.value)}
                  />
                </Field>
              </div>
            </Section>
          </div>
        </Card>

        <Card
          title="Test Support reply"
          description="Run a sample customer question through Support-mode."
          footer={
            <Button onClick={runTest} disabled={testing} style={{ minWidth: 120 }}>
              {testing ? 'Testing…' : 'Run test'}
            </Button>
          }
        >
          <Section title="Customer message">
            <TextArea value={testMessage} onChange={(event) => setTestMessage(event.target.value)} rows={4} />
          </Section>
          {testReply && (
            <Section title="Reply" description="Raw output shaped by Identity + Support-mode.">
              <div
                style={{
                  background: 'var(--g-bg-soft)',
                  borderRadius: 'var(--g-radius-md)',
                  padding: 12,
                  border: `1px solid var(--g-border-subtle)`,
                  whiteSpace: 'pre-wrap',
                  fontSize: 13,
                }}
              >
                {testReply}
              </div>
            </Section>
          )}
        </Card>
      </div>
    </Page>
  );
}
