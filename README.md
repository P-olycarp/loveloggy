# LoveLoggy — Local Hosting & Production Checklist

This README explains how to host the LoveLoggy static app locally and outlines a short checklist for preparing the app for public hosting.

## Quick local preview

From the project root run a simple static server (Python):

```bash
cd /home/muchuidanson/loveloggy
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

I already started a server for you earlier at that address.

## Files of interest
- `index.html` — login / signup
- `space.html`, `chat.html`, `gallery.html`, `calendar.html`, `journey.html`, `goals.html`, `resolutions.html`, `stats.html`, `profile.html` — app pages
- `manifest.json` — PWA manifest
- `src/auth.js` — authentication & pairing logic (uses `localStorage`) and performs migration from legacy keys
- `src/encryption.js` — client-side encryption helpers
- `clear_data.html` — UI to clear local demo data (use with caution)

## LocalStorage keys used
The app persists data in `localStorage`. Current canonical keys:

- loveloggy_user
- loveloggy_creds
- loveloggy_couple
- loveloggy_invite
- loveloggy_chat
- loveloggy_events
- loveloggy_entries
- loveloggy_goals
- loveloggy_gallery
- loveloggy_dates
- loveloggy_resolutions
- loveloggy_prefs
- loveloggy_theme
- loveloggy_settings

There is also migration logic in `src/auth.js` that will move older `lovelogg_*` keys to the normalized keys on load.

## Production checklist (recommended)
1. Replace client-side auth with a proper server-side auth and storage. The current `src/auth.js` is localStorage-based and suitable only for demo/local usage.
2. Replace demo XOR encryption with a proven server-backed E2EE setup if you plan to store messages on a server. The `src/encryption.js` contains a simple implementation; consider integrating Web Crypto / AES-GCM with a server-managed key exchange.
3. Add HTTPS and proper Content Security Policy headers on your hosting platform.
4. Run a security review for any user-uploaded content (validate/resize images on the server, sanitize inputs, scan for large payloads).
5. Add tests and a CI build (lint, unit tests) before deployment.
6. If you intend to host publicly, move user credential storage off localStorage and into an authenticated backend.

## How I prepared this repository for hosting
- Replaced demo placeholders and placeholder image URLs.
- Normalized `localStorage` keys to `loveloggy_*` and added migration for older `lovelogg_*` keys.
- Added `clear_data.html` to allow explicit clearing of all local demo data.
- Removed the `event_demo.html` demo page.
- Standardized profile picture variable names to `window.loveloggy_profile_pic` and `window._loveloggy_profile_pic`.

## How to deploy
- For a static-only deployment (no server-side auth): you can upload the project root to any static hosting provider (GitHub Pages, Netlify, Vercel, S3 + CloudFront). Ensure HTTPS is enabled.
- For production-ready app with real users and backups, run behind a proper backend which handles account creation and secure storage.

## Docker / single-container deployment (quick)
This repository can be run as a single container: the Express server (in `/server`) will serve the JSON API under `/api` and will also serve the frontend static files from the project root when they are present.

Build and run locally with Docker:

```bash
# Build the image (from project root)
docker build -t loveloggy:latest .

# Run the container (exposes API + frontend on port 3000)
docker run --rm -p 3000:3000 -v "$(pwd)/server/db.json:/app/server/db.json" loveloggy:latest
```

Or use docker-compose:

```bash
docker-compose up --build
```

Then open http://localhost:3000 to access the app (or visit `/api/health` for health check).

Security note: this demo stores a JSON DB on disk (`server/db.json`) and places ECDH private JWKs in `localStorage` for convenience. For production hosting you must migrate to a proper database, secure server-side key storage, and HTTPS.

## Next steps I can take
- Create a minimal server (Express) to host the pages and provide a JSON API for auth/storage (helps move away from localStorage).
- Add CI and linting (ESLint) and run a build step.
- Replace the demo encryption with AES-GCM using the Web Crypto API fully and provide a server-assisted key exchange.

If you want me to proceed with any of the production steps above, tell me which one and I'll start implementing it.
