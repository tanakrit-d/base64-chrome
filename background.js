chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "encodeBase64Clipboard",
        title: "Encode to Base64",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "decodeBase64Clipboard",
        title: "Decode from Base64",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;

    if (info.menuItemId === "encodeBase64Clipboard") {
        try {
            const encodedText = btoa(selectedText);
            addToClipboard(encodedText);
        } catch (e) {
            console.error("Base64 encode error:");
            console.error(e)
        }
    } else if (info.menuItemId === "decodeBase64Clipboard") {
        try {
            const decodedText = atob(selectedText);
            addToClipboard(decodedText);
        } catch (e) {
            console.error("Base64 decode error:");
            console.error(e)
        }
    }
});

async function addToClipboard(value) {
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: [chrome.offscreen.Reason.CLIPBOARD],
        justification: 'Write text to the clipboard.'
    });

    chrome.runtime.sendMessage({
        type: 'copy-data-to-clipboard',
        target: 'offscreen-doc',
        data: value
    });
}