# Prep & Profit Pilot — Phase 1 starter

This is a clean rebuild starter for the restaurant app. It is **not** a full replacement yet; it is the first development handoff with:

- modular React + TypeScript structure
- Phase 1 screen skeletons
- POS, kitchen, bar, WiFi, inventory, production, customer, reports and setup views
- sample data models for shared-stock, weight-based sales and WiFi as a business unit
- service worker shell for basic offline tolerance

## What is intentionally included now
- POS shell with order summary and category/product grid
- weight-item preview flow
- kitchen and bar queues with change markers
- WiFi business unit screen with voucher history
- inventory screen with barcode-first workflow entry points
- production batch screen
- customer rewards screen
- reporting dashboard
- setup/import screen

## What is not done yet
- backend integration
- authentication
- persistent sync queue
- real barcode scanning
- real payment workflow
- real order mutation logic
- real inventory/recipe deduction engine
- CSV import/export implementation

## Local run
```bash
npm install
npm run dev
```

## Build intent
This starter is designed to preserve the business requirements from the old single-file app while replacing the old architecture.
