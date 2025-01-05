import { Logger } from '../utils/Logger.js';
import { NavigationHelper } from '../utils/navigationHelper.js';

export class CheckoutService {
  static async proceedToCheckout(tab) {
    try {
      Logger.log('レジ進行処理を開始します', 'info');
      
      // レジに進むボタンをクリック
      await chrome.tabs.sendMessage(tab.id, {
        action: 'proceedToCheckout'
      });

      // レジページへの遷移を待機
      await NavigationHelper.waitForNavigation(tab, ['/checkout/', '/buy/']);
      Logger.log('レジページへの移動が完了しました', 'success');
      
      return { success: true };
    } catch (error) {
      Logger.log(`レジ進行処理でエラー: ${error.message}`, 'error');
      throw error;
    }
  }
}