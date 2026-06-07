# DepositTrack — Website

Marketing site for DepositTrack, built with **Next.js (App Router) + TypeScript**.
A separate project from the iOS/React Native app (`../`), sharing the same brand
language (see `app/globals.css`, matched to the app's `src/theme.ts`).

## Develop (PowerShell)

```powershell
cd website
npm install
npm run dev        # http://localhost:3000
```

## Build & run production

```powershell
npm run build
npm run start
```

## Deploy

This repo holds two Node projects (the Expo app at the root, this site in
`website/`), so a deploy must target the `website/` directory.

### Vercel (recommended — supports the upcoming SSR dashboard)

1. Import the GitHub repo at vercel.com.
2. Set **Root Directory** to `website`.
3. Framework preset is auto-detected (Next.js). `vercel.json` pins the commands.
4. Deploy. Add a custom domain (`deposittrack.com`) under Project → Domains.

Or via CLI from this folder:

```powershell
cd website
npx vercel          # preview deploy
npx vercel --prod   # production deploy
```

### Firebase Hosting (alternative)

The marketing page is fully static today, so it can be exported and served from
the same Firebase project as the app:

```powershell
cd website
# Temporarily set `output: "export"` in next.config.mjs, then:
npm run build       # emits ./out
firebase deploy --only hosting
```

A `firebase.json` hosting block pointing `public` at `website/out` is included in
the repo root. NOTE: static export must be removed once the authenticated dashboard
(SSR/auth) lands — at that point use Vercel, or Firebase web frameworks / a Cloud
Run adapter.

## Structure

```
app/
  layout.tsx     Root layout + SEO metadata (Open Graph, Twitter, theme color)
  page.tsx       Homepage: hero, features, differentiators, pricing, CTA, disclaimer
  globals.css    Brand tokens matched to the mobile app
next.config.mjs
```

## Notes

- Update `APP_STORE_URL` in `app/page.tsx` once the App Store listing is live.
- Copy follows SPEC.md §15 (homepage), §12 (pricing), §9 (legal disclaimer).
- Planned web-app features (Inspection Calendar §8, Bulk Upload Intelligence §7)
  would live here as authenticated routes sharing the app's Firebase project.
