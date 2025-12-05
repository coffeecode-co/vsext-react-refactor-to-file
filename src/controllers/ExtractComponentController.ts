import * as vscode from "vscode";
import * as path from "path";
import { ComponentGenerator } from "../services/ComponentGenerator";
import { ImportManager } from "../services/ImportManager";

export class ExtractComponentController {
  private componentGenerator: ComponentGenerator;
  private importManager: ImportManager;

  constructor() {
    this.componentGenerator = new ComponentGenerator();
    this.importManager = new ImportManager();
  }

  public async execute() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage("No active editor found");
      return;
    }

    const selection = editor.selection;

    if (selection.isEmpty) {
      vscode.window.showErrorMessage("Please select a fragment to extract");
      return;
    }

    // Get the selected text
    const selectedText = editor.document.getText(selection);

    // Prompt for the new component name
    const componentName = await vscode.window.showInputBox({
      prompt: "Enter the name for the new component",
      placeHolder: "ComponentName",
      validateInput: (value) => {
        if (!value) {
          return "Component name cannot be empty";
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
          return "Component name must start with an uppercase letter and contain only letters and numbers";
        }
        return null;
      },
    });

    if (!componentName) {
      return;
    }

    // Processing
    try {
      await this.processExtraction(
        editor,
        selection,
        selectedText,
        componentName
      );
      vscode.window.showInformationMessage(
        `Component ${componentName} created successfully`
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create component: ${error}`);
    }
  }

  private async processExtraction(
    editor: vscode.TextEditor,
    selection: vscode.Selection,
    selectedText: string,
    componentName: string
  ) {
    // Get the current file path and directory
    const currentFilePath = editor.document.uri.fsPath;
    const currentDir = path.dirname(currentFilePath);

    // Determine file extension (.tsx or .jsx based on current file)
    const currentExt = path.extname(currentFilePath);
    const isTypeScript = currentExt === ".tsx" || currentExt === ".ts";
    const newFileExt = isTypeScript ? ".tsx" : ".jsx";

    // Create the new file path
    const newFilePath = path.join(currentDir, `${componentName}${newFileExt}`);
    const newFileUri = vscode.Uri.file(newFilePath);

    // Create the new component content
    const newComponentContent = this.componentGenerator.generate(
      componentName,
      selectedText,
      isTypeScript
    );

    // Write file
    await vscode.workspace.fs.writeFile(
      newFileUri,
      Buffer.from(newComponentContent, "utf8")
    );

    // Replace the selected text with the component tag
    await editor.edit((editBuilder) => {
      editBuilder.replace(selection, `<${componentName} />`);
    });

    // Add import statement
    await this.addImportStatement(
      editor,
      componentName,
      newFilePath,
      currentFilePath
    );

    // Open the new file
    const doc = await vscode.workspace.openTextDocument(newFileUri);
    await vscode.window.showTextDocument(doc, {
      preview: false,
      viewColumn: vscode.ViewColumn.Beside,
    });
  }

  private async addImportStatement(
    editor: vscode.TextEditor,
    componentName: string,
    newFilePath: string,
    currentFilePath: string
  ): Promise<void> {
    const relativePath = this.importManager.calculateRelativePath(
      currentFilePath,
      newFilePath
    );
    const importStatement = this.importManager.generateImportStatement(
      componentName,
      relativePath
    );

    // Find the position to insert the import
    const insertPosition = this.importManager.findInsertPosition(
      editor.document
    );

    await editor.edit((editBuilder) => {
      editBuilder.insert(insertPosition, importStatement);
    });
  }
}
