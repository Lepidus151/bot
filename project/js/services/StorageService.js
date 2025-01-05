export class StorageService {
  static async getProducts() {
    const { products = [], selectedProduct = null } = await chrome.storage.local.get(['products', 'selectedProduct']);
    return { products, selectedProduct };
  }

  static async saveProduct(product) {
    const { products } = await this.getProducts();
    products.push(product);
    await chrome.storage.local.set({ products });
  }

  static async updateProductQuantity(index, quantity) {
    const { products } = await this.getProducts();
    products[index].quantity = quantity;
    await chrome.storage.local.set({ products });
  }

  static async deleteProduct(index) {
    const { products, selectedProduct } = await this.getProducts();
    products.splice(index, 1);
    
    const newSelected = selectedProduct === index ? null 
      : selectedProduct > index ? selectedProduct - 1 
      : selectedProduct;
    
    await chrome.storage.local.set({ 
      products,
      selectedProduct: newSelected
    });
  }

  static async toggleSelection(index) {
    const { selectedProduct } = await this.getProducts();
    const newSelected = selectedProduct === index ? null : index;
    await chrome.storage.local.set({ selectedProduct: newSelected });
  }
}