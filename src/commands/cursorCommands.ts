import * as vscode from 'vscode';

const SHELL_NAMES = ['zsh', 'bash', 'sh', 'fish', 'powershell', 'pwsh', 'cmd', 'node', 'python'];

/**
 * Send a prompt to the terminal running Claude Code.
 * Prefers a terminal with "claude" in the name.
 * If the target looks like a raw shell, asks for confirmation to prevent
 * accidental command execution.
 */
export async function send(content: string): Promise<void> {
    const terminals = vscode.window.terminals;

    if (terminals.length === 0) {
        throw new Error('No open terminal. Open a terminal and run "claude" first.');
    }

    // Prefer a terminal with "claude" in the name
    let target: vscode.Terminal | undefined;
    for (const terminal of terminals) {
        if (terminal.name.toLowerCase().includes('claude')) {
            target = terminal;
            break;
        }
    }

    // Otherwise use the active terminal, with a safety check
    if (!target) {
        target = vscode.window.activeTerminal ?? terminals[terminals.length - 1];

        // If the terminal looks like a raw shell, confirm before sending
        const name = target.name.toLowerCase();
        const isShell = SHELL_NAMES.some(s => name === s || name.includes(s));

        if (isShell) {
            const choice = await vscode.window.showWarningMessage(
                `The active terminal "${target.name}" looks like a shell, not Claude. ` +
                `Sending your prompt there will execute it as a shell command. Continue?`,
                { modal: true },
                'Send Anyway'
            );

            if (choice !== 'Send Anyway') {
                throw new Error('Cancelled — open a Claude terminal and try again.');
            }
        }
    }

    target.show();
    await sleep(200);
    target.sendText(content, true);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
