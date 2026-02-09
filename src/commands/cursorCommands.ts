import * as vscode from 'vscode';

/**
 * Send a prompt to the Claude Code terminal.
 * Finds a terminal running Claude and sends the prompt text to it.
 * Throws if no Claude terminal is found.
 */
export async function send(content: string): Promise<void> {
    const claudeTerminal = findClaudeTerminal();

    if (!claudeTerminal) {
        throw new Error('No Claude terminal found. Open a terminal and run "claude" first.');
    }

    claudeTerminal.show();
    await sleep(200);
    claudeTerminal.sendText(content, true);
}

/**
 * Find a terminal that's running Claude Code.
 * Only returns a terminal that explicitly has "claude" in its name.
 * Does NOT fall back to the active terminal to avoid sending prompts
 * to unrelated shells.
 */
function findClaudeTerminal(): vscode.Terminal | undefined {
    const terminals = vscode.window.terminals;

    for (const terminal of terminals) {
        const name = terminal.name.toLowerCase();
        if (name.includes('claude')) {
            return terminal;
        }
    }

    return undefined;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
