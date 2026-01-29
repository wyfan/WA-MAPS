/**
 * Counter Pad（ESM 版）
 * - 直接由 WA 的 script 載入這支檔案（.mjs）
 * - 在檔案內 import scripting-api-extra
 */

// 1) 先載入 extra（用 WA 常用的 unpkg 網域，通常較不會被 CSP 擋）
import "https://unpkg.com/@workadventure/scripting-api-extra@^1/dist/bundle.js";

// 2) 接下來就是你的計數邏輯（跟你原本 counter-script.js 幾乎一樣）
const PLAYER_COUNT_KEY = "counterPadCount";
const ZONE_LAYER = "counterZone";
const POPUP_ANCHOR = "counterPopupAnchor";

let currentPopup = null;

function closePopupIfAny() {
  if (currentPopup) {
    currentPopup.close();
    currentPopup = null;
  }
}

function getPlayerCount() {
  const raw = WA.player.state[PLAYER_COUNT_KEY];
  return typeof raw === "number" ? raw : 0;
}

async function setPlayerCount(value) {
  await WA.player.state.saveVariable(PLAYER_COUNT_KEY, value, {
    public: false,
    persist: true,
    scope: "room",
  });
}

function openCounterPopup(count) {
  closePopupIfAny();

  const popup = WA.ui.openPopup(
    POPUP_ANCHOR,
    `你已踩到這個踏板：${count} 次`,
    [
      {
        label: "Reset",
        className: "warning",
        callback: async () => {
          await setPlayerCount(0);
          openCounterPopup(0);
        },
      },
      { label: "Close", className: "primary", callback: closePopupIfAny },
    ]
  );

  currentPopup = popup;
}

WA.onInit().then(() => {
  console.log("[CounterScript] ready (mjs)");

  WA.room.onEnterLayer(ZONE_LAYER).subscribe(async () => {
    const next = getPlayerCount() + 1;
    await setPlayerCount(next);
    openCounterPopup(next);
  });

  WA.room.onLeaveLayer(ZONE_LAYER).subscribe(() => closePopupIfAny());
});
