import * as vscode from "vscode";
import { ExtractComponentController } from "./controllers/ExtractComponentController";

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

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableCustom);
}

export function deactivate() {}
