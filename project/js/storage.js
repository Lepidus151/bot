class ProductStorage {
  static async getProducts() {
    const result = await chrome.storage.local.get(['products', 'selectedProducts']);
    return {
      products: result.products || [],
      selectedProducts: result.selectedProducts || []
    };
  }

  static async saveProduct(product) {
    const { products } = await this.getProducts();
    products.push(product);
    await chrome.storage.local.set({ products });
  }

  static async deleteProduct(index) {
    const { products, selectedProducts } = await this.getProducts();
    products.splice(index, 1);
    // 選択状態も更新
    const newSelected = selectedProducts.filter(i => i !== index)
      .map(i => i > index ? i - 1 : i);
    await chrome.storage.local.set({ 
      products,
      selectedProducts: newSelected
    });
  }

  static async toggleSelection(index) {
    const { selectedProducts } = await this.getProducts();
    const newSelected = selectedProducts.includes(index)
      ? selectedProducts.filter(i => i !== index)
      : [...selectedProducts, index];
    await chrome.storage.local.set({ selectedProducts: newSelected });
  }

  static async clearProducts() {
    await chrome.storage.local.remove(['products', 'selectedProducts']);
  }
}