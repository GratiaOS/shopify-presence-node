import React from 'react';
import IdentityPage from './pages/IdentityPage';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
      }}
    >
      <main style={{ flex: 1 }}>
        <IdentityPage />
      </main>
      <footer
        style={{
          fontSize: 11,
          padding: '8px 16px',
          borderTop: '1px solid #e5e7eb',
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Shopify Presence Node · v0.1.0</span>
        <a
          href="/admin/docs/presence-node-for-merchants.md"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#2563eb' }}
        >
          Help →
        </a>
      </footer>
    </div>
  );
}
