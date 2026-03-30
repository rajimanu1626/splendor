# Splendor (Web)

A browser implementation of the tabletop strategy game **Splendor**, with **local play** (versus AI or hot-seat), **real-time online multiplayer** via WebSockets, and a polished Next.js UI. Game rules and card data follow the standard Splendor experience; the server is authoritative so online sessions stay consistent and fair.

> **Disclaimer:** *Splendor* is a trademark of its rights holders (e.g. Space Cowboys / Asmodee). This repository is an **independent, non-commercial fan project** for learning and private play. It is **not** affiliated with, endorsed by, or connected to the publishers or designers of the original game. Do not use this project to violate intellectual property or terms of service.

---

## Features

- **Play vs AI** — Single-player against one or more AI opponents with adjustable difficulty.
- **Local multiplayer** — Pass-and-play on one device (2–4 players).
- **Play online** — Create or join rooms with a room code; the host can start when enough players are ready.
- **AI in online lobbies** — Fill seats with AI players at easy / medium / hard difficulty.
- **Reconnection** — Session storage allows reconnecting to a room after refresh (within server grace timing).
- **Per-player state** — Hidden information (e.g. reserved cards) is sanitized on the server before each client receives updates.

---

## Tech stack

| Area | Technology |
|------|------------|
| Frontend | [Next.js](https://nextjs.org/) 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, [Radix UI](https://www.radix-ui.com/) primitives, [Framer Motion](https://www.framer.com/motion/) |
| Client state | [Zustand](https://github.com/pmndrs/zustand), [Immer](https://immerjs.github.io/immer/) (where used) |
| Realtime | [Socket.IO](https://socket.io/) (client + Node server) |
| Server | Express, Node.js HTTP + Socket.IO; TypeScript (`tsx` in dev, bundled for production) |

---

## Requirements

- **Node.js** 18 or newer (the project is tested with **Node 24** in docs; use the same major version locally for fewer surprises).
- **npm** (bundled with Node).

---

## Quick start

### 1. Clone and install

```bash
git clone <your-fork-or-repo-url> splendor2
cd splendor2
npm install
cd server && npm install && cd ..
```

### 2. Environment (optional)

Copy the example file and adjust if needed:

```bash
cp .env.example .env.local
```

See [Environment variables](#environment-variables) below.

### 3. Run locally

**Recommended:** frontend and game server together:

```bash
npm run dev:all
```

Or run in two terminals:

```bash
npm run dev          # Next.js → http://localhost:3000
npm run server:dev   # Game server → http://localhost:3001
```

Open **http://localhost:3000**. Choose **Play vs AI**, **Local Multiplayer**, or **Play Online**. For online play, ensure the game server is running.

---

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_GAME_SERVER_URL` | Next.js (browser) | Base URL of the Socket.IO game server. Default when unset: same host as the page, port **3001** (see `lib/socket.ts`). |
| `GAME_SERVER_PORT` | Game server | Listen port (default **3001**). |
| `CORS_ORIGIN` | Game server | Allowed browser origin(s), comma-separated. Default includes local dev on port 3000. **Set this in production** to your real frontend origin. |

The file **`.env.example`** lists the common entries; `.env.local` is ignored by git and is the usual place for local overrides.

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js development server |
| `npm run build` | Production build of the Next.js app |
| `npm start` | Start Next.js in production mode (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run server:dev` | Game server in development (TypeScript via `tsx`) |
| `npm run build:server` | Bundle the game server to `server/dist/` |
| `npm run server` | Run the bundled game server (`node dist/index.mjs` from `server/`) |
| `npm run dev:all` | Run Next.js and the dev game server concurrently |

---

## Project layout

```text
app/                  # Next.js App Router pages (landing, setup, lobby, game)
components/           # UI: board, cards, tokens, modals, lobby, shadcn-style UI
lib/
  game-engine/        # Rules, types, AI, card data, local Zustand store
  game-protocol.ts    # Shared event/action types (mirrored on server)
  socket.ts           # Socket.IO hooks (connection, room, actions)
server/               # Express + Socket.IO authoritative multiplayer
docs/                 # Extra notes (e.g. deployment, Git workflow)
```

Multiplayer flow: clients emit actions defined in `lib/game-protocol.ts`; the server validates them against `server/` + `lib/game-engine` logic and broadcasts personalized `gameState` payloads.

---

## Production

1. Build the web app: `npm run build`
2. Build the game server: `npm run build:server`
3. Run the game server with correct `GAME_SERVER_PORT` and `CORS_ORIGIN`
4. Run the Next.js app (`npm start` or your process manager)
5. Set **`NEXT_PUBLIC_GAME_SERVER_URL`** in the environment used at **build time** for the frontend so browsers reach the same public host/path you expose for Socket.IO

For reverse proxies (e.g. nginx), path upgrades, and same-origin setups, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

The game server exposes a small health check: **`GET /health`** → JSON status.

---

## Online play checklist

- Game server reachable from players’ browsers (firewall / proxy / TLS as needed).
- `CORS_ORIGIN` matches the exact frontend origin(s).
- `NEXT_PUBLIC_GAME_SERVER_URL` matches where Socket.IO is actually served (including `https` / `wss` when applicable).

---

## Contributing

Issues and pull requests are welcome for bug fixes and clear improvements. Please keep changes focused and consistent with existing patterns. If you redistribute or deploy publicly, respect the [disclaimer](#splendor-web) and applicable laws and publisher terms.

---

## License

This repository does not currently include a `LICENSE` file. If you fork for public use, add a license you are allowed to use and ensure asset and rules usage comply with third-party rights.
