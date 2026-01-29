/**
 * Counter Pad 練習腳本（純 JS 版）
 *
 * 條件：
 * - 地圖中有一個 layer 叫做 "counterZone"
 * - 地圖中有一個 rectangle object 叫做 "counterPopupAnchor"
 *
 * 行為：
 * - 玩家進入 counterZone → 個人計數 +1
 * - 顯示 popup
 * - 可 Reset 歸零
 */

// ===== 基本設定 =====
const PLAYER_COUNT_KEY = "counterPadCount";
const ZONE_LAYER = "counterZone";
const POPUP_ANCHOR = "counterPopupAnchor";

let currentPopup = null;

// ===== 小工具 =====
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
      {
        label: "Close",
        className: "primary",
        callback: closePopupIfAny,
      },
    ]
  );

  currentPopup = popup;
}

// ===== 主流程 =====
WA.onInit().then(() => {
  console.log("[CounterScript] ready");

  WA.room.onEnterLayer(ZONE_LAYER).subscribe(async () => {
    const current = getPlayerCount();
    const next = current + 1;

    await setPlayerCount(next);
    openCounterPopup(next);
  });

  WA.room.onLeaveLayer(ZONE_LAYER).subscribe(() => {
    closePopupIfAny();
  });
});
