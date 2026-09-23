# Aivora Mobile

The native iOS/Android app for Aivora — same account, same conversations,
same backend as the website. Built with Expo + React Native + Expo Router.

This app has **no backend of its own** — it's a client for the same API
that powers the website (`../server`). Log in with the same account you
use on the web and everything (conversations, files, usage, settings) is
already there.

## Run it on your phone (no Mac/Xcode or Android Studio needed)

1. Install the **Expo Go** app from the App Store or Google Play.
2. On this machine:
   ```bash
   cd mobile
   npm install
   cp .env.example .env
   npx expo start
   ```
3. Scan the QR code Expo prints with your phone's camera (iOS) or the
   Expo Go app (Android). The app opens live on your phone.

Changes you make to the code hot-reload on the phone automatically while
`npx expo start` is running.

## Screens

- **Auth**: Login (with 2FA challenge), Signup, Forgot Password
- **Dashboard** (bottom tabs): Home, AI Chat, History, Files, Usage, Settings
  - Chat supports photos, videos, PDFs, and Word docs — same real Gemini
    analysis as the website
  - Settings includes real password change and real TOTP two-factor setup
    (scan the QR code with any authenticator app)

## Known gap: Google/GitHub sign-in

Email/password login (including 2FA) is fully wired and real. Google and
GitHub sign-in are **not yet available in the app** — OAuth on native apps
needs a different redirect flow (an in-app browser + deep link back into
the app) than the browser-based one the website uses, and that hasn't been
built yet. Use email/password to log in on mobile for now.

## Configuration

`EXPO_PUBLIC_API_URL` in `.env` controls which backend the app talks to.
Defaults to the deployed Render backend. To test against a local backend
running on your computer, set it to your computer's LAN IP address (find
it with `ipconfig getifaddr en0` on Mac) — your phone can't reach
`localhost` on your computer.

## Building a real installable app (no local Xcode/Android Studio)

```bash
npx eas-cli@latest build --platform ios      # or --platform android
```

This builds in the cloud via Expo's EAS service and gives you a real
`.ipa`/`.apk` you can install or submit to the App Store / Play Store.
Requires a free Expo account.
