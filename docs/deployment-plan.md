# Splendor Online – Deployment Plan (splendor.r4j.co.in)

This document describes how to host the Splendor app on your server with **server name** `splendor.r4j.co.in`, using nginx as a reverse proxy and optional SSL.

---

## 1. Overview

- **Next.js** (client) runs on port **3000** (or `PORT` env).
- **Game server** (Socket.IO + Express) runs on port **3001** (or `GAME_SERVER_PORT`).
- **Nginx** serves as the public entry point:
  - `https://splendor.r4j.co.in/` → Next.js (port 3000).
  - `https://splendor.r4j.co.in/socket.io/` → Game server (port 3001), with WebSocket upgrade.

The browser connects to a single origin (`https://splendor.r4j.co.in`), so no CORS issues and no need to expose port 3001 publicly.

---

## 2. Prerequisites

| Requirement | Notes |
|------------|--------|
| **Node.js** | 18+ (24 recommended). Use `node -v` to check. |
| **npm** | Comes with Node. |
| **nginx** | Installed and running (e.g. `sudo apt install nginx`). |
| **Domain** | `splendor.r4j.co.in` DNS A/AAAA record pointing to your server IP. |
| **SSL** (optional) | Certbot + Let’s Encrypt for HTTPS. |

---

## 3. Directory layout (suggested)

Example layout on the server:

```
/var/www/games/Splendor/splendor2/   # or your chosen path
├── .env                    # Production env (see below)
├── .next/                  # Next.js build output
├── server/
│   └── dist/
│       └── index.mjs       # Built game server
├── node_modules/
├── package.json
├── docs/
│   └── deployment-plan.md
└── nginx/
    └── splendor.r4j.co.in.conf   # Nginx config (see repo)
```

---

## 4. Environment variables

Create or edit `.env` in the project root (e.g. `/var/www/games/Splendor/splendor2/.env`):

```bash
# Public URL of the app (same origin for Next + Socket.IO)
NEXT_PUBLIC_GAME_SERVER_URL=https://splendor.r4j.co.in

# Game server (only needed if not default)
GAME_SERVER_PORT=3001

# Allowed CORS origin (must match the domain users see)
CORS_ORIGIN=https://splendor.r4j.co.in
```

- **NEXT_PUBLIC_GAME_SERVER_URL**: Set to `https://splendor.r4j.co.in` so the client connects to the same host; nginx will route `/socket.io/` to the game server.
- **CORS_ORIGIN**: Set to `https://splendor.r4j.co.in` so the Socket.IO server accepts requests from that origin.

---

## 5. Build steps

From the project root:

```bash
cd /var/www/games/Splendor/splendor2

# 1. Install dependencies
npm ci   # or npm install

# 2. Build Next.js (client)
npm run build

# 3. Build game server (bundled to server/dist/index.mjs)
npm run build:server
```

---

## 6. Running in production

### Option A: PM2 (recommended)

```bash
# Install PM2 globally (once)
npm install -g pm2

# Start Next.js (port 3000 by default)
PORT=3000 pm2 start npm --name "splendor-next" -- start

# Start game server (port 3001)
cd /var/www/games/Splendor/splendor2
GAME_SERVER_PORT=3001 CORS_ORIGIN=https://splendor.r4j.co.in pm2 start npm --name "splendor-server" -- run server

# Persist on reboot
pm2 save
pm2 startup
```

Or use a single `ecosystem.config.cjs` so one `pm2 start ecosystem.config.cjs` starts both.

### Option B: systemd

Create two services, e.g.:

- `splendor-next.service`: runs `npm start` with `PORT=3000`, `WorkingDirectory=/var/www/games/Splendor/splendor2`.
- `splendor-server.service`: runs `node server/dist/index.mjs` with `GAME_SERVER_PORT=3001` and `CORS_ORIGIN=https://splendor.r4j.co.in`, same `WorkingDirectory`.

Use `User=` and `Restart=always` as needed.

### Option C: Manual (testing only)

```bash
# Terminal 1 – Next.js
PORT=3000 npm start

# Terminal 2 – Game server
GAME_SERVER_PORT=3001 CORS_ORIGIN=https://splendor.r4j.co.in npm run server
```

---

## 7. Nginx configuration

- Config file: **`nginx/splendor.r4j.co.in.conf`** in this repo.
- Install it (example for Debian/Ubuntu):

  ```bash
  sudo cp /var/www/games/Splendor/splendor2/nginx/splendor.r4j.co.in.conf /etc/nginx/sites-available/
  sudo ln -s /etc/nginx/sites-available/splendor.r4j.co.in.conf /etc/nginx/sites-enabled/
  ```

- If using SSL with Certbot, Certbot will modify the server block; you can start with the HTTP-only block and run `sudo certbot --nginx -d splendor.r4j.co.in`, or paste the provided config and adjust server name/roots as needed.

- Test and reload:

  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

The config does the following:

- **server_name** `splendor.r4j.co.in`.
- **`/`** → `proxy_pass` to Next.js at `http://127.0.0.1:3000`.
- **`/socket.io/`** → `proxy_pass` to game server at `http://127.0.0.1:3001`, with:
  - `proxy_http_version 1.1`
  - `Upgrade` and `Connection` for WebSocket
  - Long timeouts (e.g. 90s) so Socket.IO ping/pong does not get cut by nginx.

---

## 8. SSL with Let’s Encrypt (optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d splendor.r4j.co.in
```

Certbot will add SSL and redirect HTTP → HTTPS. Ensure your nginx config uses `server_name splendor.r4j.co.in` so Certbot can attach the certificate.

---

## 9. Checklist

- [ ] DNS: `splendor.r4j.co.in` → server IP.
- [ ] `.env`: `NEXT_PUBLIC_GAME_SERVER_URL=https://splendor.r4j.co.in`, `CORS_ORIGIN=https://splendor.r4j.co.in`.
- [ ] `npm run build` and `npm run build:server` run successfully.
- [ ] Next.js listening on 3000, game server on 3001 (only on localhost is fine).
- [ ] Nginx config installed and reloaded; `nginx -t` passes.
- [ ] Optional: SSL via Certbot; HTTPS loads and Socket.IO connects without errors.
- [ ] Process manager (PM2 or systemd) set up so both processes restart on reboot.

---

## 10. Troubleshooting

| Issue | What to check |
|-------|----------------|
| 502 Bad Gateway | Next.js and game server are running; ports 3000 and 3001 are correct in nginx. |
| Socket never connects | CORS_ORIGIN matches the browser origin; nginx `/socket.io/` has WebSocket headers and long timeouts. |
| Connection drops after ~60s | Increase `proxy_read_timeout` and `proxy_send_timeout` in the `/socket.io/` block (e.g. 90s). |
| Wrong site or 404 | `server_name splendor.r4j.co.in` and `proxy_pass` URLs in nginx. |

---

## 11. Security notes

- Keep `.env` out of version control and restrict file permissions.
- Run Next and the game server as a dedicated user (e.g. via PM2/systemd `User=`).
- Rely on nginx (and optionally a firewall) so only 80/443 are public; do not expose 3000 or 3001 to the internet unless intended.
- Keep Node, nginx, and the OS updated.
