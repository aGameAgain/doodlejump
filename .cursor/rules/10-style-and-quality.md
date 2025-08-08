## Style & quality rules

- **Language**: Modern ES2022 syntax, no TypeScript.
- **Naming**: Descriptive identifiers. Avoid 1–2 character names except for tiny local loops.
- **Immutability first**: Prefer `const`. Use `let` only when values change.
- **Side effects**: Keep rendering and DOM effects in `Renderer` or `main.js`.
- **Control flow**: Use guard clauses; avoid deep nesting. Extract helpers for readability.
- **Comments**: Explain intent (why), not mechanics (how). No TODOs—implement or open an issue.
- **Formatting**: Match existing style; multi-line for long expressions.
- **Collections**: Prefer array methods (`map`, `filter`, `some`) when clearer than loops.
- **Time/loop logic**: Use `requestAnimationFrame`-driven delta if you introduce time-based behaviors. Keep frame-step deterministic for tests.
- **Modules**: ES module imports/exports only. No global leaks.

### Error handling

- Fail fast in dev with clear error messages. Validate inputs at module boundaries.
- For game loop safety, guard against NaN/Infinity in physics updates.

### Performance

- Avoid per-frame allocations in hot paths (no new arrays/objects inside inner loops unless necessary).
- Batch canvas state changes. Minimize `save/restore` calls.
- Prefer numeric operations over object-heavy abstractions in physics.


