## Architecture rules

- **Single source of truth**: `Game` owns state: score, gravity, platforms, scroll offset.
- **Entities**: `Player` handles its own physics state and exposes update/render hooks.
- **Rendering**: Only `Renderer` touches Canvas API. Game/Player/Platform provide render data or call Renderer with context.
- **Input**: `InputHandler` translates keyboard events into player intent flags (`leftPressed`, `rightPressed`). No direct physics here.
- **Platform generation**: Keep in `Game`. Ensure new platforms respect max jumpable distance from prior platforms.
- **Screen scroll**: `Game` updates `scrollOffset` and shifts platforms when player reaches upper third.
- **Constants**: Keep tunables in `Game`/`Player` with clear names; avoid hidden magic numbers.

### Extensibility

- New platform types should extend a common shape (x, y, width, height, type) and integrate with collision without branching explosions.
- New power-ups/enemies should be separate modules; `Game` orchestrates lifecycle.


