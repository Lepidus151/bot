import { SELECTORS } from '../utils/selectors.js';
import { DOMHelper } from '../utils/domHelper.js';
import { RetryHelper } from '../utils/retryHelper.js';
import { Logger } from '../utils/Logger.js';

export class CheckoutOperation {
  constructor() {
    this.domHelper = new DOMHelper();
    this.retryHelper = new RetryHelper();
  }

  async execute() {
    try {
      Logger.log('レジ進行処理を開始します');
      
      // カート追加後の画面遷移完了を待つ
      Logger.log('画面遷移を待機中...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // レジに進むボタンを探して処理
      Logger.log('レジボタンの検索を開始');
      const checkoutButton = await this.findCheckoutButton();
      
      if (!checkoutButton) {
        throw new Error('レジに進むボタンが見つかりません');
      }

      if (!this.domHelper.isElementClickable(checkoutButton)) {
        throw new Error('レジに進むボタンがクリックできない状態です');
      }

      Logger.log('レジボタンを検出しました', 'success');
      
      // ボタンをクリック
      Logger.log('レジボタンをクリックします');
      checkoutButton.click();
      
      // 画面遷移を待つ
      Logger.log('レジページへの遷移を待機中...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      Logger.log('レジ進行処理が完了しました', 'success');
      return { success: true };
    } catch (error) {
      Logger.log(error.message, 'error');
      return { success: false, error: error.message };
    }
  }

  async findCheckoutButton() {
    return await this.retryHelper.retry(
      async () => {
        Logger.log('レジボタンを探しています...', 'retry');
        for (const selector of SELECTORS.checkout) {
          const element = this.domHelper.findElement(selector);
          if (element && this.domHelper.isElementClickable(element)) {
            return element;
          }
        }
        return null;
      },
      'レジに進むボタンが見つかりません',
      15,
      1000
    );
  }
}