// DOM操作に関する共通処理をまとめたユーティリティ
export class DOMOperations {
  static async waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Element not found: ${selector}`);
  }

  static isElementVisible(element) {
    if (!element || !element.offsetParent) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  static isElementClickable(element) {
    return element && 
           this.isElementVisible(element) && 
           !element.disabled && 
           element.getAttribute('aria-disabled') !== 'true';
  }

  static dispatchEvent(element, eventType) {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  }
}