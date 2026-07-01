let mask = null;
let ani = null;
let state = {
    isOn: false,
    opacity: 0.85,
    animation: "pulse"
};


//創造遮罩函式
function createMask() {
    mask = document.createElement("div");
    mask.id = "screen-veil-mask";
    document.body.appendChild(mask);

    requestAnimationFrame(() => {
        mask.style.opacity = state.opacity;
    });
}


//關閉遮罩函式
function removeMask() {
    if (!mask) return;
    mask.remove();
    mask = null;
}


//動畫遮罩製造&移除
function createAnimation() {
    ani = document.createElement("div");
    ani.id = "screen-veil-animation";
    document.body.appendChild(ani);
}

function removeAnimation() {
    if (!ani) return;
    ani.remove();
    ani = null;
}

//更新狀態並同步 UI + storage
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
    // 存到 chrome storage
    chrome.storage.local.set({ screenVeil: isOn });
}

// ESC 關閉
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOn) {
        setState(false);
    }
});

//接收popup指令判斷回傳
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggle") {
        setState(!state.isOn);
        sendResponse({ isOn: state.isOn });
    }

    if (msg.action === "getState") {
        sendResponse({ isOn: state.isOn });
    }
});

// 初始化：讀取 storage 狀態
chrome.storage.local.get(["screenVeil"], (result) => {
    if (result.screenVeil) {
        state = result.screenVeil;
    }

    render();
});