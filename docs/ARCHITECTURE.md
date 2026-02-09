# PromptPad — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Cursor / VS Code                   │
│                                                         │
│  ┌──────────────┐    postMessage     ┌───────────────┐  │
│  │              │ ◄────────────────► │               │  │
│  │   WebView    │                    │   Extension   │  │
│  │   (Editor)   │                    │     Host      │  │
│  │              │                    │               │  │
│  └──────────────┘                    └───────┬───────┘  │
│                                              │          │
│                                   ┌──────────┴────────┐ │
│                                   │                   │ │
│                              ┌────┴────┐   ┌─────────┴┐│
│                              │ Storage │   │ Command  ││
│                              │ (Memento)│   │ Bridge   ││
│                              └─────────┘   └────┬─────┘│
│                                                  │      │
│                                          ┌───────┴────┐ │
│                                          │   Cursor   │ │
│                                          │  Commands  │ │
│                                          │  / Claude  │ │
│                                          └────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Data flow:**

1. User types a prompt in the **WebView** editor
2. On `Cmd+Enter`, the WebView sends a `sendPrompt` message to the **Extension Host** via `postMessage`
3. The Extension Host saves the prompt to **Storage** (Memento API)
4. The **Command Bridge** delivers the prompt to Claude via Cursor's built-in commands
5. If direct command access fails, the bridge falls back to **clipboard-based delivery**

---

## Component Breakdown

### 1. Extension Entry Point — `src/extension.ts`

Responsibilities:
- Register commands (`promptpad.open`, `promptpad.openComposer`, `promptpad.sendPrompt`)
- Create and manage the WebView panel
- Handle extension activation and deactivation
- Wire up the message bridge between WebView and host

Activation events:
- `onCommand:promptpad.open`
- `onCommand:promptpad.openComposer`

### 2. WebView Panel — `src/webview/`

```
src/webview/
├── index.html          # Panel shell, CSP meta tag, script/style refs
├── styles.css          # Editor styling, VS Code theme integration
├── editor.js           # Prompt editor logic (textarea, resize, key bindings)
├── history.js          # History list rendering and interaction
├── context.js          # Context builder toggle UI and preview
└── bridge.js           # postMessage wrapper for type-safe host communication
```

Responsibilities:
- Render the multiline prompt editor
- Handle keyboard shortcuts (Cmd+Enter to send, Escape to clear)
- Display prompt history list
- Show context builder toggles and preview
- Communicate with the extension host exclusively via `postMessage`

Theme integration:
- Uses VS Code CSS variables (`--vscode-editor-background`, `--vscode-editor-foreground`, etc.)
- No custom color values — fully adapts to light/dark/high-contrast themes

### 3. Message Protocol

All communication between WebView and Extension Host uses typed messages:

```typescript
// WebView → Host
interface SendPromptMessage {
  type: 'sendPrompt';
  payload: {
    content: string;
    tags: string[];
    context: ContextAttachment[];
  };
}

interface SaveDraftMessage {
  type: 'saveDraft';
  payload: { content: string };
}

interface LoadHistoryMessage {
  type: 'loadHistory';
  payload: { offset: number; limit: number };
}

interface SearchHistoryMessage {
  type: 'searchHistory';
  payload: { query: string; tags: string[] };
}

interface RestorePromptMessage {
  type: 'restorePrompt';
  payload: { historyId: string };
}

interface GetContextMessage {
  type: 'getContext';
  payload: { include: ContextSource[] };
}

// Host → WebView
interface HistoryDataMessage {
  type: 'historyData';
  payload: { entries: HistoryEntry[]; total: number };
}

interface DraftRestoredMessage {
  type: 'draftRestored';
  payload: { content: string };
}

interface ContextDataMessage {
  type: 'contextData';
  payload: {
    items: ContextItem[];
    estimatedTokens: number;
  };
}

interface PromptSentMessage {
  type: 'promptSent';
  payload: { success: boolean; method: 'command' | 'clipboard' };
}

// Shared types
type ContextSource = 'activeFile' | 'selection' | 'openFiles';

interface ContextAttachment {
  source: ContextSource;
  content: string;
}

interface ContextItem {
  source: ContextSource;
  label: string;
  preview: string;
  tokenEstimate: number;
}

interface HistoryEntry {
  id: string;
  content: string;
  tags: string[];
  timestamp: number;
  contextSources: ContextSource[];
}
```

### 4. Command Bridge — `src/commands/`

```
src/commands/
├── bridge.ts           # Main prompt delivery logic
├── cursorCommands.ts   # Cursor-specific command invocations
└── clipboardFallback.ts # Clipboard-based fallback strategy
```

