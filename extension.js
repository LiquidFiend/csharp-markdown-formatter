const vscode = require('vscode');

/**
 * Formats C# code with proper brace indentation and spacing.
 * @param {string} code - The raw C# code to format
 * @param {string} INDENT - The indent string to use (tab or spaces)
 */
function formatCSharp(code, INDENT) {
    const lines = code.split('\n');
    const output = [];
    let indent = 0;
    let inBlockComment = false;
    let inVerbatimString = false;

    for (let i = 0; i < lines.length; i++) {
        let raw = lines[i];
        let line = raw.trim();

        if (line === '') {
            output.push('');
            continue;
        }

        const verbatimMatches = (line.match(/@"/g) || []).length;
        if (verbatimMatches % 2 !== 0) inVerbatimString = !inVerbatimString;

        if (!inVerbatimString) {
            if (line.includes('/*') && !line.includes('*/')) inBlockComment = true;
            if (line.includes('*/')) inBlockComment = false;
        }

        let stripped = inBlockComment || inVerbatimString
            ? ''
            : stripStringsAndComments(line);

        const openCount  = (stripped.match(/\{/g) || []).length;
        const closeCount = (stripped.match(/\}/g) || []).length;

        const startsWithClose = /^\}/.test(line);
        if (startsWithClose && !inBlockComment && !inVerbatimString) {
            indent = Math.max(0, indent - 1);
        }

        output.push(INDENT.repeat(indent) + line);

        if (!inBlockComment && !inVerbatimString) {
            if (startsWithClose) {
                indent = Math.max(0, indent + openCount - (closeCount - 1));
            } else {
                indent = Math.max(0, indent + openCount - closeCount);
            }
        }
    }

    return output.join('\n');
}

function stripStringsAndComments(line) {
    let result = '';
    let i = 0;
    while (i < line.length) {
        if (line[i] === '/' && line[i + 1] === '/') break;
        if (line[i] === '"') {
            i++;
            while (i < line.length) {
                if (line[i] === '\\') { i += 2; continue; }
                if (line[i] === '"') { i++; break; }
                i++;
            }
            continue;
        }
        if (line[i] === "'") {
            i++;
            while (i < line.length) {
                if (line[i] === '\\') { i += 2; continue; }
                if (line[i] === "'") { i++; break; }
                i++;
            }
            continue;
        }
        result += line[i];
        i++;
    }
    return result;
}

function findCSharpBlockAtCursor(document, position) {
    const totalLines = document.lineCount;
    const cursorLine = position.line;

    let blockStart = -1;
    for (let i = cursorLine; i >= 0; i--) {
        const text = document.lineAt(i).text.trim();
        if (/^```\s*(csharp|cs)\s*$/i.test(text)) { blockStart = i; break; }
        if (/^```\s*$/.test(text) && i !== cursorLine) break;
    }
    if (blockStart === -1) return null;

    let blockEnd = -1;
    for (let i = blockStart + 1; i < totalLines; i++) {
        const text = document.lineAt(i).text.trim();
        if (/^```\s*$/.test(text)) { blockEnd = i; break; }
    }
    if (blockEnd === -1) return null;

    if (cursorLine <= blockStart || cursorLine >= blockEnd) return null;

    const codeLines = [];
    for (let i = blockStart + 1; i < blockEnd; i++) {
        codeLines.push(document.lineAt(i).text);
    }
    return { startLine: blockStart, endLine: blockEnd, codeLines };
}

function getIndentString() {
    const config = vscode.workspace.getConfiguration('csharpMarkdown');
    const style = config.get('indentStyle', 'tabs');
    if (style === 'spaces') {
        const size = config.get('indentSize', 4);
        return ' '.repeat(size);
    }
    return '\t';
}

function activate(context) {
    const disposable = vscode.commands.registerCommand('csharpMarkdown.formatBlock', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const doc = editor.document;
        if (doc.languageId !== 'markdown') {
            vscode.window.showWarningMessage('C# Markdown Formatter: Only works in Markdown files.');
            return;
        }

        const block = findCSharpBlockAtCursor(doc, editor.selection.active);
        if (!block) {
            vscode.window.showInformationMessage('Cursor is not inside a ```csharp or ```cs code block.');
            return;
        }

        const indent = getIndentString();
        const originalCode = block.codeLines.join('\n');
        const formattedCode = formatCSharp(originalCode, indent);

        if (formattedCode === originalCode) {
            vscode.window.showInformationMessage('C# block is already formatted.');
            return;
        }

        const firstContentLine = block.startLine + 1;
        const lastContentLine  = block.endLine - 1;
        const startPos = new vscode.Position(firstContentLine, 0);
        const endPos   = new vscode.Position(lastContentLine, doc.lineAt(lastContentLine).text.length);
        const range    = new vscode.Range(startPos, endPos);

        await editor.edit(editBuilder => {
            editBuilder.replace(range, formattedCode);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
