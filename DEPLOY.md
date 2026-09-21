# NEXUS — Deployment Guide

This app has two independent pieces that deploy separately:

- **`backend/`** — Node.js + Express + Socket.IO + SQLite/Turso (Sequelize). Needs a host that keeps a long-running process — WebSockets (Socket.IO) don't survive on serverless functions.
- **`frontend/`** — React + Vite, built to static files. Deploys anywhere that serves static assets, including Vercel.

Read **section 0** before picking a host — it's the one thing that will silently break a deploy if skipped.

---

## 0. Database: local SQLite file vs. Turso

The backend supports two interchangeable storage backends, switched by one env var (`backend/src/config/db.js`):

- **Local SQLite file** (default) — `backend/data/nexus.sqlite`. Simplest for local dev, but **needs a persistent disk in production** — serverless/edge platforms (Vercel Functions, Netlify Functions, Cloudflare Workers) wipe the filesystem between invocations, so the database would reset or vanish on every cold start.
- **Turso (libSQL)** — set `TURSO_DATABASE_URL` (and `TURSO_AUTH_TOKEN`) and the backend connects to a hosted Turso database instead, **for local dev and every deployment**, with no local file and no persistent-disk requirement. This is the recommended setup once you have a Turso account — see **section 1a**.

**Turso removes the disk requirement, but not the Socket.IO requirement.** Even with Turso, the backend still needs a host that keeps one long-running Node process — Vercel/Netlify serverless functions cold-start per request and can't hold a live WebSocket connection, so the Command Center's live map/event stream/decision-log updates would break there even though the database itself would now work fine. **Short answer: with Turso, both the frontend *and* the backend's database story work on Vercel — but the backend's real-time layer (Socket.IO) does not, so keep the backend on Render/Railway/Fly.io/a VPS and put only the frontend on Vercel.** All are covered below.

The **frontend** has none of these constraints; it's a static build and can go on Vercel, Netlify, Render Static Site, Cloudflare Pages, or GitHub Pages.

### 0a. Turso setup (recommended)

```bash
# Install the CLI, sign in, and create a database (once)
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create nexus-bihar-flood

# Get the connection URL and an auth token
turso db show nexus-bihar-flood --url
turso db tokens create nexus-bihar-flood
```

Put the URL in `TURSO_DATABASE_URL` and the token in `TURSO_AUTH_TOKEN` — in `backend/.env` for local dev, and as environment variables on whichever host runs the backend in production. You can point local dev and production at the **same** Turso database, or run `turso db create nexus-bihar-flood-dev` for a separate one — either works, nothing else in the app needs to change.

