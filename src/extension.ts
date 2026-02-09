import * as vscode from 'vscode';
import * as bridge from './commands/bridge';

class PromptPadViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'promptpad.sidebarView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'src', 'webview')
            ],
        };

        webviewView.webview.html = getWebviewContent(webviewView.webview, this._extensionUri);

        webviewView.webview.onDidReceiveMessage(async (message: { type: string; payload?: { content?: string } }) => {
            if (message.type === 'sendPrompt' && message.payload?.content) {
                const result = await bridge.send(message.payload.content);
                webviewView.webview.postMessage({
                    type: 'promptSent',
                    payload: result,
                });
            }
        });
    }
}

let currentPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    // Register the sidebar view provider
    const sidebarProvider = new PromptPadViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(PromptPadViewProvider.viewType, sidebarProvider)
    );

    // Register the "Open" command — reveals the sidebar view
    const openCommand = vscode.commands.registerCommand('promptpad.open', () => {
        vscode.commands.executeCommand('promptpad.sidebarView.focus');
    });

    // Register the "Open Composer" command — opens PromptPad as a full-width editor tab
    const composerCommand = vscode.commands.registerCommand('promptpad.openComposer', () => {
        showPanel(context, vscode.ViewColumn.One);
    });

    context.subscriptions.push(openCommand, composerCommand);
}

function showPanel(context: vscode.ExtensionContext, viewColumn: vscode.ViewColumn) {
    if (currentPanel) {
        currentPanel.reveal(viewColumn);
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'promptpad',
        'PromptPad',
        viewColumn,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'src', 'webview')
            ],
            retainContextWhenHidden: true,
        }
    );

    currentPanel.webview.html = getWebviewContent(currentPanel.webview, context.extensionUri);

    currentPanel.webview.onDidReceiveMessage(
        async (message: { type: string; payload?: { content?: string } }) => {
            if (message.type === 'sendPrompt' && message.payload?.content) {
                const result = await bridge.send(message.payload.content);
                currentPanel?.webview.postMessage({
                    type: 'promptSent',
                    payload: result,
                });
            }
        },
        undefined,
        context.subscriptions
    );

    currentPanel.onDidDispose(
        () => { currentPanel = undefined; },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const webviewUri = vscode.Uri.joinPath(extensionUri, 'src', 'webview');

    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'styles.css'));
    const editorUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'editor.js'));
    const bridgeUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewUri, 'bridge.js'));

    const nonce = getNonce();
    const cspSource = webview.cspSource;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${cspSource}; script-src 'nonce-${nonce}'; font-src ${cspSource};">
    <link rel="stylesheet" href="${stylesUri}">
    <title>PromptPad</title>
</head>
<body>
    <div class="header">
        <span class="header-title">PromptPad</span>
        <span class="header-badge">v0.1</span>
    </div>

    <div class="promptpad-container">
        <div class="editor-wrapper">
            <textarea
                id="promptEditor"
                placeholder="Describe what you want Claude to do..."
                spellcheck="false"
            ></textarea>
            <div class="editor-footer">
                <div class="editor-meta">
                    <span class="char-count" id="charCount">0 chars</span>
                </div>
                <button class="send-button" id="sendButton">
                    <span class="btn-text">Send <span class="shortcut">&#8984;&#9166;</span></span>
                    <span class="btn-loading"><span class="spinner"></span> Sending</span>
                </button>
            </div>
        </div>

        <div class="status-bar">
            <span class="status" id="status"></span>
        </div>

        <div class="hints">
            <div class="hint-row">
                <span class="hint-label">Send prompt</span>
                <span class="hint-key">&#8984; Enter</span>
            </div>
            <div class="hint-row">
                <span class="hint-label">Clear editor</span>
                <span class="hint-key">Esc</span>
            </div>
            <div class="hint-row">
                <span class="hint-label">Open PromptPad</span>
                <span class="hint-key">&#8984;&#8997;P</span>
            </div>
            <div class="hint-row">
                <span class="hint-label">Composer mode</span>
                <span class="hint-key">&#8984;&#8997;M</span>
            </div>
        </div>
    </div>

    <script nonce="${nonce}" src="${bridgeUri}"></script>
    <script nonce="${nonce}" src="${editorUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {
    if (currentPanel) {
        currentPanel.dispose();
    }
}
