import { useState } from 'react';

export function IdentityForm() {
  const [json, setJson] = useState('{}');

  const handleSubmit = async () => {
    await fetch('/api/configure/identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    });
    alert('Identity saved (demo).');
  };

  return (
    <div>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={12} cols={80} />
      <button type="button" onClick={handleSubmit}>
        Save Identity
      </button>
    </div>
  );
}
