# Contributing to PromptPad

Thank you for your interest in contributing to PromptPad! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/promptpad.git`
3. Follow the setup instructions in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
4. Create a feature branch: `git checkout -b feat/your-feature-name`

## Development Workflow

1. Read the [Architecture](docs/ARCHITECTURE.md) doc to understand how the extension is structured
2. Check the [Roadmap](docs/ROADMAP.md) for planned features
3. Make your changes
4. Write or update tests
5. Run the test suite: `npm test`
6. Submit a pull request

## Branch Naming

Use the following prefixes:

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring (no behavior change) |
| `test/` | Adding or updating tests |
| `chore/` | Build, CI, tooling changes |

Examples: `feat/prompt-history`, `fix/draft-restore-on-reopen`, `docs/update-readme`

## Commit Messages

Write clear, concise commit messages:

- Use the imperative mood: "Add history search" not "Added history search"
- Keep the subject line under 72 characters
- Reference related issues: "Fix draft auto-save timing (#42)"

## Pull Request Process

1. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely
2. Ensure all tests pass
3. Keep PRs focused — one feature or fix per PR
4. Update documentation if your change affects user-facing behavior
5. Add an entry to `CHANGELOG.md` under `[Unreleased]`

## What to Contribute

- **Good first issues:** Look for issues labeled `good first issue`
- **Bug reports:** Found a bug? Open an issue using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- **Feature requests:** Have an idea? Open an issue using the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- **Documentation:** Improvements to docs are always welcome

## Code Style

- TypeScript for extension host code
- Vanilla HTML/CSS/JS for WebView code (no frameworks)
- Use VS Code CSS variables for all colors in WebView styles
- Follow existing patterns in the codebase

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Questions?

Open a GitHub issue or start a discussion. We're happy to help!
