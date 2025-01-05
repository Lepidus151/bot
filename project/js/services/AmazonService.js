import { SELECTORS } from '../config/constants.js';
import { DOMHelper } from '../utils/DOMHelper.js';
import { Logger } from '../utils/Logger.js';

export class AmazonService {
  static async addToCart(quantity) {
    try {
      const domHelper = new DOMHelper();
      
      // 数量選択
      const quantitySelect = await domHelper.findElement(SELECTORS.quantity);
      if (quantitySelect) {
        quantitySelect.value = quantity.toString();
        domHelper.dispatchEvent(quantitySelect, 'change');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // カートボタンクリック
      const addToCartButton = await domHelper.findElement(SELECTORS.addToCart);
      if (!addToCartButton) {
        throw new Error('カートに追加するボタンが見つかりません');
      }

      addToCartButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { success: true };
    } catch (error) {
      Logger.log('カートへの追加に失敗: ' + error.message, 'error');
      return { success: false, error: error.message };
    }
  }

  static async proceedToCheckout() {
    try {
      const domHelper = new DOMHelper();
      
      const checkoutButton = await domHelper.findElement(SELECTORS.checkout);
      if (!checkoutButton) {
        throw new Error('レジに進むボタンが見つかりません');
      }

      checkoutButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { success: true };
    } catch (error) {
      Logger.log('レジへの進行に失敗: ' + error.message, 'error');
      return { success: false, error: error.message };
    }
  }
}