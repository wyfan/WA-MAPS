# Tiled 設定步驟詳解

## 📍 步驟 1: 創建計數區域

### 1.1 新增 Object Layer
1. 在 Tiled 中,點擊上方工具列的 `Layer` → `Add Layer` → `Object Layer`
2. 命名為 `interactiveZones` (或任何你喜歡的名字)

### 1.2 繪製矩形區域
1. 確保選中你剛創建的 Object Layer
2. 點擊左側工具列的矩形工具 (□)
3. 在地圖上拖曳繪製一個矩形區域(這就是計數區域)

### 1.3 設定區域屬性
選中剛畫的矩形,在右側 Properties 面板:

**必要屬性:**
```
屬性名稱: name
類型: string
值: counterZone
```
> ⚠️ 注意: 這個 `counterZone` 必須和腳本中的 `onEnterLayer('counterZone')` 一致!

**可選屬性:**
```
屬性名稱: countTarget
類型: int
值: 10
```

**視覺提示(可選):**
你可以給矩形設置顏色,方便識別:
- 選中矩形後,在 Properties 中找到 `color` 屬性
- 設置為紫色或其他顯眼的顏色

---

## 📜 步驟 2: 引入自定義腳本

### 2.1 設定地圖屬性
1. 在 Tiled 中,點擊 `Map` → `Map Properties`
2. 在 Custom Properties 區域,新增以下屬性:

```
屬性名稱: script
類型: string
值: [你的腳本 URL 或檔案路徑]
```

### 2.2 腳本路徑範例

**本地測試(腳本與地圖在同一目錄):**
```
counter-script.js
```

**本地測試(腳本在子資料夾):**
```
scripts/counter-script.js
```

**線上託管(推薦):**
```
https://你的網站.com/scripts/counter-script.js
```

**GitHub Pages 範例:**
```
https://你的用戶名.github.io/wa-scripts/counter-script.js
```

---

## 🌐 步驟 3: 部署腳本

### 方法 1: 使用 GitHub Pages (推薦,免費)

1. 在 GitHub 創建一個新的 repository
2. 上傳 `counter-script.js` 檔案
3. 啟用 GitHub Pages (Settings → Pages → 選擇 main 分支)
4. 使用產生的 URL

### 方法 2: 本地伺服器

如果你在本地測試 WorkAdventure:
```bash
# 在腳本所在資料夾執行
python3 -m http.server 8000
```
然後 script 路徑設為:
```
http://localhost:8000/counter-script.js
```

### 方法 3: 使用 CDN 服務

如 jsDelivr, Cloudflare Pages 等

---

## ✅ 步驟 4: 測試

1. 儲存 Tiled 地圖 (Ctrl+S)
2. 重新載入 WorkAdventure 地圖
3. 按 F12 開啟瀏覽器 Console
4. 應該會看到:
   ```
   🎮 計數器腳本已載入!
   ✨ 計數器已初始化為 0
   ✅ 計數器腳本設置完成!
   ```
5. 走到紫色區域,應該會看到計數器橫幅出現!

---

## 🐛 故障排除

### 問題 1: 腳本沒有載入
**檢查清單:**
- [ ] Map Properties 中有正確設置 `script` 屬性?
- [ ] script 的 URL 或路徑正確?
- [ ] 如果是外部 URL,該 URL 可以直接在瀏覽器訪問?
- [ ] 檢查 Console 是否有 CORS 錯誤?

**解決方案:**
- 確保腳本可公開訪問
- 如果用 GitHub Pages,確認已啟用
- 本地測試時使用 http-server

### 問題 2: 進入區域沒反應
**檢查清單:**
- [ ] 矩形的 `name` 屬性是 `counterZone`?
- [ ] 確認矩形在 Object Layer 上?
- [ ] 腳本中的 layer 名稱和 Tiled 中的一致?

**除錯技巧:**
在 Console 輸入:
```javascript
WA.room.onEnterLayer('counterZone').subscribe(() => {
    console.log('測試:進入計數區域!');
});
```

### 問題 3: CORS 錯誤
**錯誤訊息:**
```
Access to script from origin has been blocked by CORS policy
```

**解決方案:**
- 使用支援 CORS 的託管服務(如 GitHub Pages)
- 或在本地開發時使用 http-server 並加上 CORS 參數:
  ```bash
  npx http-server --cors
  ```

---

## 📚 下一步

完成基礎版本後,可以嘗試:

1. **修改目標次數**: 更改 `CONFIG.TARGET_COUNT`
2. **個人計數器**: 使用進階版腳本
3. **多個計數區域**: 複製矩形,改成不同名稱
4. **視覺回饋**: 使用 `WA.room.setProperty()` 改變地圖外觀
5. **音效**: 添加 `WA.sound.loadSound()` 播放音效

祝你學習愉快! 🎉
