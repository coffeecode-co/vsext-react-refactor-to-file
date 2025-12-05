# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension called "react-refactor-to-file" that allows developers to extract React component fragments from an existing file into a new component file. The extension automates the tedious process of creating new components by:
- Extracting selected JSX/TSX code
- Creating a new component file with proper boilerplate
- Replacing the selection with a component tag
- Adding the appropriate import statement

The extension uses esbuild for bundling and TypeScript for type safety.

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

## Extension Features

Command: `react-refactor-to-file.extractToFile` (title: "React: Extract to Component File")

**Workflow:**
1. User selects JSX/TSX fragment in the editor
2. User runs the command (via Command Palette or keybinding)
3. Extension prompts for new component name (validates PascalCase format)
4. Extension performs the extraction:
   - Creates a new file `ComponentName.tsx` or `ComponentName.jsx` (matches source file type)
   - Generates component boilerplate with the selected code
   - Replaces selection with `<ComponentName />`
   - Adds import statement at the appropriate position
   - Opens the new file in a side-by-side view

**Implementation Details:**
- `findImportInsertPosition()` - Finds the correct position to insert imports (after existing imports)
- `getRelativeImportPath()` - Generates proper relative import paths with cross-platform support
- `createComponentContent()` - Generates component boilerplate, adjusting for TypeScript vs JavaScript
- Component name validation ensures PascalCase convention
- Automatically detects `.tsx` vs `.jsx` based on source file extension

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
