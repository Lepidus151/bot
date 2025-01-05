import { StorageService } from '../services/StorageService.js';
import { ProductItem } from './components/ProductItem.js';
import { Logger } from '../utils/Logger.js';

export class ProductList {
  constructor(container) {
    this.container = container;
  }

  async render() {
    try {
      const { products, selectedProduct } = await StorageService.getProducts();
      
      // 商品リストのヘッダー
      this.container.innerHTML = `
        <div class="product-list-header">
          <h3>登録済み商品</h3>
          <small>${products.length}件</small>
        </div>
      `;
      
      if (products.length === 0) {
        this.container.innerHTML += '<p class="no-products">商品が登録されていません</p>';
        return;
      }

      // 商品リストのコンテナ
      const listContainer = document.createElement('div');
      listContainer.className = 'product-items-container';
      
      products.forEach((product, index) => {
        const item = new ProductItem(product, index, selectedProduct === index);

        item.on('toggle', async (index) => {
          await StorageService.toggleSelection(index);
          Logger.log(`商品を選択: ${product.title}`, 'info');
          await this.render();
        });

        item.on('updateQuantity', async ({ index, quantity }) => {
          await StorageService.updateProductQuantity(index, quantity);
          Logger.log(`数量を更新: ${product.title} (${quantity}個)`, 'info');
        });

        item.on('delete', async (index) => {
          await StorageService.deleteProduct(index);
          Logger.log(`商品を削除: ${product.title}`, 'info');
          await this.render();
        });

        listContainer.appendChild(item.getElement());
      });

      this.container.appendChild(listContainer);
    } catch (error) {
      Logger.log('商品リストの表示中にエラーが発生しました', 'error');
      this.container.innerHTML = '<p class="error">商品リストの読み込みに失敗しました</p>';
    }
  }
}