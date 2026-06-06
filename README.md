# DepositTrack

Protect security deposits with verified photo evidence. Mobile-first inspection
app (iOS / Android / Web) built with **Expo SDK 55 + Firebase + TypeScript**.

See [SPEC.md](SPEC.md) for the full product specification.

## Stack

- **Expo SDK 55** (React Native 0.83, React 19) — runs on iOS, Android, and web
- **Firebase** — Authentication (Email / Google / Apple), Firestore, Storage
- **React Navigation** v7 (native-stack + bottom-tabs)
- **EAS** for builds and submissions

## Prerequisites

- Node 20+ and npm
- A Firebase project with **Authentication**, **Firestore**, and **Storage** enabled
- (For builds) an Expo account + EAS CLI: `npm i -g eas-cli`

## Setup (PowerShell)

```powershell
# 1. Install dependencies
npm install

# 2. Create your env file and fill in Firebase + Google values
Copy-Item .env.example .env
notepad .env

# 3. Start the dev server
npm run start        # then press i / a / w for iOS, Android, web
```

### Environment variables

All client config lives in `.env` (see `.env.example`). Values prefixed
`EXPO_PUBLIC_` are bundled into the app. Fill in:

- `EXPO_PUBLIC_FIREBASE_*` — from Firebase console → Project settings → Your apps
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — required for Google sign-in on every platform
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_EAS_PROJECT_ID` — from `eas init`
- `APPLE_TEAM_ID` — for native iOS builds (not bundled into JS)

## Authentication

| Method | Implementation |
|--------|----------------|
| Email / password | `firebase/auth` (`AuthContext.tsx`) |
| Google | `expo-auth-session` → Firebase `signInWithCredential` (`useGoogleSignIn.ts`) |
| Apple | `expo-apple-authentication` → Firebase OAuth provider (iOS only) |

Enable each provider in **Firebase console → Authentication → Sign-in method**.
For Apple, also enable "Sign In with Apple" capability (handled by
`usesAppleSignIn: true` in `app.config.js` during prebuild).

## Firebase security rules

```powershell
firebase deploy --only firestore:rules,storage    # requires firebase-tools + login
```

Rules live in `firestore.rules` and `storage.rules`. Photos are namespaced under
`inspections/{inspectionId}/...`; audit entries are append-only.

## EAS builds

```powershell
eas login
eas init                      # writes the project ID
eas build --profile development --platform ios
eas build --profile preview   --platform android
eas build --profile production --platform all
```

Build profiles are defined in `eas.json`. Set secrets (e.g. `APPLE_TEAM_ID`) with
`eas secret:create` or in the EAS dashboard rather than committing them.

## Project structure

```
app.config.js            Dynamic Expo config (env-driven, EAS-ready)
eas.json                 EAS build/submit profiles
index.ts / App.tsx       Entry + providers
src/
  lib/firebase.ts        Firebase init (auth persistence, firestore, storage)
  lib/ids.ts             Offline-safe id generation
  types/models.ts        Domain model (mirrors SPEC.md)
  auth/                  AuthContext + Google sign-in hook
  services/
    photos.ts            Photo + signature upload to Firebase Storage
    leaseSummary.ts      Move-In Summary derivation + pre-lease reminders
  navigation/            Root navigator (auth gate + tabs)
  screens/               SignIn, Dashboard, Move-In Summary
  theme.ts               Design tokens
firestore.rules / storage.rules
```

## Status

This is the V1 foundation: auth, Firebase wiring, the data model, and a working
Move-In Summary screen (with derived lease-end + pre-lease reminder preview).
Inspection capture flow, offline sync, PDF reports, calendar, and notifications
are specified in `SPEC.md` and built on top of these models.
