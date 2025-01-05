export class ElementFinder {
  static async waitForElement(selector, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`要素が見つかりませんでした: ${selector}`);
  }
}