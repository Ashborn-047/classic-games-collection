# Classic Games Collection 👾

A production-grade, Neo-Brutalist collection of classic board and arcade games. Built for high performance, deterministic multiplayer, and a premium visual experience.

## 🚀 Live Demo
[Launch the Game Hub](https://Ashborn-047.github.io/classic-games-collection/)

---

## 🏗️ Architecture (Phase 1+)

This project is built using a **Monorepo** structure with **Turborepo** and **SpacetimeDB**.

### Core Technologies
- **Frontend**: React + TypeScript + Tailwind CSS v4 + Framer Motion
- **State Management**: Zustand + Immer
- **Backend (Rust)**: SpacetimeDB (Server-Authoritative Ticks)
- **Rendering**: OffscreenCanvas + Web Workers (Snake Arena)
- **Infrastructure**: GitHub Actions (CI/CD)

### Project Structure
```text
├── apps/
│   ├── hub/                   # Master Landing Page
│   ├── snake-arena/           # Real-time Web Worker Based Game
│   ├── snakes-and-ladders/    # Multi-theme Board Game
│   └── ludo-pro/              # Strategy Board Game
├── packages/
│   ├── shared-ui/             # Lobby, Modal, HUD, Buttons
│   ├── shared-types/          # TypeScript interfaces
│   └── engine-rust/           # Shared Rust logic
└── server/                    # SpacetimeDB Rust Workspace
```

---

## 🎮 Included Games

### 1. Snake Arena
A real-time arcade classic.
*   **Modes**: Solo, Smart AI (3 levels), and Online PvP.
*   **Engine**: Server-authoritative ticks to prevent cheating and sync jitter.
*   **Rendering**: Highly optimized Canvas pipeline.

### 2. Ludo Modern
Strategy board game with a Rust physics/capture engine.
*   **Mechanics**: Absolute position mapping, capture logic, safe zones.
*   **Frontend**: Saturated primaries with high-contrast Neo-Brutalist aesthetics.

### 3. Snakes & Ladders
Multi-theme variant of the ancient board game.
*   **Themes**: Classic, Mystic Forest, Dungeon, and Cyberpunk.
*   **Multiplayer**: Real-time room system via SpacetimeDB.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v20+)
- pnpm (recommended)
- [SpacetimeDB CLI](https://spacetimedb.com/download)

### Run Locally
```bash
# Install dependencies
npm install

# Start the Hub in dev mode
npm run dev
```

---

## 🛡️ Identity & Anti-Cheat
*   **Profiles**: Integrated SpacetimeDB Identity for persistent stats and nicknames.
*   **Validation**: Server-side move validation (e.g., no 180° turns in Snake) and input rate-limiting.

## 📜 License
MIT
