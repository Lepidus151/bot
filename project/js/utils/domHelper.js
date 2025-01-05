export class DOMHelper {
  findElement(selectors) {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorList) {
      const element = document.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        return element;
      }
    }
    return null;
  }

  isElementVisible(element) {
    if (!element || !element.offsetParent) return false;
    
    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     style.opacity !== '0';
    
    const rect = element.getBoundingClientRect();
    const hasSize = rect.width > 0 && rect.height > 0;
    
    // 画面内に表示されているか確認
    const isInViewport = rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= window.innerHeight &&
                        rect.right <= window.innerWidth;
    
    return isVisible && hasSize && isInViewport;
  }

  isElementClickable(element) {
    return element &&
           this.isElementVisible(element) &&
           !element.disabled &&
           element.getAttribute('aria-disabled') !== 'true' &&
           !element.classList.contains('loading');
  }

  dispatchEvent(element, eventType) {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  }
}