Once `TURSO_DATABASE_URL` is set, run `npm run seed` (locally or via the host's shell) to seed that Turso database — it works exactly like seeding the local file, just over the network.

---

## 1. Environment variables

### Backend (`backend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `PORT` | no | Defaults to `5000`. Most hosts inject their own `PORT` — leave this unset in production and let the platform set it. |
| `NODE_ENV` | recommended | Set to `production`. |
| `TURSO_DATABASE_URL` | recommended | Set this to use Turso instead of a local file — see section 0a. When set, `SQLITE_PATH` is ignored. |
| `TURSO_AUTH_TOKEN` | with `TURSO_DATABASE_URL` | Auth token for the Turso database. |
| `SQLITE_PATH` | only if not using Turso | Path to the local SQLite file, e.g. `/data/nexus.sqlite`. Must point at a persistent volume/disk mount in production, or the database resets on every redeploy. |
| `JWT_SECRET` | **yes** | Long random string. Generate one with `openssl rand -hex 32`. Never reuse the value from `.env.example`. |
| `JWT_EXPIRES_IN` | no | Defaults to `7d`. |
| `GROQ_API_KEY` | no | AI copilot falls back to a deterministic summary if unset. |
| `GEMINI_API_KEY` | no | Evidence-photo analysis is skipped (with a graceful message) if unset. |
| `CLIENT_URL` | **yes** | The deployed **frontend** origin, e.g. `https://nexus.example.com`. Used for both CORS and the Socket.IO CORS origin — get this wrong and you'll see the exact `ERR_CONNECTION_REFUSED` / CORS console errors this app is prone to if misconfigured. |

### Frontend (`frontend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | **yes** | The deployed **backend** URL + `/api`, e.g. `https://nexus-api.example.com/api`. |
| `VITE_SOCKET_URL` | **yes** | The deployed backend URL (no `/api`), e.g. `https://nexus-api.example.com`. |
| `VITE_MAP_API_KEY` | no | Unused by the current Leaflet/OpenStreetMap setup; leave blank. |

Vite inlines `VITE_*` variables **at build time** — you must set them in the host's build environment before running `npm run build`, not just at runtime.

---

## 2. Option A — Render (recommended, simplest)

**Backend — Web Service:**
1. New → Web Service → connect the repo, root directory `backend`.
2. Build command: `npm install`. Start command: `npm run start`.
3. **If using Turso:** skip disks entirely — just set `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` in step 4. **If using the local file instead:** add a **Disk**, mount path `/data`, at least 1 GB, and set `SQLITE_PATH=/data/nexus.sqlite`.
4. Environment variables: `JWT_SECRET`, `CLIENT_URL` (fill in after the frontend is deployed), plus the DB variables from step 3, and optionally `GROQ_API_KEY`/`GEMINI_API_KEY`. Leave `PORT` unset — Render injects it.
5. Deploy. Once live, open a shell (Render dashboard → Shell) and run `npm run seed` once to seed the database (Turso or the mounted disk).
6. Health check path: `/health` (already implemented, returns `{"status":"ok"}`).

**Frontend — Static Site:**
1. New → Static Site → same repo, root directory `frontend`.
2. Build command: `npm install && npm run build`. Publish directory: `dist`.
3. Environment variables: `VITE_API_URL` and `VITE_SOCKET_URL` pointing at the backend Web Service's URL from the previous step.
4. Add a rewrite rule `/* → /index.html` (SPA fallback) so client-side routes like `/incidents/123` don't 404 on refresh.
5. Deploy, then go back to the backend service and set `CLIENT_URL` to this static site's URL, and redeploy the backend so CORS/Socket.IO accept it.

---

## 3. Option B — Railway

1. New Project → deploy `backend/` as a service (set root directory to `backend`).
2. **If using Turso:** no volume needed — just set `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` in step 3. **If using the local file:** add a **Volume**, mount it at `/data`, and set `SQLITE_PATH=/data/nexus.sqlite`.
3. Set `JWT_SECRET`, `CLIENT_URL`, and optional AI keys as variables. Railway sets `PORT` automatically.
4. Deploy, then use the Railway shell (or a one-off run command) to execute `npm run seed`.
5. Deploy `frontend/` as a second service (root directory `frontend`), build command `npm run build`, and serve `dist/` — Railway's static/Nixpacks preset handles this, or use a small `serve` static server. Set `VITE_API_URL`/`VITE_SOCKET_URL` before building.
6. Update `CLIENT_URL` on the backend once the frontend has a stable domain.

---

## 4. Option C — Single VPS (one box, both apps)

Good if you want one server and one domain with `/api` proxied to the backend.

```bash
# On the server (Ubuntu example)
sudo apt update && sudo apt install -y nodejs npm nginx
sudo npm install -g pm2

git clone <your-repo-url> nexus && cd nexus

# Backend
cd backend
cp .env.example .env   # edit: JWT_SECRET, CLIENT_URL=https://your-domain
                        # then either TURSO_DATABASE_URL/TURSO_AUTH_TOKEN,
                        # or SQLITE_PATH=/var/lib/nexus/nexus.sqlite for a local file
sudo mkdir -p /var/lib/nexus && sudo chown $USER /var/lib/nexus   # only needed for the local-file option
npm install
npm run seed
pm2 start src/server.js --name nexus-api
pm2 save && pm2 startup   # persist across reboots

# Frontend
cd ../frontend
cp .env.example .env   # edit: VITE_API_URL=https://your-domain/api, VITE_SOCKET_URL=https://your-domain
npm install
npm run build           # outputs frontend/dist
```

**Nginx** — serve the built frontend and reverse-proxy `/api` and Socket.IO to the backend (adjust paths/domain):

```nginx
server {
    listen 80;
    server_name your-domain;

    root /home/you/nexus/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # SPA fallback
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # required for WebSocket upgrade
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Then point `VITE_SOCKET_URL`/`CLIENT_URL` at the same domain (no separate port), and add TLS with `certbot --nginx`.

---

## 5. Option D — Fly.io (backend) + Vercel/Netlify (frontend)

This is the shape you get if you're using **Turso** and want the frontend on **Vercel**, per the question of whether "both" can go on Vercel — see section 0 for why the backend still needs a real host even with Turso.

1. `fly launch` from `backend/`, accept the generated `fly.toml`.
   - **Using Turso:** no volume needed. Skip to step 2.
   - **Using the local file instead:** `fly volumes create nexus_data --size 1` and mount it at `/data` in `fly.toml` (`[[mounts]]`), and set `SQLITE_PATH=/data/nexus.sqlite` below.
2. `fly secrets set JWT_SECRET=... CLIENT_URL=https://your-frontend-domain TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=...`.
3. `fly deploy`, then `fly ssh console -C "npm run seed"` once.
4. Deploy `frontend/` **to Vercel** as a normal Vite static build (framework preset: Vite). Set `VITE_API_URL`/`VITE_SOCKET_URL` as project environment variables, pointing at the Fly.io backend's URL, build command `npm run build`, output directory `dist`. This part of "both on Vercel" works fine — it's only the stateful, WebSocket-serving backend that can't go there.

---

## 6. Post-deploy checklist

- [ ] `GET https://<backend>/health` returns `{"status":"ok","mode":"SIMULATION"}`.
- [ ] `npm run seed` has been run **once** against the production database (creates the demo accounts and Bihar Flood 2026 scenario data).
- [ ] Frontend loads at its URL, and the browser console shows a Socket.IO **connect** (not repeated `ERR_CONNECTION_REFUSED`/`WebSocket closed`) — if you see that, `VITE_SOCKET_URL` or `CLIENT_URL` is wrong or the two were deployed in the wrong order (frontend needs the backend's final URL; backend needs the frontend's final URL back for CORS).
- [ ] Log in with a seeded account (`commander@nexus.io` / `password123`) and confirm the dashboard loads real data, not errors.
- [ ] Trigger a Simulation event and confirm the event stream/decision log update live (proves Socket.IO is actually working end-to-end, not just HTTP).
- [ ] Rotate `JWT_SECRET` to a value only you have, and change or remove the seeded demo passwords if this will be publicly reachable.
- [ ] Confirm HTTPS is enabled on both frontend and backend domains (most hosts above do this automatically) — mixed HTTP/HTTPS will silently break the API calls and the WebSocket upgrade.

## 7. Common failure modes

| Symptom | Cause |
|---|---|
| Console: `WebSocket connection ... failed`, `ERR_CONNECTION_REFUSED` | Backend not reachable at `VITE_SOCKET_URL`, or backend not deployed/started yet, or wrong port. |
| CORS error in console | `CLIENT_URL` on the backend doesn't exactly match the frontend's deployed origin (scheme + host, no trailing slash). |
| Data resets after every deploy | Backend is running on a serverless/ephemeral filesystem with the local-file DB — switch to Turso (section 1a), or point `SQLITE_PATH` at a mounted persistent disk/volume. |
| `Error: Please install @libsql/sqlite3 package manually` or connection errors on startup with Turso set | `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` missing or wrong, or `npm install` wasn't run after pulling this dependency. Double-check with `turso db show <db-name> --url` and `turso db tokens create <db-name>`. |
| `/incidents/123` 404s on page refresh (but works via in-app navigation) | Missing SPA rewrite rule (`/* → /index.html`) on the static host. |
| Login works but every other page 401s | `JWT_SECRET` differs between the token-issuing deploy and a later redeploy (e.g., regenerated on every restart) — set it as a fixed env var, don't leave it to a default. |
