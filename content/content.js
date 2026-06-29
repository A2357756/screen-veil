chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggle") {
    console.log("收到 toggle 訊息");
    }
});
console.log("content script loaded");