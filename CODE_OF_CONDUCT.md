# 🎮 Classic Games Collection — Code of Conduct

## Our Pledge

We as members, contributors, and maintainers of the **Classic Games Collection** pledge to make participation in our project and community a welcoming, fun, and harassment-free experience for everyone — whether you're here to fix a bug, design a game board, write Rust engine logic, or just play a round of Ludo.

We value every contributor equally, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

---

## Our Standards

### ✅ Positive Behavior

Examples of behavior that contributes to a great community:

- **Being a good sport** — Whether reviewing code or playing a game, treat others the way you'd want to be treated at the best game night ever.
- **Giving constructive feedback** — "This engine logic could be cleaner" is great. Attacking someone's skill level is not.
- **Sharing knowledge freely** — If you know how SpacetimeDB reducers work and someone else doesn't, help them out.
- **Respecting the architecture** — Follow the project's established patterns (engine isolation, server authority, Neo-Brutalist design) before proposing sweeping changes.
- **Crediting prior work** — If your PR builds on someone else's foundation, acknowledge it.
- **Using welcoming and inclusive language** in issues, PRs, discussions, and in-game chat features.

### 🎲 Game-Specific Standards

Since this project involves multiplayer gaming features, we hold additional expectations:

- **No exploit-sharing with malicious intent** — If you discover a cheat or exploit in game logic, report it responsibly via a private issue or security advisory. Never weaponize it.
- **Fair play in testing** — When testing multiplayer features, don't grief or deliberately ruin other testers' sessions.
- **Accessible design** — When contributing UI or game components, consider color-blind accessibility, screen reader support, and keyboard navigation.

### ❌ Unacceptable Behavior

- The use of sexualized language or imagery, and unwelcome sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information (physical or email address) without explicit permission
- Deliberately submitting malicious code, backdoors, or code designed to damage users' systems
- Intentionally introducing game-breaking bugs or exploits into production
- Spamming issues or PRs with low-effort or AI-generated content without meaningful review
- Any other conduct that would be considered inappropriate in a professional or collaborative setting

---

## Technical Collaboration Norms

To maintain the quality and integrity of this project, contributors agree to:

1. **Respect the server-authoritative model** — Game state validation happens in Rust. Don't push client-side "trust me" logic as a shortcut.
2. **Follow the Engine Isolation pattern** — Keep `engine.js` focused on game logic and SpacetimeDB event handling. Keep `App.jsx` as a thin React shell.
3. **Preserve the Neo-Brutalist aesthetic** — The project has a deliberate visual identity. Contributions should align with the bold borders, retro glows, and high-contrast design language.
4. **Test before you PR** — Run `pnpm build` at minimum. If you're changing a Rust engine, ensure `cargo build` passes for the relevant `server/` workspace.
5. **Write meaningful commit messages** — "fix stuff" doesn't help anyone. Use clear, descriptive messages.

---

## Enforcement Responsibilities

Project maintainers are responsible for clarifying and enforcing these standards. They will take appropriate and fair corrective action in response to any behavior deemed inappropriate, threatening, offensive, or harmful.

Maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that violate this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

---

## Scope

This Code of Conduct applies within all project spaces, including:

- GitHub issues, pull requests, and discussions
- Any in-game chat or multiplayer lobbies built as part of this project
- Project-related communication on Discord, social media, or other platforms
- Official project representations at events or in public

---

## Reporting & Enforcement

### How to Report

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by:

1. **Opening a private issue** on the repository (if you're comfortable)
2. **Contacting the maintainers directly** via the contact methods listed in the repository

All complaints will be reviewed and investigated promptly and fairly. All reporters' identities will be kept confidential.

### Enforcement Guidelines

Maintainers will follow these guidelines when determining consequences:

#### 1. 🟢 Correction

**Trigger**: Minor issues — inappropriate language, unconstructive feedback, or accidental pattern violations.

**Action**: A private, written warning with clarification of the issue. A public apology may be requested.

#### 2. 🟡 Warning

**Trigger**: A significant violation or repeated minor violations.

**Action**: Formal warning with defined consequences for continued behavior. Temporary restriction from interacting with affected parties. Violating these terms may escalate to a ban.

#### 3. 🟠 Temporary Ban

**Trigger**: Serious violation — sustained harassment, deliberate introduction of malicious code, or griefing in test environments.

**Action**: Temporary ban from all project interaction (issues, PRs, discussions, game lobbies) for a defined period. Violating these terms leads to a permanent ban.

#### 4. 🔴 Permanent Ban

**Trigger**: Pattern of violations, sustained harassment, or actions that endanger users (e.g., submitting backdoors or malicious game exploits).

**Action**: Permanent removal from all project spaces with no appeal.

---

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.1, available at [https://www.contributor-covenant.org/version/2/1/code_of_conduct.html](https://www.contributor-covenant.org/version/2/1/code_of_conduct.html).

Community Impact Guidelines were inspired by [Mozilla's code of conduct enforcement ladder](https://github.com/mozilla/cose).

Customized with project-specific standards for the **Classic Games Collection** — a server-authoritative, Neo-Brutalist gaming monorepo.
