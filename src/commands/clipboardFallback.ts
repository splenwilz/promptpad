import * as vscode from 'vscode';

/**
 * Fallback: copy the prompt to the clipboard so the user can paste it manually.
 * This avoids race conditions with trying to auto-paste into unknown chat panels.
 */
export async function send(content: string): Promise<void> {
    await vscode.env.clipboard.writeText(content);
    vscode.window.showInformationMessage(
        'PromptPad: Prompt copied to clipboard. Paste it into your Claude chat.',
        'OK'
    );
}
