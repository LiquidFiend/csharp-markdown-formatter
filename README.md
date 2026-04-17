# C# Markdown Code Block Formatter

Formats C# fenced code blocks in Markdown files without touching the rest of your document.

## Usage

1. Place your cursor **anywhere inside** a ` ```csharp ` or ` ```cs ` block
2. Press **Ctrl+Shift+Alt+F** (Windows/Linux) or **Cmd+Shift+Alt+F** (Mac)
   — or run **"Format C# Code Block"** from the Command Palette (Ctrl+Shift+P)

## What it formats

- Brace indentation (`{` / `}`)
- Nested block indentation
- Preserves blank lines
- Ignores braces inside strings and `//` comments

## Installation (Local)

1. Copy the `csharp-markdown-formatter` folder to your VS Code extensions directory:
   - **Windows:** `%USERPROFILE%\.vscode\extensions\`
   - **Mac/Linux:** `~/.vscode/extensions/`
2. Restart VS Code (or run **Developer: Reload Window**)

## Notes

This extension uses a simple indentation-aware formatter, not a full language server.
It handles the vast majority of real-world C# formatting needs inside markdown docs.
For edge cases (complex lambdas, LINQ chains), the C# Dev Kit in a `.cs` file is still best.
