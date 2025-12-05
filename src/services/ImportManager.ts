import * as vscode from "vscode";
import * as path from "path";

export class ImportManager {
  /**
   * Calculates the relative path for the import statement.
   */
  public calculateRelativePath(fromFile: string, toFile: string): string {
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

  /**
   * Generates the full import string.
   */
  public generateImportStatement(
    componentName: string,
    relativePath: string
  ): string {
    return `import ${componentName} from '${relativePath}';\n`;
  }

  /**
   * Finds the best position to insert a new import statement.
   * Handles multi-line imports and comments.
   */
  public findInsertPosition(document: vscode.TextDocument): vscode.Position {
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
        /* check again if it is not a comment line just in case logic above fell through */
        if (!text.startsWith("//") && !text.startsWith("/*")) {
          break;
        }
      }
    }

    if (lastImportEndLine >= 0) {
      return new vscode.Position(lastImportEndLine + 1, 0);
    }

    return new vscode.Position(0, 0);
  }
}
