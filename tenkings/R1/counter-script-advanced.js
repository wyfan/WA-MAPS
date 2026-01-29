/// <reference types="@workadventure/iframe-api-typings" />

/**
 * WorkAdventure 進階計數器腳本
 * 
 * 功能:
 * - 全域計數器(所有玩家共享)
 * - 個人計數器(每個玩家獨立)
 * - 防止快速重複計數
 * - 音效回饋(可選)
 * - 視覺回饋
 */

console.log('🚀 進階計數器腳本已載入!');

// ============================================
// 配置參數
// ============================================

const CONFIG = {
    TARGET_COUNT: 10,           // 目標次數
    COOLDOWN_TIME: 1000,        // 冷卻時間(毫秒),防止快速重複計數
    SHOW_PERSONAL_COUNT: true,  // 是否顯示個人計數
    BANNER_DURATION: 2000       // 橫幅顯示時長
};

// ============================================
// 狀態初始化
// ============================================

// 全域計數器
if (WA.state.globalCounter === undefined) {
    WA.state.globalCounter = 0;
}

// 個人計數器(使用 player.state)
if (WA.player.state.personalCounter === undefined) {
    WA.player.state.personalCounter = 0;
}

// 冷卻狀態(防止重複計數)
let isOnCooldown = false;
let currentBanner: any = null;

// ============================================
// 主要功能:計數邏輯
// ============================================

WA.room.onEnterLayer('counterZone').subscribe(() => {
    // 檢查是否在冷卻中
    if (isOnCooldown) {
        console.log('⏳ 冷卻中,暫不計數');
        return;
    }
    
    // 開始冷卻
    isOnCooldown = true;
    setTimeout(() => {
        isOnCooldown = false;
    }, CONFIG.COOLDOWN_TIME);
    
    // 全域計數 +1
    WA.state.globalCounter = (WA.state.globalCounter as number) + 1;
    
    // 個人計數 +1
    WA.player.state.personalCounter = (WA.player.state.personalCounter as number) + 1;
    
    const globalCount = WA.state.globalCounter as number;
    const personalCount = WA.player.state.personalCounter as number;
    
    console.log(`📊 計數更新 - 全域: ${globalCount}, 個人: ${personalCount}`);
    
    // 顯示計數資訊
    showCountBanner(globalCount, personalCount);
    
    // 檢查是否達標
    checkAchievement(globalCount, personalCount);
});

// ============================================
// UI 顯示函數
// ============================================

function showCountBanner(globalCount: number, personalCount: number) {
    // 關閉舊橫幅
    if (currentBanner) {
        currentBanner.close();
    }
    
    // 準備顯示文字
    let bannerText = `🌍 全域計數: ${globalCount}`;
    if (CONFIG.SHOW_PERSONAL_COUNT) {
        bannerText += ` | 👤 你的計數: ${personalCount}`;
    }
    
    // 根據進度改變顏色
    const progress = globalCount / CONFIG.TARGET_COUNT;
    let bgColor = "#4CAF50"; // 綠色
    if (progress >= 0.8) {
        bgColor = "#FF9800"; // 橘色(快達標)
    }
    if (progress >= 1.0) {
        bgColor = "#9C27B0"; // 紫色(已達標)
    }
    
    // 顯示橫幅
    currentBanner = WA.ui.banner.openBanner({
        id: "counter-banner",
        text: bannerText,
        bgColor: bgColor,
        textColor: "#FFFFFF",
        closable: false
    });
    
    // 自動關閉橫幅
    setTimeout(() => {
        if (currentBanner) {
            currentBanner.close();
            currentBanner = null;
        }
    }, CONFIG.BANNER_DURATION);
}

// ============================================
// 成就檢查
// ============================================

function checkAchievement(globalCount: number, personalCount: number) {
    // 全域目標達成
    if (globalCount === CONFIG.TARGET_COUNT) {
        showAchievementModal('global', globalCount);
    }
    
    // 個人里程碑(每 5 次)
    if (personalCount % 5 === 0 && personalCount > 0) {
        showMilestoneNotification(personalCount);
    }
}

function showAchievementModal(type: 'global' | 'personal', count: number) {
    const title = type === 'global' ? '🌟 全域成就達成!' : '🏆 個人成就達成!';
    
    WA.ui.modal.openModal({
        title: title,
        src: 'data:text/html;charset=utf-8,' + encodeURIComponent(`
            <div style="
                padding: 30px; 
                text-align: center; 
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            ">
                <div style="font-size: 80px; margin-bottom: 20px;">
                    ${type === 'global' ? '🎊' : '🏆'}
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 28px;">恭喜!</h2>
                <p style="font-size: 18px; margin: 10px 0;">
                    ${type === 'global' ? '全體玩家' : '你'}已經踩踏了 <strong>${count}</strong> 次!
                </p>
                <p style="font-size: 14px; opacity: 0.9; margin-top: 20px;">
                    ${type === 'global' ? '這是大家共同的努力!' : '繼續加油!'}
                </p>
            </div>
        `),
        allow: "fullscreen",
        allowApi: true,
        position: "center"
    });
}

function showMilestoneNotification(count: number) {
    WA.ui.banner.openBanner({
        id: "milestone-banner",
        text: `⭐ 個人里程碑: ${count} 次!`,
        bgColor: "#FFD700",
        textColor: "#000000",
        closable: true
    });
}

// ============================================
// 聊天指令
// ============================================

WA.chat.onChatMessage((message) => {
    // 重置全域計數器
    if (message === '/reset-global') {
        WA.state.globalCounter = 0;
        WA.ui.banner.openBanner({
            id: "reset-banner",
            text: "🔄 全域計數器已重置!",
            bgColor: "#FF5722",
            textColor: "#FFFFFF",
            closable: true
        });
    }
    
    // 重置個人計數器
    if (message === '/reset-personal') {
        WA.player.state.personalCounter = 0;
        WA.ui.banner.openBanner({
            id: "reset-banner",
            text: "🔄 你的個人計數器已重置!",
            bgColor: "#FF5722",
            textColor: "#FFFFFF",
            closable: true
        });
    }
    
    // 查看當前計數
    if (message === '/count') {
        const globalCount = WA.state.globalCounter as number;
        const personalCount = WA.player.state.personalCounter as number;
        
        WA.chat.sendChatMessage(
            `📊 全域計數: ${globalCount} | 個人計數: ${personalCount}`,
            { scope: 'bubble', author: 'System' }
        );
    }
    
    // 顯示幫助
    if (message === '/help-counter') {
        WA.chat.sendChatMessage(
            `🎮 計數器指令:\n/count - 查看計數\n/reset-personal - 重置個人計數\n/reset-global - 重置全域計數`,
            { scope: 'bubble', author: 'System' }
        );
    }
});

// ============================================
// 啟動訊息
// ============================================

console.log('✅ 進階計數器腳本設置完成!');
console.log('💡 可用指令: /count, /reset-personal, /reset-global, /help-counter');

// 顯示歡迎訊息
setTimeout(() => {
    WA.ui.banner.openBanner({
        id: "welcome-banner",
        text: "🎯 計數器已啟動! 踩上紫色區域來計數吧!",
        bgColor: "#2196F3",
        textColor: "#FFFFFF",
        closable: true
    });
}, 1000);
