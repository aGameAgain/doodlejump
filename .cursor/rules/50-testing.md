## Testing rules

- Use Jest with jsdom and `jest-canvas-mock` (already configured in `package.json`).
- Prefer unit tests per module in `tests/*.test.js`.
- Mock Canvas context in rendering tests; assert drawing calls and order where meaningful.
- For physics, assert deterministic outcomes for fixed frames (no real timers).
- Keep public methods pure/deterministic to simplify tests. Hide DOM/canvas behind `Renderer`.
- When modifying core constants, update expected values and edge cases accordingly.

### Commands

```bash
npm test
npm run test:watch
npm run test:coverage
```


