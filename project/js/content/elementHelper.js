export class ElementHelper {
  static findElement(selectors) {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorList) {
      const element = document.querySelector(selector);
      if (element && this.isElementClickable(element)) {
        return element;
      }
    }
    return null;
  }

  static isElementClickable(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     style.opacity !== '0';
    
    const rect = element.getBoundingClientRect();
    const hasSize = rect.width > 0 && rect.height > 0;
    
    return isVisible && 
           hasSize && 
           !element.disabled && 
           element.getAttribute('aria-disabled') !== 'true';
  }

  static async waitForElement(selectors, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        const element = this.findElement(selectors);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // 既に要素が存在する場合
      const element = this.findElement(selectors);
      if (element) {
        observer.disconnect();
        resolve(element);
      }

      // タイムアウト設定
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('要素の検出がタイムアウトしました'));
      }, timeoutMs);
    });
  }
}