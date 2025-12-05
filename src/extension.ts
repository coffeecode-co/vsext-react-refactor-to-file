import * as vscode from "vscode";
import { ExtractComponentController } from "./controllers/ExtractComponentController";
import { HelpController } from "./controllers/HelpController";

export function activate(context: vscode.ExtensionContext) {
  console.log("react-refactor-to-file extension is now active");

  const controller = new ExtractComponentController();

  const disposable = vscode.commands.registerCommand(
    "react-refactor-to-file.extractToFile",
    () => {
      controller.execute({ promptForDestination: false });
    }
  );

  const disposableCustom = vscode.commands.registerCommand(
    "react-refactor-to-file.extractToFileCustomPath",
    () => {
      controller.execute({ promptForDestination: true });
    }
  );

  const helpController = new HelpController();

  const disposableHelp = vscode.commands.registerCommand(
    "react-refactor-to-file.help",
    () => {
      helpController.showHelp();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableCustom);
  context.subscriptions.push(disposableHelp);
}

export function deactivate() {}
