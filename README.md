# PromptPad

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85+-blue.svg)](https://code.visualstudio.com/)
[![Cursor](https://img.shields.io/badge/Cursor-0.40+-purple.svg)](https://cursor.com/)

> A real prompt editor for Claude in Cursor and VS Code.

![PromptPad Demo](docs/assets/hero.gif)

---

## The Problem

Cursor's built-in AI input is a single-line text field. Writing detailed, multi-paragraph prompts means fighting a tiny box with no editing tools, no history, and no way to see what context you're sending. One wrong keypress and your carefully crafted prompt is gone.

## The Solution

PromptPad gives you a **full-featured prompt editor** — right inside your IDE. Write multiline prompts, browse your history, attach file context, and send to Claude with `Cmd+Enter`.

### Features

- **Multiline editor** — Write and edit prompts in a real text area with word wrap and auto-resize
- **Send with a shortcut** — `Cmd+Enter` (macOS) or `Ctrl+Enter` (Windows/Linux) sends your prompt instantly
- **Prompt history** — Every prompt is saved automatically. Browse, search, and reuse past prompts
- **Auto-save drafts** — Never lose work. Your in-progress prompt is saved continuously
- **Tagging** — Organize prompts with custom tags and filter your history
- **Context builder** — Attach the active file, selection, or open file list with toggle buttons. See a token estimate before sending
- **Composer mode** — Open a distraction-free, full-width prompt editor when you need more space

---

## Quick Start

1. **Install** PromptPad from the VS Code Marketplace (or install the `.vsix` file locally)
2. **Open** PromptPad with `Cmd+Alt+P` (or click the pencil icon in the Activity Bar)
3. **Write** your prompt and press `Cmd+Enter` to send it to Claude

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+Alt+P` / `Ctrl+Alt+P` | Open PromptPad sidebar |
| `Cmd+Alt+M` / `Ctrl+Alt+M` | Open Composer mode (full-width editor tab) |
| `Cmd+Enter` / `Ctrl+Enter` | Send prompt to Claude |
| `Escape` | Clear the editor |

---

## Requirements

- **Cursor** 0.40+ or **VS Code** 1.85+
- Node.js 18+ (for development only)

---

## Documentation

| Document | Description |
|---|---|
| [Product Spec](docs/PRODUCT_SPEC.md) | User stories, personas, and requirements |
| [Architecture](docs/ARCHITECTURE.md) | Technical design, components, and data flow |
| [Development](docs/DEVELOPMENT.md) | Setup, building, debugging, and testing |
| [Roadmap](docs/ROADMAP.md) | Development phases and milestones |
| [Contributing](CONTRIBUTING.md) | How to contribute |
| [Changelog](CHANGELOG.md) | Release history |

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
