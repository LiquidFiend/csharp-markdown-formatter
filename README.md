# C# Markdown Code Block Formatter

Formats C# fenced code blocks in Markdown files — without touching anything outside the block.

The VS Code C# extension provides full language server formatting for `.cs` files, but that formatting doesn't reach into code blocks embedded in Markdown. This extension fills that gap.

---

## Usage

1. Place your cursor **anywhere inside** a ` ```csharp ` or ` ```cs ` block
2. Press **Ctrl+Shift+Alt+F** (Windows/Linux) or **Cmd+Shift+Alt+F** (Mac)

Or open the Command Palette (`Ctrl+Shift+P`) and run **Format C# Code Block**.

---

## Before & After

**Before:**

```csharp
public class Order {
public string Id { get; set; }
public List<OrderLine> Lines { get; set; }
public decimal Total() {
decimal sum = 0;
foreach (var line in Lines) {
sum += line.Quantity * line.UnitPrice;
}
return sum;
}
}
```

**After:**

```csharp
public class Order {
	public string Id { get; set; }
	public List<OrderLine> Lines { get; set; }
	public decimal Total() {
		decimal sum = 0;
		foreach (var line in Lines) {
			sum += line.Quantity * line.UnitPrice;
		}
		return sum;
	}
}
```

---

## Configuration

Both settings are available in the VS Code Settings UI under **C# Markdown Formatter**, or in your `settings.json`:

| Setting | Options | Default | Description |
|---|---|---|---|
| `csharpMarkdown.indentStyle` | `"tabs"` / `"spaces"` | `"tabs"` | Whether to indent with tabs or spaces |
| `csharpMarkdown.indentSize` | 1–8 | `4` | Spaces per indent level (ignored when using tabs) |

**Example — switch to 2-space indentation:**

```json
"csharpMarkdown.indentStyle": "spaces",
"csharpMarkdown.indentSize": 2
```

---

## What it formats

- Brace indentation (`{` / `}`) and nesting
- Preserves blank lines
- Ignores braces inside strings and `//` line comments
- Ignores braces inside `/* */` block comments
- Ignores braces inside verbatim strings (`@"..."`)

## Known limitations

- Does not reformat spacing within a line (e.g. around operators) — indentation only
- Multi-line interpolated strings containing `{` or `}` may confuse the indenter
- Not a full language parser; complex edge cases may need manual correction

---

## Notes

This extension does not require the C# Dev Kit or any other extension. It works entirely through the VS Code API with no external dependencies.

> This extension was developed with AI assistance. Contributions and bug reports welcome.
