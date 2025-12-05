# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension called "react-refactor-to-file" - a React refactoring tool currently in early development (v0.0.1). The extension uses esbuild for bundling and TypeScript for type safety.

## Build System

The project uses esbuild for bundling rather than webpack. Key details:
- Entry point: `src/extension.ts`
- Output: `dist/extension.js` (CommonJS format)
- External dependency: `vscode` module (provided by VS Code runtime)
- Production builds are minified, development builds include sourcemaps
- The esbuild configuration is in `esbuild.js`

## Development Commands

```bash
# Type checking only
pnpm run check-types

# Linting only
pnpm run lint

# Full compilation (type check + lint + bundle)
pnpm run compile

# Watch mode for development (runs type checker and bundler in parallel)
pnpm run watch

# Run tests (compiles tests, runs full build, then executes via vscode-test)
pnpm run test

# Compile tests only
pnpm run compile-tests

# Production bundle (for publishing)
pnpm run package
```

## Extension Architecture

The extension follows the standard VS Code extension structure:
- `activate()` function in `src/extension.ts` is called when the extension is first activated
- Commands are registered via `vscode.commands.registerCommand()`
- Command IDs must match those declared in `package.json` under `contributes.commands`
- Disposables should be added to `context.subscriptions` for proper cleanup
- `deactivate()` function is called when the extension is deactivated

Currently registers one command: `react-refactor-to-file.helloWorld`

## Testing

Tests use the VS Code test framework:
- Test files: `src/test/**/*.test.ts`
- Tests are compiled to `out/test/` directory
- Configuration: `.vscode-test.mjs`
- Run tests with `pnpm run test` (requires VS Code to be installed)
- Tests execute in an actual VS Code instance via `@vscode/test-electron`

## TypeScript Configuration

- Target: ES2022
- Module system: Node16
- Strict mode enabled
- Source files in `src/`, tests compile to `out/`
