# Aivora

AI that works at the speed of your ideas — a multi-page AI SaaS marketing site + authenticated dashboard, built with React, React Router, and Tailwind CSS.

There's also a native mobile app (iOS/Android) in [`mobile/`](mobile/README.md) that talks to this same backend — same account, same conversations, same everything.

## Getting started

```bash
npm install
cp .env.example .env
# edit .env and paste your Gemini API key (from aistudio.google.com -> "Get API key")
npm run dev:all
```

`npm run dev:all` starts both the Vite frontend and the Express API server together.
Then open the printed local URL (typically http://localhost:5173) and go to
**Dashboard → AI Chat** to talk to the real model.

Running just the frontend (`npm run dev`) without the API server (`npm run server`)
will still work for browsing the site, but the chat page will show an error until
both are running and `GEMINI_API_KEY` is set.

## Build

```bash
npm run build
npm run preview
```

The production build only contains the static frontend — you still need to run
`npm run server` (with `GEMINI_API_KEY` set) somewhere reachable at `/api/*`
for the chat to work in production, e.g. behind the same reverse proxy or on a
separate host with `VITE_API_URL` wired up.

## Structure

- `src/pages` — public routes (home, features, solutions, pricing, about, blog, contact, auth)
- `src/pages/dashboard` — authenticated dashboard routes (overview, chat, history, files, usage, settings)
- `src/components/layout` — navbar, footer, main layout, auth layout
- `src/components/dashboard` — sidebar, dashboard header, dashboard layout
- `src/components/chat` — chat message, chat input, typing indicator, markdown renderer
- `src/components/ui` — reusable design-system components (Button, Card, Modal, Input, etc.)
- `src/data` — realistic mock/demo data for features, pricing, blog, dashboard
- `src/context` — theme (dark/light), toast, and auth providers
- `server/` — Express API: AI chat proxy, session-based auth (Google/GitHub OAuth
  + email/password), password reset emails, and the Postgres database layer

## Notes

- The AI chat (`/dashboard/chat`) calls a real Gemini model (`gemini-3.6-flash`)
  through a small Express proxy (`server/index.js`) so the API key never reaches
  the browser. Frontend calls go to `/api/chat` (`src/data/aiClient.js`), which
  Vite proxies to `http://localhost:3001` in dev.
- Auth is real: `/login` and `/signup` create actual accounts (bcrypt-hashed
  passwords) stored in a Postgres database (`DATABASE_URL`, e.g. from Neon),
  plus working Google and GitHub OAuth. `/dashboard/*` routes are protected —
  visiting them while logged out redirects to `/login`.
- `/forgot-password` sends a real email via Resend when `RESEND_API_KEY` is
  set; otherwise it falls back to showing the reset link directly in the UI
  for local testing (dev-only behavior).

## Deploying (free, no trial, no credit card)

This app is built to deploy as a **single service**: `server/index.js` serves
both the built frontend and the `/api/*` routes, so you only need one host.

**1. Database — Neon (free Postgres, no card)**
- Sign up at neon.tech, create a project, copy the pooled connection string.

**2. Push the code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
```
Create a new repo on github.com, then follow its "push an existing repo" instructions.

**3. Host — Render (free web service, no card)**
- New → Web Service → connect your GitHub repo
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Add all the same environment variables from your `.env` file, with two changes:
  - `CLIENT_URL` and `API_URL` → your Render URL (e.g. `https://aivora.onrender.com`) — **both** point to the same URL, since one service serves everything
  - `NODE_ENV=production`
- Update the **Google** and **GitHub** OAuth app redirect URIs to
  `https://<your-render-url>/api/auth/google/callback` and `.../github/callback`

Note: Render's free tier spins the service down after ~15 minutes of no traffic
and takes ~30–60 seconds to wake back up on the next request — normal for free
tier, not a bug.
