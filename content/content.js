let state = {
    isOn: false,
    opacity: 0.85,
    animation: "pulse"
};

let mask = null;
let ani = null;

function setState(newState) {
    state.isOn = newState;
    render();

    chrome.storage.local.set({
        screenVeil: state
    });
}

function render() {
    if (state.isOn) {
        if (!mask) createMask();
        if (!ani) createAnimation();
    } else {
        removeMask();
        removeAnimation();
    }
}

function createMask() {
    mask = document.createElement("div");
    mask.id = "screen-veil-mask";
    document.body.appendChild(mask);

    requestAnimationFrame(() => {
        mask.style.opacity = state.opacity ?? 0.85;
    });
}

function removeMask() {
    if (!mask) return;
    mask.remove();
    mask = null;
}

function createAnimation() {
    ani = document.createElement("div");
    ani.id = "screen-veil-animation";
    document.body.appendChild(ani);

    if (state.animation === "pulse") {
        ani.style.display = "block";
    }
}

function removeAnimation() {
    if (!ani) return;
    ani.remove();
    ani = null;
}

// ESC 關閉
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.isOn) {
        setState(false);
    }
});

// popup 通訊
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggle") {
        setState(!state.isOn);
        sendResponse({ isOn: state.isOn });
    }

    if (msg.action === "getState") {
        sendResponse({ isOn: state.isOn });
    }
});

// 初始化
chrome.storage.local.get(["screenVeil"], (result) => {
    if (result.screenVeil) {
        state = result.screenVeil;
    }
    render();

    console.log("content script loaded");
});