# React Refactor to File

A VS Code extension that helps refactor React components by extracting them into separate files.

## Features

- **Extract to Component File**: Select a component or JSX and extract it to a new file automatically.
- **Extract to Component File (Custom Path)**: Allows you to select a specific destination folder for the extracted component.
- **Show Extension Help**: Displays a list of available commands and settings.
- **Test File Generation**: Automatically generate a test file for the extracted component.

## Usage

1.  Select the JSX code or Component you want to extract.
2.  Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3.  Run **"React: Extract to Component File"** to extract to the current directory.
4.  Run **"React: Extract to Component File (Custom Path)"** to choose a specific folder.
5.  Enter the name for the new component.

The extension will create the new file, replace the selection with the component usage, and add the necessary import.

## Requirements

None.

## Extension Settings

This extension contributes the following settings:

- `react-refactor-to-file.test.generate`: Enable/disable automatic test file generation (default: `false`).
- `react-refactor-to-file.test.strategy`: Choose between `relative` (default) or `interactive` path selection for tests.
- `react-refactor-to-file.test.relativePath`: Specify the relative folder for tests (default: `__tests__`).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Development

1.  Clone the repository.
2.  Install dependencies: `pnpm install`.
3.  Open in VS Code.
4.  Run `pnpm run watch` (or `npm run watch`) to start the compiler in watch mode.
5.  Press `F5` to open a new VS Code window with the extension loaded.

## Known Issues

None known at this time.
