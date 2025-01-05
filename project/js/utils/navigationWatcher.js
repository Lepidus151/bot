export class NavigationWatcher {
  static async waitForNavigation(tab, urlChecker, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        reject(new Error('ページ遷移がタイムアウトしました'));
      }, timeout);

      function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.get(tabId, (tab) => {
            if (urlChecker(tab.url)) {
              chrome.tabs.onUpdated.removeListener(listener);
              clearTimeout(timeoutId);
              resolve();
            }
          });
        }
      }

      chrome.tabs.onUpdated.addListener(listener);
    });
  }
}