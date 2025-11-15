import { useState } from 'react';

export function ConversationPreview() {
  const [mode, setMode] = useState<'support' | 'merchant-codex'>('support');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const payload = mode === 'support' ? { customerMessage: message, channel: 'chat' } : { prompt: message };
    const res = await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: 'demo-shop', mode, payload }),
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h2>Conversation Preview</h2>
      <select value={mode} onChange={(e) => setMode(e.target.value as 'support' | 'merchant-codex')}>
        <option value="support">Support-mode</option>
        <option value="merchant-codex">Merchant-Codex-mode</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} cols={60} />
      <button type="button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
