import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("react-refactor-to-file extension is now active");

  const disposable = vscode.commands.registerCommand(
    "react-refactor-to-file.extractToFile",
    async () => {
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

      // Get the current file path and directory
      const currentFilePath = editor.document.uri.fsPath;
      const currentDir = path.dirname(currentFilePath);
      const currentFileName = path.basename(
        currentFilePath,
        path.extname(currentFilePath)
      );

      // Determine file extension (.tsx or .jsx based on current file)
      const currentExt = path.extname(currentFilePath);
      const isTypeScript = currentExt === ".tsx" || currentExt === ".ts";
      const newFileExt = isTypeScript ? ".tsx" : ".jsx";

      // Create the new file path
      const newFilePath = path.join(
        currentDir,
        `${componentName}${newFileExt}`
      );
      const newFileUri = vscode.Uri.file(newFilePath);

      // Create the new component content
      const newComponentContent = createComponentContent(
        componentName,
        selectedText,
        isTypeScript
      );

      // Create the new file with the component
      try {
        await vscode.workspace.fs.writeFile(
          newFileUri,
          Buffer.from(newComponentContent, "utf8")
        );

        // Replace the selected text with the component tag
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, `<${componentName} />`);
        });

        // Add import statement at the top of the file
        await addImportStatement(
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

        vscode.window.showInformationMessage(
          `Component ${componentName} created successfully`
        );
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create component: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function createComponentContent(
  componentName: string,
  selectedText: string,
  isTypeScript: boolean
): string {
  const typeAnnotation = isTypeScript ? ": React.FC" : "";

  return `import React from 'react';

const ${componentName}${typeAnnotation} = () => {
	return (
		${selectedText}
	);
};

export default ${componentName};
`;
}

async function addImportStatement(
  editor: vscode.TextEditor,
  componentName: string,
  newFilePath: string,
  currentFilePath: string
): Promise<void> {
  const document = editor.document;
  const relativePath = getRelativeImportPath(currentFilePath, newFilePath);

  const importStatement = `import ${componentName} from '${relativePath}';\n`;

  // Find the position to insert the import (after existing imports or at the top)
  const insertPosition = findImportInsertPosition(document);

  await editor.edit((editBuilder) => {
    editBuilder.insert(insertPosition, importStatement);
  });
}

function getRelativeImportPath(fromFile: string, toFile: string): string {
  const fromDir = path.dirname(fromFile);
  let relativePath = path.relative(fromDir, toFile);

  // Remove file extension
  relativePath = relativePath.replace(/\.(tsx?|jsx?)$/, "");

  // Ensure it starts with ./ if it's in the same directory
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }

  // Convert Windows backslashes to forward slashes
  relativePath = relativePath.replace(/\\/g, "/");

  return relativePath;
}

function findImportInsertPosition(
  document: vscode.TextDocument
): vscode.Position {
  let lastImportEndLine = -1;
  let inMultiLineImport = false;
  let braceBalance = 0;

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    const text = line.text.trim();

    // Skip empty lines if we're not inside an import
    if (!text && !inMultiLineImport) {
      continue;
    }

    // Skip comments
    if (text.startsWith("//") || text.startsWith("/*")) {
      continue;
    }

    // Check for import start
    if (text.startsWith("import ") && !inMultiLineImport) {
      inMultiLineImport = true;
      // Reset brace balance for new import
      braceBalance = 0;
    }

    if (inMultiLineImport) {
      // Count braces in non-comment parts of the line
      // Simple heuristic: remove string contents and comments to avoid false positives
      const cleanLine = text
        .replace(/'.*?'/g, "")
        .replace(/".*?"/g, "")
        .replace(/\/\/.*$/, "");

      const openBraces = (cleanLine.match(/\{/g) || []).length;
      const closeBraces = (cleanLine.match(/\}/g) || []).length;
      braceBalance += openBraces - closeBraces;

      // Check if import statement ends
      // It ends if braces are balanced and we see a semicolon,
      // or if braces are balanced AND we are not just opening (to handle `import {`)
      // AND it is not just `import` keyword line (unless side-effect import)

      // Improved check:
      // 1. If it ends with semicolon and balanced
      // 2. If it's a side-effect import `import '...'`
      // 3. If it's `import ... from '...'` without braces or balanced

      const hasSemicolon = cleanLine.includes(";");

      // If we are balanced and have a semicolon, it's definitely the end
      if (braceBalance === 0 && hasSemicolon) {
        inMultiLineImport = false;
        lastImportEndLine = i;
      }
      // Fallback for no semicolons (heuristics)
      else if (braceBalance === 0 && text.length > 0) {
        // If we have `from '...'` string, it's likely the end
        if (
          text.match(/from\s+['"]/) ||
          text.match(/^import\s+['"][^'"]+['"]$/)
        ) {
          inMultiLineImport = false;
          lastImportEndLine = i;
        }
      }
    } else if (lastImportEndLine >= 0 && text && !text.startsWith("import")) {
      // If we found a non-import line after seeing imports, we stop
      break;
    }
  }

  if (lastImportEndLine >= 0) {
    return new vscode.Position(lastImportEndLine + 1, 0);
  }

  return new vscode.Position(0, 0);
}

export function deactivate() {}
