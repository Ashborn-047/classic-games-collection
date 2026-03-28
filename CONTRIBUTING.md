# Contributing to Classic Games Collection 🎮

First off, thank you for considering contributing to the Classic Games Collection! It's people like you that make this project awesome.

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v20 or higher.
- **pnpm**: v10 or higher.
- **SpacetimeDB CLI**: Required for backend development.

### Local Setup
1. Clone the repository: `git clone https://github.com/Ashborn-047/classic-games-collection.git`
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev`

---

## 🏗️ Technical Standards

### 1. The 3-File Isolated Engine Pattern
To keep the codebase maintainable and the UI reactive, we follow a strict separation of concerns for every game in `apps/`. Avoid creating complex directory structures within game apps. Stick to:

- **`App.jsx`**: The React entry point. Responsible only for rendering the UI and passing user inputs to the engine.
- **`engine.js`**: The heart of the game. Handles state management, SpacetimeDB networking, and game loops.
- **`index.css`**: The design layer. Isolated styles for the specific game.

### 2. Design Philosophy: Neo-Brutalism
- **Bold Borders**: Use `border: 2px solid black` or `box-shadow` for that chunky, high-contrast look.
- **Retro Glows**: Use subtle `drop-shadow` or `box-shadow` with vibrant colors (Neon Green, Cyber Pink) for interactive elements.
- **Micro-Animations**: Use smooth transitions for hovers and state changes.

### 3. Server-Authoritative Logic
All game rules must be validated on the server. The frontend is a "thin client" that renders what the server dictates.

---

## 🧪 Development Workflow

1. **Create an Issue**: Before starting work, please open an issue to discuss the change.
2. **Branching**: Create a feature branch from `main` (e.g., `feat/new-game-poker`).
3. **Drafting**: Use the 3-file core pattern for any new features.
4. **Testing**: Run `pnpm build` to ensure the monorepo remains buildable.
5. **Pull Request**: Submit a PR with a clear description of the changes and a screenshot of any UI updates.

---

## 📜 Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).
