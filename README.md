# Restaurant Ops Phase 1 Engine

Deployable Vite starter that implements a working Phase 1 operational backbone:
- stock movement ledger
- POS draft/send/edit/cancel flow
- recipe-driven stock deduction
- production batch posting
- stock take adjustment posting
- receiving
- basic reports

## Run locally
npm install
npm run dev

## Build
npm run build

## Deploy to Vercel
- Import the folder/repo as a Vite project
- Build command: npm run build
- Output directory: dist

## Current limits
This is a focused Phase 1 engine starter, not your full final production app. It is intended for deployment and functional testing of the core stock logic.
