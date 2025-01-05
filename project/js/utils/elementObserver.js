export class ElementObserver {
  static async waitForElement(selectors, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selectors);
        if (element && this.isElementClickable(element)) {
          observer.disconnect();
          resolve(element);
        } else if (Date.now() - startTime > timeoutMs) {
          observer.disconnect();
          reject(new Error('要素の検出がタイムアウトしました'));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // 既に要素が存在する場合
      const element = document.querySelector(selectors);
      if (element && this.isElementClickable(element)) {
        observer.disconnect();
        resolve(element);
      }
    });
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
}