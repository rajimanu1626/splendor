# Splendor Online – Deployment

Use **Node 18+** (Node 24 recommended). If you use nvm: `nvm use 24`.

## Local development

1. Install dependencies (root and server):
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. Run both Next.js and the game server:
   ```bash
   npm run dev:all
   ```
   Or in two terminals:
   ```bash
   npm run dev          # Next.js on http://localhost:3000
   npm run server:dev   # Game server (tsx) on http://localhost:3001
   ```

3. Open http://localhost:3000, click **Play Online**, create or join a room.

## Environment

- **NEXT_PUBLIC_GAME_SERVER_URL** – URL of the game server (default: `http://localhost:3001`). Set this in production to your server’s public URL (e.g. `https://game.yourdomain.com` or `wss://game.yourdomain.com` if behind a WebSocket proxy).
- **GAME_SERVER_PORT** – Port for the game server (default: `3001`).
- **CORS_ORIGIN** – Allowed origin for CORS (default: `http://localhost:3000`). In production set to your frontend origin.

## Production

1. Build the Next.js app:
   ```bash
   npm run build
   ```

2. Build and run the game server (bundled build avoids ESM/tsx issues):
   ```bash
   npm run build:server
   npm run server
   ```
   Or with env: `GAME_SERVER_PORT=3001 CORS_ORIGIN=https://yourdomain.com npm run server`

3. Serve the Next.js app with your usual process (e.g. `npm start` or a Node/PM2 reverse proxy).

4. If frontend and game server are on the same host, use a reverse proxy (e.g. nginx):
   - `/` → Next.js (e.g. port 3000)
   - `/socket.io` → game server (e.g. port 3001)
   Then set `NEXT_PUBLIC_GAME_SERVER_URL` to the same origin (e.g. `https://yourdomain.com`) so the client connects to the same host.

## Hosting on your server

- Run the game server so it is reachable from the internet (open port or reverse proxy).
- Set `NEXT_PUBLIC_GAME_SERVER_URL` to the public URL of the game server so browsers can connect via WebSocket.
