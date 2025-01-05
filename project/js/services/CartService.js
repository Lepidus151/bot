import { Logger } from '../utils/Logger.js';
import { NavigationHelper } from '../utils/navigationHelper.js';

export class CartService {
  static async addToCart(tab, product, isSpeedMode = false) {
    try {
      Logger.log(`商品ページに移動: ${product.title}`, 'info');
      
      // 商品ページに移動して読み込み完了を待機
      await chrome.tabs.update(tab.id, { url: product.url });
      await NavigationHelper.waitForNavigation(tab, ['/dp/', '/gp/product/']);
      
      Logger.log(isSpeedMode ? '今すぐ購入を実行します' : 'カート追加処理を開始します', 'info');

      // カートに追加または今すぐ購入
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: isSpeedMode ? 'buyNow' : 'addToCart',
        quantity: product.quantity
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // スピードモードの場合は追加の処理は不要
      if (isSpeedMode) {
        return { success: true };
      }

      // カートページへの遷移を待機
      await NavigationHelper.waitForNavigation(tab, ['/cart/', '/gp/cart/']);
      Logger.log('カートへの追加が完了しました', 'success');
      
      return { success: true };
    } catch (error) {
      Logger.log(`処理でエラー: ${error.message}`, 'error');
      throw error;
    }
  }
}