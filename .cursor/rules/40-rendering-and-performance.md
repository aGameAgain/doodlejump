## Rendering & performance rules

- Centralize all Canvas API usage in `Renderer`.
- Clear canvas each frame; draw background, platforms, player, UI in that order.
- Use integer pixel alignment where possible to avoid blurring.
- Batch style changes: set `fillStyle`, `strokeStyle`, `font` once per batch of draws.
- Avoid `save`/`restore` in tight loops; only when transformations required.
- For text (score), use a cached font and fill style; avoid re-measuring per frame.
- Consider offscreen canvas only if needed; keep current simple approach unless profiles demand it.


