# Siksha Web (MVP UI)

Mobile-first Next.js frontend using shadcn/ui. Stitch screens in `../design/stitch` are visual reference only — layouts follow industry mobile patterns with shared components.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Role → OTP → Parent or Teacher home.

## Structure

- `src/components/ui` — shadcn primitives
- `src/components/typography.tsx` — shared text component
- `src/components/layout` — mobile shell, header, bottom nav
- `src/components/domain` — reusable product cards/badges/chat
- `src/hooks/use-debounced-value.ts` — search debounce
- `src/lib/mock-data.ts` — Farrukhabad demo data
