## Project context

- **App type**: Vanilla JavaScript browser game using HTML5 Canvas and CSS
- **Modules** (ES modules, "type": "module"):
  - `main.js`: entry, DOM, bootstraps game, wires inputs
  - `js/Game.js`: game loop, state, platform generation, score/scroll
  - `js/Player.js`: player physics, movement, collision helpers
  - `js/Platform.js`: platform model and drawing helpers
  - `js/InputHandler.js`: keyboard input → player intent
  - `js/Renderer.js`: canvas rendering utilities and UI (score)
- **Tests**: Jest + jsdom + `jest-canvas-mock` in `tests/*.test.js`
- **Dev commands**:
  - Run: `npm run dev` (http-server on port 3000) or open `index.html`
  - Tests: `npm test`, watch: `npm run test:watch`, coverage: `npm run test:coverage`

### Key gameplay/physics parameters (documented in `DEVELOPMENT.md`)

- Gravity: `game.gravity = 0.2`
- Jump force: `player.jumpForce = -12`
- Player speed: `player.speed = 6`
- Platform spacing: min `40`, max `120` (vertical), ensure within jumpable range (≤ ~180)
- Platform count on screen: `8`

### Architectural guardrails

- Preserve module boundaries; avoid circular deps. Import graph:

```
main.js
├── js/Game.js
│   ├── js/Platform.js
│   ├── js/Player.js
│   └── js/Renderer.js
└── js/InputHandler.js
```

- Side effects (DOM, canvas) via `main.js` and `js/Renderer.js` only. Core logic should be deterministic and testable.

### When changing core constants

- Update both code and `DEVELOPMENT.md` table.
- Re-run tests and adjust platform spacing checks accordingly.

### Compatibility

- Runs in modern browsers. Node usage is only for tests/tooling. Keep code portable to jsdom for tests (mock Canvas APIs as needed).


