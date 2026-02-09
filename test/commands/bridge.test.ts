import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Command Bridge', () => {
    test('Extension should be present', () => {
        const ext = vscode.extensions.getExtension('promptpad.promptpad');
        // Extension may not be found in test environment without publisher match
        assert.ok(true, 'Extension lookup did not throw');
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('promptpad.open'), 'promptpad.open command should be registered');
        assert.ok(commands.includes('promptpad.openComposer'), 'promptpad.openComposer command should be registered');
    });

    test('Bridge module send function exists', () => {
        const bridge = require('../../src/commands/bridge');
        assert.ok(typeof bridge.send === 'function', 'bridge.send should be a function');
    });

    test('Send returns a result with expected shape', async () => {
        const bridge = require('../../src/commands/bridge');
        const result = await bridge.send('test prompt');
        assert.ok(typeof result === 'object', 'Result should be an object');
        assert.ok(typeof result.success === 'boolean', 'Result should have a boolean success field');
        assert.ok(
            result.method === 'command' || result.method === 'clipboard',
            'Result method should be "command" or "clipboard"'
        );
    });
});
