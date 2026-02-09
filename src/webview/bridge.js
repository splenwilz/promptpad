// @ts-check

/** @type {ReturnType<typeof acquireVsCodeApi>} */
const vscode = acquireVsCodeApi();

/** @type {((result: {success: boolean, method: string}) => void) | null} */
let onPromptSentCallback = null;

/**
 * Send a prompt to the extension host.
 * @param {string} content
 */
function sendPrompt(content) {
    vscode.postMessage({
        type: 'sendPrompt',
        payload: {
            content: content,
            tags: [],
            context: [],
        },
    });
}

/**
 * Register a callback for when a prompt is sent.
 * @param {(result: {success: boolean, method: string}) => void} callback
 */
function onPromptSent(callback) {
    onPromptSentCallback = callback;
}

// Listen for messages from the extension host
window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'promptSent' && onPromptSentCallback) {
        onPromptSentCallback(message.payload);
    }
});
