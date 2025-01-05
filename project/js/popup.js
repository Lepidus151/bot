import { Product } from './models/Product.js';
import { StorageService } from './services/StorageService.js';
import { CartService } from './services/CartService.js';
import { CheckoutService } from './services/CheckoutService.js';
import { StatusMessage } from './ui/components/StatusMessage.js';
import { ProductList } from './ui/ProductList.js';
import { ProductForm } from './ui/components/ProductForm.js';
import { LogViewer } from './ui/components/LogViewer.js';
import { Logger } from './utils/Logger.js';

document.addEventListener('DOMContentLoaded', async () => {
  const statusMessage = new StatusMessage(document.getElementById('status'));
  const productList = new ProductList(document.getElementById('productList'));
  const productForm = new ProductForm(document);
  new LogViewer(document.getElementById('logContainer'));

  Logger.log('拡張機能を起動しました', 'info');

  productForm.on('save', async (data) => {
    try {
      const product = new Product(data.url, data.title, data.quantity);
      await StorageService.saveProduct(product);
      await productList.render();
      statusMessage.show('商品を登録しました');
      Logger.log(`新しい商品を登録しました: ${data.title}`, 'success');
    } catch (error) {
      statusMessage.show(error.message, 'error');
      Logger.log(`商品の登録に失敗: ${error.message}`, 'error');
    }
  });

  document.getElementById('addToCart').addEventListener('click', async () => {
    try {
      const { products, selectedProduct } = await StorageService.getProducts();
      if (selectedProduct === null) {
        statusMessage.show('商品が選択されていません', 'error');
        Logger.log('商品が選択されていません', 'warn');
        return;
      }

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const product = products[selectedProduct];
      const isSpeedMode = document.getElementById('speedMode').checked;
      
      Logger.log(`${isSpeedMode ? '今すぐ購入' : 'カート追加'}を開始: ${product.title}`, 'info');
      
      // カートに追加または今すぐ購入
      await CartService.addToCart(tab, product, isSpeedMode);
      
      if (!isSpeedMode) {
        // 通常モードの場合のみレジに進む
        Logger.log('レジ画面に移動中...', 'info');
        await CheckoutService.proceedToCheckout(tab);
      }
      
      statusMessage.show(isSpeedMode ? '今すぐ購入を実行しました' : 'レジに進みました');
      Logger.log('処理が完了しました', 'success');
    } catch (error) {
      statusMessage.show(error.message, 'error');
      Logger.log(`処理中にエラーが発生: ${error.message}`, 'error');
    }
  });

  await productList.render();
});