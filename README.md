# Shopify Presence Node

A Garden Stack–compliant Shopify app that gives every store its own Presence Node:
- powered by a Pattern Engine,
- wrapped in a store-specific Identity Layer,
- running explicit Modes instead of a vague “AI chatbot.”

This repository implements the Shopify Presence Node described in `docs/shopify-presence-node.md`.

## Garden Stack mapping

- **Pattern Engine** – `src/engine/*`
- **Presence Node** – `src/shopify/*`, `src/api/*`, `src/ui-admin/*`
- **Identity Layer** – `src/identity/*`
- **Modes** – `src/modes/*` (Support + Merchant-Codex)
- **Frames** – expressed through docs/UI wording (not stored)

## High-level flow

1. Message arrives (customer or merchant) via Shopify Presence Node.
2. App resolves `shopId` via Shopify auth and loads its Identity Layer.
3. Mode is selected (`support` or `merchant-codex`).
4. Mode builds a structured prompt and calls the Pattern Engine.
5. Engine returns raw content.
6. Identity Layer shapes the result (tone, rituals, templates).
7. Response is returned to customer or merchant UI.

See `docs/shopify-presence-node.md` for the full spec.

## Development

```bash
pnpm install
pnpm dev
```

Configure `.env` from `.env.example` with Shopify + engine keys.
