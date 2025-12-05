import * as vscode from "vscode";
import { ExtractComponentController } from "./controllers/ExtractComponentController";

export function activate(context: vscode.ExtensionContext) {
  console.log("react-refactor-to-file extension is now active");

  const controller = new ExtractComponentController();

  const disposable = vscode.commands.registerCommand(
    "react-refactor-to-file.extractToFile",
    () => {
      controller.execute();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
