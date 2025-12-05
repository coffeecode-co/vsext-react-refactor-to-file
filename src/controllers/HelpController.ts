import * as vscode from "vscode";

export class HelpController {
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel(
      "React Refactor Help"
    );
  }

  public showHelp() {
    this.outputChannel.clear();
    this.outputChannel.appendLine("# React Refactor to File - Help");
    this.outputChannel.appendLine("");
    this.outputChannel.appendLine("## Available Commands");
    this.outputChannel.appendLine(
      "- React: Extract to Component File (Default)"
    );
    this.outputChannel.appendLine(
      "  Extracts the selected JSX to a new file in the same directory."
    );
    this.outputChannel.appendLine("");
    this.outputChannel.appendLine(
      "- React: Extract to Component File (Custom Path)"
    );
    this.outputChannel.appendLine(
      "  Extracts the selected JSX to a new file in a specific directory (via dialog)."
    );
    this.outputChannel.appendLine("");

    this.outputChannel.appendLine("## Configuration");
    this.outputChannel.appendLine(
      "You can configure the extension in Settings (File > Preferences > Settings):"
    );
    this.outputChannel.appendLine(
      "- react-refactor-to-file.test.generate: Enable/Disable automatic test generation."
    );
    this.outputChannel.appendLine(
      '- react-refactor-to-file.test.strategy: Choose "relative" or "interactive" test placement.'
    );
    this.outputChannel.appendLine(
      '- react-refactor-to-file.test.relativePath: Define the folder name for tests (e.g. "__tests__").'
    );

    this.outputChannel.show();
  }
}
