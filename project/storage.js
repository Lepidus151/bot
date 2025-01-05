// ストレージ操作のユーティリティ関数
class ProductStorage {
  static async getProducts() {
    const result = await chrome.storage.local.get('products');
    return result.products || [];
  }

  static async saveProduct(product) {
    const products = await this.getProducts();
    products.push(product);
    await chrome.storage.local.set({ products });
  }

  static async deleteProduct(index) {
    const products = await this.getProducts();
    products.splice(index, 1);
    await chrome.storage.local.set({ products });
  }

  static async clearProducts() {
    await chrome.storage.local.remove('products');
  }
}

// 商品データの型定義
class Product {
  constructor(url, title, quantity = 1) {
    this.url = url;
    this.title = title;
    this.quantity = quantity;
  }
}