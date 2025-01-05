export class DOMObserver {
  static async waitForElement(selectors, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      // 複数のセレクターに対応
      const selectorList = Array.isArray(selectors) ? selectors : [selectors];
      
      const observer = new MutationObserver(() => {
        for (const selector of selectorList) {
          const element = document.querySelector(selector);
          if (element && this.isElementReady(element)) {
            observer.disconnect();
            resolve(element);
            return;
          }
        }
        
        if (Date.now() - startTime > timeoutMs) {
          observer.disconnect();
          reject(new Error('要素の検出がタイムアウトしました'));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // 既に要素が存在する場合の即時チェック
      for (const selector of selectorList) {
        const element = document.querySelector(selector);
        if (element && this.isElementReady(element)) {
          observer.disconnect();
          resolve(element);
          return;
        }
      }
    });
  }

  static isElementReady(element) {
    if (!element || !element.offsetParent) return false;
    
    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     style.opacity !== '0';
    
    const rect = element.getBoundingClientRect();
    const hasSize = rect.width > 0 && rect.height > 0;
    
    return isVisible && hasSize && !element.disabled;
  }
}