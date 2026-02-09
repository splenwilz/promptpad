import * as vscode from 'vscode';
import * as cursorCommands from './cursorCommands';
import * as clipboardFallback from './clipboardFallback';

export interface SendResult {
    success: boolean;
    method: 'command' | 'clipboard';
}

/**
 * Send a prompt to the Claude Code terminal. Tries sending directly first,
 * then falls back to clipboard-based delivery.
 */
export async function send(content: string): Promise<SendResult> {
    // Try primary strategy: send to Claude terminal
    try {
        await cursorCommands.send(content);
        return { success: true, method: 'command' };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        vscode.window.showWarningMessage(`PromptPad: ${message}. Trying clipboard fallback...`);
    }

    // Fallback strategy: clipboard-based delivery
    try {
        await clipboardFallback.send(content);
        return { success: true, method: 'clipboard' };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        vscode.window.showErrorMessage(`PromptPad: Could not send prompt. ${message}`);
        return { success: false, method: 'clipboard' };
    }
}
