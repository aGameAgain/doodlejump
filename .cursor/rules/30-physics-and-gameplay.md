## Physics & gameplay rules

- Apply gravity every frame to `player.velocityY` when game running.
- Only allow platform collision when player is falling and feet are above platform top in previous frame.
- On platform land, set `velocityY = jumpForce` and `jumping = true`.
- Horizontal wrap: if `x + width < 0` → move to right edge; if `x > canvas.width` → move to left edge.
- Max jumpable distance: generate platforms with vertical gaps ≤ 180px (aligned with `jumpForce` and gravity).
- Clamp horizontal velocity to `[-speed, speed]` based on input flags.

### Scoring & scroll

- Increase score based on upward travel; do not double-count when descending.
- Trigger camera follow when player enters upper third; shift platforms by `scrollOffset`.

### Determinism for tests

- Keep physics deterministic per frame. Avoid random within core updates; random only during generation and allow seeding if needed.


