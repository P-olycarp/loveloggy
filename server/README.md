LoveLoggy Server (demo)
======================

This is a minimal Express-based backend intended for local/demo usage only. It provides endpoints for signup/login, couple creation/joining, public-key registration for ECDH key exchange, and storing ciphertext messages. Data is stored in `server/db.json` as a simple JSON file.

Running locally
---------------

1. Install dependencies:

```bash
cd server
npm install
```

2. Start the server:

```bash
npm start
```

The server listens on port `3000` by default. Endpoints are under `/api`.

Important notes
---------------
- This server is for local testing only. It stores user passwords hashed with bcrypt, but uses a flat JSON file for persistence and lacks production features (rate limiting, input validation, TLS, authentication tokens, etc.).
- Use this to prototype client-server flows (invite codes, key exchange, storing encrypted ciphertext). Do NOT expose it to the public without adding proper security.

API overview
------------
- POST /api/signup — { name,email,password,inviteCode?,startDate? }
- POST /api/login — { email,password }
- POST /api/couple/create — { userId,startDate? }
- POST /api/couple/join — { inviteCode,userId }
- POST /api/keys/register — { coupleId,userId,publicKeyJwk }
- GET  /api/keys/partner/:coupleId/:userId — returns partner's publicKeyJwk
- POST /api/messages — { coupleId,senderId,ciphertext,iv }
- GET  /api/messages/:coupleId — list stored ciphertext messages

Use the `smoke_test.html` in the repo root to run a quick flow locally (requires server running on http://localhost:3000).
