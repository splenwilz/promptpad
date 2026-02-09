# PromptPad — Product Specification

## Vision

PromptPad replaces the single-line, terminal-style AI input in Cursor with a full-featured, editable prompt editor. It gives developers the space to compose, refine, and reuse detailed prompts — turning AI interaction from a chat afterthought into a first-class writing experience.

---

## User Personas

### 1. Alex — The Power Prompter

- **Role:** Senior full-stack developer
- **Behavior:** Writes detailed, multi-paragraph prompts with specific constraints, code references, and formatting instructions. Frequently revisits and iterates on previous prompts.
- **Pain point:** Cursor's single-line input forces cramped writing. No way to save, search, or reuse past prompts. Losing a long prompt to an accidental key press is a constant risk.
- **Goal:** A real editor for prompts — multiline, auto-saved, searchable history.

### 2. Jamie — The Iterative Learner

- **Role:** Junior developer, 1 year of experience
- **Behavior:** Sends short prompts, reads the response, then refines. Iterates 5-10 times per task. Often wants to go back to a prompt that worked well.
- **Pain point:** Can't scroll back through prompt history easily. Loses context between iterations. Doesn't know what context the AI is seeing.
- **Goal:** Quick iteration with visible history and context awareness.

---

## MVP User Stories

### US-1: Multiline Prompt Editing

> As a developer, I want to write and edit prompts in a real text editor so that I can compose detailed, multi-paragraph instructions.

**Acceptance Criteria:**
1. The prompt editor supports multiline text input with word wrap
2. Standard text editing shortcuts work (select all, undo/redo, copy/paste)
3. The editor resizes vertically as content grows (up to a configurable max height)
4. Line count is visible in the editor gutter

### US-2: Send Prompt to Claude

> As a developer, I want to send my prompt to Claude with a keyboard shortcut so that I can submit without reaching for the mouse.

**Acceptance Criteria:**
1. Pressing `Cmd+Enter` (macOS) or `Ctrl+Enter` (Windows/Linux) sends the prompt
2. The editor clears after successful submission
3. A loading indicator shows while the prompt is being delivered
4. If direct API access is unavailable, the extension falls back to clipboard-based delivery with a notification

### US-3: Prompt History

> As a developer, I want to browse my past prompts so that I can reuse or refine previous instructions.

**Acceptance Criteria:**
1. All sent prompts are saved automatically with a timestamp
2. A history panel lists past prompts in reverse chronological order
3. Clicking a history entry loads it into the editor for editing
4. History supports at least 500 entries without performance degradation
5. History persists across editor restarts (stored via VS Code Memento API)

### US-4: Auto-Save Drafts

> As a developer, I want my in-progress prompt to be auto-saved so that I never lose work if the editor closes unexpectedly.

**Acceptance Criteria:**
1. The current draft is saved automatically every 2 seconds (debounced)
2. On panel reopen, the last draft is restored
3. Draft storage is separate from prompt history

### US-5: Tag and Search Prompts

> As a developer, I want to tag and search my prompt history so that I can quickly find prompts for specific tasks.

**Acceptance Criteria:**
1. Users can add one or more tags to a prompt before or after sending
2. The history panel supports filtering by tag
3. Free-text search matches against prompt content
4. Search results update as the user types (debounced, <200ms perceived latency)

### US-6: Context Builder

> As a developer, I want to attach context (active file, selection, open tabs) to my prompt so that Claude has the information it needs.

**Acceptance Criteria:**
1. Toggle buttons let the user include: active file, current selection, list of open files
2. A context preview pane shows exactly what will be sent
3. An estimated token count is displayed based on attached context
4. Context is prepended to the prompt on submission

### US-7: Composer Mode

> As a developer, I want a distraction-free, full-width prompt editor so that I can focus on writing complex instructions.

**Acceptance Criteria:**
1. A "Composer" command opens the prompt editor in a full-width editor tab (not a side panel)
2. All features (send, history, context, tags) are available in Composer mode
3. The user can switch between panel mode and Composer mode without losing their draft

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| Panel open time | < 500 ms from command invocation to interactive editor |
| History capacity | 500+ entries with no perceptible lag on list render |
| Extension package size | < 500 KB (no bundled LLM, no heavy dependencies) |
| Network calls | Zero — all data stays local, no telemetry, no analytics |
| Offline support | Fully functional offline (prompt editing, history, drafts) |
| Accessibility | All interactive elements keyboard-navigable; ARIA labels on controls |

---

## Out of Scope (v1)

The following are explicitly **not** part of the MVP and will not be built until after v1.0:

- User accounts or authentication
- Cloud sync of prompts or settings
- Analytics or telemetry of any kind
- Syntax highlighting within the prompt editor
- Prompt templates or snippet library
- Multi-model support (only Claude via Cursor)
- Inline code completion within the prompt editor
- Collaborative/shared prompt libraries
