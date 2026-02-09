import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Clipboard Fallback', () => {
    test('clipboardFallback module exports send function', () => {
        const fallback = require('../../src/commands/clipboardFallback');
        assert.ok(typeof fallback.send === 'function', 'clipboardFallback.send should be a function');
    });

    test('Clipboard API is accessible', async () => {
        const testValue = 'promptpad-test-' + Date.now();
        await vscode.env.clipboard.writeText(testValue);
        const read = await vscode.env.clipboard.readText();
        assert.strictEqual(read, testValue, 'Clipboard read should match what was written');
    });

    test('Fallback copies content to clipboard', async () => {
        const fallback = require('../../src/commands/clipboardFallback');
        const testContent = 'test-prompt-' + Date.now();
        await fallback.send(testContent);
        const clipboard = await vscode.env.clipboard.readText();
        assert.strictEqual(clipboard, testContent, 'Clipboard should contain the prompt');
    });
});
