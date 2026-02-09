# PromptPad — Roadmap

## Phase 1: Foundation (Weeks 1-2) → v0.1.0

**Goal:** A working extension that opens a multiline prompt editor and sends prompts to Claude.

- [ ] Extension scaffold (`package.json`, `tsconfig.json`, activation events)
- [ ] WebView panel with multiline textarea
- [ ] Auto-resize editor as content grows
- [ ] `Cmd+Enter` / `Ctrl+Enter` to send prompt
- [ ] Command bridge: deliver prompt via Cursor commands
- [ ] Clipboard fallback when direct command access fails
- [ ] Basic CSP and security setup
- [ ] Unit tests for command bridge and clipboard fallback

**Milestone:** User can open PromptPad, write a multiline prompt, and send it to Claude.

---

## Phase 2: History & Drafts (Weeks 3-4) → v0.2.0

**Goal:** Prompts are saved, searchable, and never lost.

- [ ] Auto-save prompt history on send (Memento API)
- [ ] History panel with reverse-chronological list
- [ ] Click to restore a history entry into the editor
- [ ] Auto-save drafts every 2 seconds (debounced)
- [ ] Restore last draft on panel reopen
- [ ] Tag prompts with user-defined labels
- [ ] Filter history by tag
- [ ] Free-text search across prompt content
- [ ] Composer mode (full-width editor tab)
- [ ] Unit tests for storage layer

**Milestone:** User can browse, search, and tag their prompt history. Drafts survive unexpected closures.

---

## Phase 3: Context Builder (Weeks 5-6) → v0.3.0

**Goal:** Users can attach relevant context to prompts with visibility into what Claude will see.

- [ ] Context toggle buttons (active file, selection, open files)
- [ ] Context preview pane showing attached content
- [ ] Token estimation display (`chars / 4` heuristic)
- [ ] Context prepended to prompt on send
- [ ] Record which context sources were used in history entries
- [ ] Unit tests for context provider and token estimator

**Milestone:** User can attach file context, see a preview with token count, and send enriched prompts.

---

## Phase 4: Polish & Launch (Weeks 7-8) → v1.0.0

**Goal:** Production-ready extension published on the VS Code Marketplace.

- [ ] End-to-end testing across VS Code and Cursor
- [ ] Keyboard accessibility audit (all controls navigable, ARIA labels)
- [ ] Performance profiling (panel open <500ms, history render with 500+ entries)
- [ ] `.vscodeignore` optimization (package <500KB)
- [ ] Demo video / GIF for README and Marketplace listing
- [ ] Marketplace metadata (icon, description, categories, tags)
- [ ] Publish to VS Code Marketplace
- [ ] GitHub release with changelog

**Milestone:** v1.0.0 is live on the Marketplace with documentation, demo, and a clean listing.

---

## Future Wishlist (Unscheduled)

These items are out of scope for v1.0 but may be explored in future releases:

- **Prompt templates:** Pre-built and user-created templates for common tasks
- **Cloud sync:** Optional sync of prompt history across devices
- **Team library:** Shared prompt collections for teams
- **Multi-model support:** Send prompts to models other than Claude
- **Syntax highlighting:** Code highlighting within the prompt editor
- **Prompt chaining:** Compose multi-step prompt workflows
- **Export/import:** Export history as JSON/Markdown, import from other tools
