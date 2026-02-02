/**
 * WorkAdventure 自定義腳本 - 踩踏計數器 (穩定版)
 * 
 * 功能:
 * - 玩家踩上 counterZone 區域時計數 +1
 * - 顯示當前踩踏次數
 * - 達到目標次數時顯示祝賀訊息
 */

console.log('🎮 計數器腳本已載入!');

// 等待 WA API 完全載入
WA.onInit().then(() => {
    console.log('✅ WA API 已準備就緒');
    
    // ============================================
    // 初始化狀態
    // ============================================
    
    // 初始化全域計數器(所有玩家共享)
    WA.state.onVariableChange('globalCounter').subscribe((value) => {
        console.log('計數器更新:', value);
    });
    
    // 如果是第一次載入,初始化為 0
    if (WA.state.globalCounter === undefined) {
        WA.state.globalCounter = 0;
        console.log('✨ 計數器已初始化為 0');
    }
    
    // ============================================
    // 計數區域事件監聽
    // ============================================
    
    let currentBanner = null; // 儲存當前橫幅的引用,用於關閉
    
    // 當玩家進入計數區域
    WA.room.onEnterLayer('counterZone').subscribe(() => {
        console.log('👟 玩家進入計數區域');
        
        // 計數 +1
        WA.state.globalCounter = (WA.state.globalCounter || 0) + 1;
        
        const currentCount = WA.state.globalCounter;
        
        // 顯示計數訊息
        if (currentBanner) {
            currentBanner.close(); // 關閉舊的橫幅
        }
        
        currentBanner = WA.ui.banner.openBanner({
            id: "counter-banner",
            text: `🎯 計數器: ${currentCount} 次`,
            bgColor: "#4CAF50",
            textColor: "#FFFFFF",
            closable: false
        });
        
        // 檢查是否達到目標(假設目標是 10 次)
        const target = 10;
        if (currentCount === target) {
            WA.ui.modal.openModal({
                title: "🎉 恭喜!",
                src: 'data:text/html;charset=utf-8,' + encodeURIComponent(`
                    <div style="padding: 20px; text-align: center; font-family: Arial;">
                        <h2>🎊 達成目標!</h2>
                        <p style="font-size: 18px;">你已經踩踏了 ${target} 次!</p>
                        <p style="color: #666;">太厲害了!</p>
                    </div>
                `),
                allow: "fullscreen",
                allowApi: true,
                position: "center"
            });
        }
    });
    
    // 當玩家離開計數區域
    WA.room.onLeaveLayer('counterZone').subscribe(() => {
        console.log('👋 玩家離開計數區域');
        
        // 延遲 2 秒後關閉橫幅
        setTimeout(() => {
            if (currentBanner) {
                currentBanner.close();
                currentBanner = null;
            }
        }, 2000);
    });
    
    // ============================================
    // 額外功能:重置計數器(管理員用)
    // ============================================
    
    // 監聽聊天訊息,如果輸入 /reset 就重置計數器
    WA.chat.onChatMessage((message) => {
        if (message === '/reset-counter') {
            WA.state.globalCounter = 0;
            WA.ui.banner.openBanner({
                id: "reset-banner",
                text: "🔄 計數器已重置!",
                bgColor: "#FF5722",
                textColor: "#FFFFFF",
                closable: true
            });
        }
    });
    
    console.log('✅ 計數器腳本設置完成!');
    console.log('💡 提示: 在聊天輸入 /reset-counter 可以重置計數器');
    
}).catch((error) => {
    console.error('❌ WA API 初始化失敗:', error);
});
