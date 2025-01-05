import { SELECTORS } from '../utils/selectors.js';
import { DOMHelper } from '../utils/domHelper.js';
import { RetryHelper } from '../utils/retryHelper.js';
import { Logger } from '../utils/Logger.js';

export class CartOperation {
  constructor() {
    this.domHelper = new DOMHelper();
    this.retryHelper = new RetryHelper();
  }

  async execute(quantity) {
    try {
      Logger.log('カート追加処理を開始します');
      
      // 数量選択の処理
      Logger.log('数量選択処理を開始');
      await this.setQuantity(quantity);
      Logger.log('数量選択完了', 'success');
      
      // カートボタンのクリック
      Logger.log('カートボタンのクリックを試行');
      await this.clickAddToCart();
      Logger.log('カートボタンのクリック完了', 'success');
      
      Logger.log('カート追加処理が完了しました', 'success');
      return { success: true };
    } catch (error) {
      Logger.log(error.message, 'error');
      return { success: false, error: error.message };
    }
  }

  async setQuantity(quantity) {
    const quantitySelect = await this.retryHelper.retry(
      () => {
        Logger.log('数量選択要素を探しています...', 'retry');
        return this.domHelper.findElement(SELECTORS.quantity);
      },
      '数量選択要素が見つかりません'
    );

    if (quantitySelect) {
      quantitySelect.value = quantity.toString();
      this.domHelper.dispatchEvent(quantitySelect, 'change');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async clickAddToCart() {
    const addToCartButton = await this.retryHelper.retry(
      () => {
        Logger.log('カートボタンを探しています...', 'retry');
        return this.domHelper.findElement(SELECTORS.addToCart);
      },
      'カートボタンが見つかりません'
    );

    if (!this.domHelper.isElementClickable(addToCartButton)) {
      throw new Error('カートボタンがクリックできない状態です');
    }

    addToCartButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}