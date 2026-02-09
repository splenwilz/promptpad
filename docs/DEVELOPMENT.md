# PromptPad — Development Guide

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Comes with Node.js |
| VS Code or Cursor | VS Code 1.85+ / Cursor 0.40+ | For running and debugging the extension |
| Git | 2.30+ | For version control |

---

## Project Setup

```bash
# Clone the repository
git clone https://github.com/your-org/promptpad.git
cd promptpad

# Install dependencies
npm install

# Open in VS Code / Cursor
code .
```

---

## Building

```bash
# Compile TypeScript
npm run compile

# Watch mode (recompiles on file changes)
npm run watch
```

The `compile` script runs `tsc -p ./` and outputs to the `out/` directory. WebView assets (`src/webview/`) are copied as-is (no build step).

---

## Running & Debugging

### Launch the Extension in Development

1. Open the project in VS Code or Cursor
2. Press `F5` (or **Run > Start Debugging**)
3. This launches a new **Extension Development Host** window with PromptPad loaded
4. Open the command palette (`Cmd+Shift+P`) and run **PromptPad: Open**

### Debug Configuration

The project includes a `.vscode/launch.json` with two configurations:

- **Run Extension** — Launches the Extension Development Host
- **Extension Tests** — Runs the test suite with the VS Code test runner

### Hot Reload

- **TypeScript changes:** The watch task (`npm run watch`) recompiles automatically. Reload the Extension Development Host window (`Cmd+R`) to pick up changes.
- **WebView changes (HTML/CSS/JS):** Close and reopen the PromptPad panel. WebView content is loaded fresh each time the panel is created.

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
test/
├── commands/
│   ├── bridge.test.ts
│   └── clipboardFallback.test.ts
├── context/
│   ├── contextProvider.test.ts
│   └── tokenEstimator.test.ts
├── storage/
│   ├── historyStore.test.ts
│   └── draftStore.test.ts
└── extension.test.ts
```

### Testing Guidelines

- Unit tests use the VS Code test runner (`@vscode/test-electron`)
- Mock the `vscode` API using `@vscode/test-electron` stubs
- Test the message protocol by simulating `postMessage` calls
- Storage tests should verify persistence across simulated restarts
- Aim for coverage of all message types in the protocol

---

## WebView Development

The WebView UI is built with vanilla HTML, CSS, and JavaScript (no framework, no build step).

### File Locations

```
src/webview/
├── index.html      # Panel HTML shell
├── styles.css      # Styles using VS Code CSS variables
├── editor.js       # Prompt editor logic
├── history.js      # History list rendering
├── context.js      # Context builder UI
└── bridge.js       # postMessage communication wrapper
```

### Theme Integration

Use VS Code's built-in CSS variables for all colors:

```css
/* Do this */
background: var(--vscode-editor-background);
color: var(--vscode-editor-foreground);
border: 1px solid var(--vscode-panel-border);

/* Don't do this */
background: #1e1e1e;
color: #d4d4d4;
```

This ensures PromptPad looks correct in light, dark, and high-contrast themes without any custom theme detection.

### Debugging the WebView

1. Open PromptPad in the Extension Development Host
2. Open the command palette and run **Developer: Open Webview Developer Tools**
3. This opens Chrome DevTools for the WebView — inspect elements, debug JS, check network/console

### Content Security Policy

The WebView enforces a strict CSP. When adding new assets:

- Scripts must use a nonce attribute (`nonce="${nonce}"`)
- Styles must be loaded from `${webview.cspSource}`
- No inline styles or scripts
- No external URLs

---

## Packaging & Publishing

### Package the Extension

```bash
# Install vsce (VS Code Extension CLI)
npm install -g @vscode/vsce

# Package as .vsix
vsce package
```

This creates a `promptpad-x.x.x.vsix` file that can be installed locally:

```bash
code --install-extension promptpad-0.1.0.vsix
```

### Publish to Marketplace

```bash
# Login to your publisher account
vsce login <publisher-name>

# Publish
vsce publish
```

Before publishing:
- Update `version` in `package.json`
- Update `CHANGELOG.md` with release notes
- Ensure `.vscodeignore` excludes dev files (`test/`, `src/`, `.github/`, `docs/`, `node_modules/`)
- Verify package size is under 500 KB: `vsce ls` shows included files

### .vscodeignore

```
.github/
docs/
src/
test/
node_modules/
.vscode/
*.ts
tsconfig.json
.gitignore
CONTRIBUTING.md
CODE_OF_CONDUCT.md
```

---

## Useful Commands Reference

| Command | Description |
|---|---|
| `npm run compile` | Compile TypeScript to `out/` |
| `npm run watch` | Compile on file changes |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests on file changes |
| `vsce package` | Build `.vsix` package |
| `vsce publish` | Publish to VS Code Marketplace |
| `F5` (in VS Code) | Launch Extension Development Host |
