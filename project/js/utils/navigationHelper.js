import { Logger } from './Logger.js';

export class NavigationHelper {
  static async waitForNavigation(tab, urlPatterns, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const timeout = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(navigationListener);
        reject(new Error('ページ遷移がタイムアウトしました'));
      }, timeoutMs);

      function navigationListener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.get(tabId, (currentTab) => {
            const hasMatchingPattern = urlPatterns.some(pattern => 
              currentTab.url.includes(pattern)
            );
            
            if (hasMatchingPattern) {
              chrome.tabs.onUpdated.removeListener(navigationListener);
              clearTimeout(timeout);
              
              // ページの安定化を少し待つ
              setTimeout(() => {
                Logger.log('ページ遷移が完了しました', 'success');
                resolve(true);
              }, 500);
            }
          });
        }
      }

      chrome.tabs.onUpdated.addListener(navigationListener);

      // 既に目的のページにいる場合の処理
      chrome.tabs.get(tab.id, (currentTab) => {
        const hasMatchingPattern = urlPatterns.some(pattern => 
          currentTab.url.includes(pattern)
        );
        
        if (hasMatchingPattern) {
          clearTimeout(timeout);
          resolve(true);
        }
      });
    });
  }
}