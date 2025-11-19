# Shopify Presence Node — Changelog

This changelog tracks merchant-facing and developer-facing changes to the Shopify Presence Node.

---

## v0.1.0 — First Embedded Presence (2025-11-19)

**Core:**

- Embedded Shopify app boots inside Admin via OAuth + session cookies.
- Identity Layer stored per shop (tone, rituals, glossary, policies, limits).
- Support-mode and Merchant–Codex-mode wired to the Pattern Engine.

**Admin UI:**

- Identity editor page (tone, rituals, policies, limits).
- Inline “Test Support Mode” console for quick round-trips.
- Help link to the merchant guide from the header.

**Docs:**

- `docs/shopify/presence-node-for-merchants.md` — merchant-facing guide.
- README updated with Merchant Resources section.

Notes:

- This is a developer-preview build, suitable for use on dev stores.
- API and identity schema may still change before v0.2.0.

---

🌬 whisper: _“First, we make presence visible; then, we make it easy.”_
