const switchEl = document.getElementById("switch");
const statusText = document.getElementById("status");

let isOn = false;


// 同步 content 狀態
function syncState() {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab) return;
        chrome.tabs.sendMessage(
            tab.id,
            { action: "getState" },
            (res) => {

                // ① Chrome extension 通訊失敗（content script 不存在 / 未載入）
                if (chrome.runtime.lastError || !res) {
                    isOn = false;
                    updateUI();
                    return;
                }

                // ② 正常拿到 state
                isOn = res.isOn;
                updateUI();
            }
        );
    });
}

// 點擊切換
switchEl.addEventListener("click", () => {

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {

        chrome.tabs.sendMessage(tab.id, { action: "toggle" }, (res) => {

            if (chrome.runtime.lastError || !res) return;

            isOn = res.isOn;
            updateUI();
        });
    });
});

// UI 更新
function updateUI() {
    if (isOn) {
        switchEl.classList.add("on");
        statusText.textContent = "Status: ON";
    } else {
        switchEl.classList.remove("on");
        statusText.textContent = "Status: OFF";
    }
}

// 初始化
syncState();