// @ts-check

(function () {
    const editor = document.getElementById('promptEditor');
    const sendButton = document.getElementById('sendButton');
    const statusEl = document.getElementById('status');
    const charCount = document.getElementById('charCount');
    const container = document.querySelector('.promptpad-container');

    if (!editor || !sendButton || !statusEl || !charCount || !container) {
        console.error('PromptPad: Missing required DOM elements. editor=%o sendButton=%o status=%o charCount=%o container=%o',
            editor, sendButton, statusEl, charCount, container);
        return;
    }

    /** @type {HTMLTextAreaElement} */
    const textarea = /** @type {HTMLTextAreaElement} */ (editor);

    let isSending = false;

    // --- Character count ---
    function updateCharCount() {
        const len = textarea.value.length;
        const lines = textarea.value.split('\n').length;
        if (len === 0) {
            charCount.textContent = '0 chars';
        } else if (lines > 1) {
            charCount.textContent = len + ' chars \u00b7 ' + lines + ' lines';
        } else {
            charCount.textContent = len + ' chars';
        }
    }

    // --- Send prompt ---
    function handleSend() {
        const content = textarea.value.trim();
        if (!content || isSending) {
            return;
        }

        isSending = true;
        container.classList.add('loading');
        sendButton.setAttribute('disabled', 'true');
        statusEl.textContent = '';
        statusEl.className = 'status';

        sendPrompt(content);
    }

    // --- Handle response ---
    onPromptSent(function (result) {
        isSending = false;
        container.classList.remove('loading');
        sendButton.removeAttribute('disabled');

        if (result.success) {
            textarea.value = '';
            updateCharCount();
            var method = result.method === 'clipboard' ? ' (via clipboard)' : '';
            statusEl.textContent = '\u2713 Sent' + method;
            statusEl.className = 'status success';
        } else {
            statusEl.textContent = '\u2717 Failed to send';
            statusEl.className = 'status error';
        }

        // Clear status after 4 seconds
        setTimeout(function () {
            if (!isSending) {
                statusEl.textContent = '';
                statusEl.className = 'status';
            }
        }, 4000);
    });

    // --- Event listeners ---
    textarea.addEventListener('input', function () {
        updateCharCount();
    });

    textarea.addEventListener('keydown', function (e) {
        // Cmd+Enter (macOS) or Ctrl+Enter (Windows/Linux) to send
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSend();
            return;
        }

        // Escape to clear
        if (e.key === 'Escape') {
            textarea.value = '';
            updateCharCount();
            statusEl.textContent = '';
            statusEl.className = 'status';
        }
    });

    sendButton.addEventListener('click', handleSend);

    // --- Initialize ---
    updateCharCount();
    textarea.focus();
})();