**Primary strategy:** Execute Cursor's built-in command to submit a prompt programmatically.

**Fallback strategy (clipboard):**
1. Copy the prompt to the system clipboard
2. Execute Cursor's "open chat" command
3. Execute a paste command
4. Execute a submit command
5. Restore the user's original clipboard content
6. Notify the user that clipboard fallback was used

> **Why a fallback?** Cursor's extension API is not fully documented. If direct command access breaks in a Cursor update, the clipboard method keeps the extension functional while a fix is developed.

### 5. Storage Layer — `src/storage/`

```
src/storage/
├── historyStore.ts     # CRUD operations for prompt history
├── draftStore.ts       # Auto-save draft management
└── schema.ts           # TypeScript interfaces for stored data
```

**Storage backend:** VS Code's `ExtensionContext.globalState` (Memento API)

Why Memento over file storage:
- No file permission issues
- Automatic serialization/deserialization
- Survives extension updates
- No need to manage file paths across platforms

Why Memento over WebView `localStorage`:
- WebView `localStorage` is scoped to the WebView instance and is **not** persisted reliably across panel closes
- Memento persists across restarts, updates, and workspace changes

**Schema:**

```typescript
// Key: 'promptpad.history'
interface HistoryStore {
  entries: HistoryEntry[];  // Newest first
  version: 1;
}

// Key: 'promptpad.draft'
interface DraftStore {
  content: string;
  updatedAt: number;
}
```

### 6. Context Builder — `src/context/`

```
src/context/
├── contextProvider.ts  # Reads active editor, selection, open files
├── tokenEstimator.ts   # Simple character-based token estimation
└── contextFormatter.ts # Formats context for prompt prepending
```

Context sources:
- **Active file:** Full contents of `vscode.window.activeTextEditor.document`
- **Selection:** `vscode.window.activeTextEditor.selection` text
- **Open files:** List of file paths from `vscode.window.tabGroups`

Token estimation:
- Uses a simple heuristic: `Math.ceil(charCount / 4)` (roughly accurate for English text and code)
- Displayed as an estimate, not an exact count

---

## Proposed Directory Structure

```
promptpad/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── assets/
│   │   └── hero.gif            # Demo GIF placeholder
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── PRODUCT_SPEC.md
│   └── ROADMAP.md
├── src/
│   ├── commands/
│   │   ├── bridge.ts
│   │   ├── cursorCommands.ts
│   │   └── clipboardFallback.ts
│   ├── context/
│   │   ├── contextProvider.ts
│   │   ├── tokenEstimator.ts
│   │   └── contextFormatter.ts
│   ├── storage/
│   │   ├── historyStore.ts
│   │   ├── draftStore.ts
│   │   └── schema.ts
│   ├── webview/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── editor.js
│   │   ├── history.js
│   │   ├── context.js
│   │   └── bridge.js
│   └── extension.ts
├── test/
│   ├── commands/
│   ├── context/
│   ├── storage/
│   └── extension.test.ts
├── .gitignore
├── .vscodeignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
└── tsconfig.json
```

---

## Security Considerations

### Content Security Policy (CSP)

The WebView HTML sets a strict CSP:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'none';
    style-src ${webview.cspSource};
    script-src 'nonce-${nonce}';
    font-src ${webview.cspSource};">
```

- No `unsafe-inline` or `unsafe-eval`
- Scripts loaded only with a per-render nonce
- No external network requests allowed

### Local Resource Roots

```typescript
panel.webview.options = {
  enableScripts: true,
  localResourceRoots: [
    vscode.Uri.joinPath(context.extensionUri, 'src', 'webview')
  ]
};
```

### No Network Calls

The extension makes **zero** network requests. All data stays on the user's machine. No telemetry, no analytics, no update checks beyond what VS Code provides natively.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| UI approach | WebView panel | TreeView is too limited for a rich text editor; WebView gives full HTML/CSS/JS control |
| Storage backend | Memento API (`globalState`) | Reliable cross-platform persistence without file management overhead |
| Prompt delivery | Command execution + clipboard fallback | Maximizes compatibility with Cursor's evolving API surface |
| Token estimation | Character-based heuristic (`chars / 4`) | Good enough for a preview; avoids bundling a tokenizer library |
| Theme integration | VS Code CSS variables | Zero-config theme support for light, dark, and high-contrast modes |
| WebView framework | Vanilla HTML/CSS/JS | Keeps the extension lightweight (<500KB); no build step for WebView assets |
