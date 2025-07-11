# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern ES6 implementation of the classic Doodle Jump game using vanilla JavaScript, HTML5 Canvas, and CSS. The game features a player character that continuously jumps upward on randomly generated platforms, with the goal of achieving the highest possible score.

## Architecture

The codebase has been refactored from a monolithic structure to a modular ES6 architecture:

### Core Components

- **main.js**: Entry point that orchestrates all modules and handles DOM setup
- **js/Game.js**: Main game logic, state management, platform generation, and game loop
- **js/Player.js**: Player character physics, movement, collision detection, and rendering
- **js/Platform.js**: Platform creation, positioning, and drawing with random colors
- **js/InputHandler.js**: Keyboard event handling for player movement controls
- **js/Renderer.js**: Canvas rendering utilities and score display management

### Legacy Files

- **index.html**: Game HTML structure with Canvas element and UI screens
- **style.css**: Game styling and responsive design

## Development Commands

### Running the Game
```bash
# Development server
npm run dev

# Or open index.html directly in browser
open index.html
```

### Testing
```bash
# Run all tests (now working without memory issues)
npm test

# Run specific test file
npx jest tests/Player.test.js --verbose

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Dependencies
```bash
# Install dependencies
npm install

# Note: Initial install may take time due to canvas dependencies
```

## Game Parameters & Physics

Key game parameters are defined in `js/Game.js` and documented in `DEVELOPMENT.md`:

- **Gravity**: 0.2 (controls fall speed)
- **Jump Force**: -12 (controls jump height)
- **Platform Spacing**: 40-120px (min/max gap between platforms)
- **Platform Count**: 8 (number of platforms maintained on screen)
- **Player Speed**: 6 (horizontal movement speed)

## Testing Architecture

The test suite uses Jest with jsdom and canvas mocking:

- **67 passing tests** across 4 component test files
- Tests cover unit functionality, integration scenarios, and error handling
- Mock objects are used for Canvas API, DOM events, and module dependencies

## Key Game Logic

### Platform Generation
- Platforms are generated above the current highest platform
- Smart spacing ensures platforms are within jumping range (max 180px gap)
- Platforms are cleaned up when they move off-screen
- Random colors are assigned from a predefined palette

### Player Physics
- Continuous gravity application with collision-based jumping
- Horizontal wrapping at screen edges
- Velocity-based movement with input handling
- Visual expressions change based on movement direction

### Screen Scrolling
- Camera follows player when reaching upper third of screen
- Platforms move down while player stays centered
- Score increases based on vertical distance traveled

## Common Issues

### Module Loading
- Project uses ES6 modules (`"type": "module"` in package.json)
- All imports/exports use ES6 syntax
- Ensure proper module loading when adding new components

## File Dependencies

```
main.js
├── js/Game.js
│   ├── js/Platform.js
│   ├── js/Player.js  
│   └── js/Renderer.js
└── js/InputHandler.js
```

The `Game` class imports and manages `Platform`, `Player`, and `Renderer` classes, while `InputHandler` operates directly on the player instance passed from the main game loop.