# WorkAdventure 自定義腳本練習 - 計數器範例

## 📚 學習目標

1. 理解 WorkAdventure Scripting API 的基本結構
2. 學會在 Tiled 中設置自定義屬性
3. 實作一個簡單的互動計數器
4. 理解狀態管理(State Management)

---

## 🎯 專案設想:踩踏計數器

**功能描述:**
- 玩家踩上特定區域時,計數器 +1
- 顯示目前的踩踏次數
- (進階)可以設置目標次數,達成後觸發事件

**為什麼這是好練習?**
- ✅ 涵蓋基本概念:圖層偵測、事件監聽、狀態管理
- ✅ 有即時回饋(看得到數字變化)
- ✅ 可以逐步擴展功能
- ✅ 不需要複雜的邏輯

---

## 📝 實作步驟

### 步驟 1: 在 Tiled 中創建計數區域

1. 開啟你的地圖 `.tmx` 檔案
2. 創建一個新的 **Object Layer**(例如命名為 `interactiveZones`)
3. 在想要的位置畫一個矩形區域
4. 選擇該矩形,在左側 Properties 面板添加自定義屬性:

```
名稱: name
類型: string
值: counterZone
```

```
名稱: countTarget (可選)
類型: int
值: 10
```

### 步驟 2: 在地圖中引入自定義腳本

在 Tiled 的 **Map Properties** 中添加:

```
名稱: script
類型: string
值: 你的腳本URL(例如: https://你的網站.com/counter-script.js)
```

> **注意:** 如果是本地測試,可以放在地圖同目錄,值就填 `counter-script.js`

### 步驟 3: 撰寫自定義腳本

見下方的 `counter-script.js` 範例

---

## 🎓 學習重點解析

### 1. WA.room.onEnterLayer() vs WA.room.onLeaveLayer()
- `onEnterLayer`: 當玩家**進入**某個圖層/區域時觸發
- `onLeaveLayer`: 當玩家**離開**某個圖層/區域時觸發

### 2. WA.state (狀態管理)
- 用來儲存跨玩家共享的數據
- 所有玩家看到的是同一個狀態
- 刷新頁面後仍然保留

### 3. WA.ui.banner (訊息顯示)
- 在畫面頂部顯示橫幅訊息
- 適合用來顯示計數、提示等資訊

---

## 🚀 進階擴展建議

完成基礎版本後,可以嘗試:

1. **個人計數器**: 使用 `WA.player.state` 來記錄每個玩家的個別計數
2. **倒數計時器**: 踩踏後開始倒數,時間到觸發事件
3. **多區域挑戰**: 設置多個計數區域,全部達標後開門
4. **視覺回饋**: 使用 `WA.room.setProperty()` 改變地圖物件外觀
5. **音效回饋**: 使用 `WA.sound.loadSound()` 播放音效

---

## 🐛 常見問題

**Q: 腳本不執行?**
- 檢查 Console (F12) 看錯誤訊息
- 確認 script 屬性的 URL 正確
- 確認 CORS 設定(如果是外部 URL)

**Q: 狀態不同步?**
- 確認使用 `WA.state` 而非普通變數
- 檢查是否有初始化狀態

**Q: 離開後再進入會重複計數?**
- 使用 flag 來記錄是否已經計數過
- 參考下方腳本的防重複機制

---

## 📖 參考資源

- [WorkAdventure Scripting API 官方文檔](https://workadventu.re/map-building/scripting)
- [WA.state 狀態管理](https://workadventu.re/map-building/scripting/api-state)
- [WA.room 房間 API](https://workadventu.re/map-building/scripting/api-room)
