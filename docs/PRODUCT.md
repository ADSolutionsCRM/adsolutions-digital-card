# ADSolutions Digital Card — Product Foundation

## Product goal

Turn the original Andreas digital business card into a reusable ADSolutions product where individuals and companies can create, manage and share branded digital cards.

## V1 foundation

- Browser-based card builder
- Live branded preview
- Name, role, company and contact details
- Photo and logo upload preview
- Email, website, Instagram, LinkedIn, WhatsApp and call actions
- Exportable customer profile JSON
- Apple Wallet and Google Wallet placeholders
- Responsive mobile layout

## Planned product architecture

### Phase 1 — Card Builder
Static prototype and profile format.

### Phase 2 — Accounts
Authentication, customer dashboard, saved cards, unique public URLs.

### Phase 3 — Commercial
One-time purchase and/or recurring subscriptions, plan limits, billing status and admin controls.

### Phase 4 — Wallet
Apple PassKit generation after ADSolutions Apple Developer approval. Google Wallet Generic Pass generation through a Google Wallet issuer account.

### Phase 5 — Business Teams
Company workspace, multiple employees, shared brand kit, bulk card creation, employee lifecycle and centralized updates.

### Phase 6 — Analytics
Views, saves, contact actions, QR/NFC scans and campaign/source attribution.

## Proposed public structure

- card.adsolutionsglobal.com
- card.adsolutionsglobal.com/{slug}
- app.adsolutionsglobal.com/cards
- API routes for pass generation and profile updates

## Security principles

- Never commit Apple signing certificates, private keys or Google service-account keys.
- Store signing materials only in protected secret storage.
- Validate uploaded images and profile input.
- Use server-side authorization for card editing and Wallet generation.
- Separate public card data from private billing/account data.
