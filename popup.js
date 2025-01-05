class ProductManager {
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
}

document.addEventListener('DOMContentLoaded', async () => {
  const updateList = async () => {
    const products = await ProductManager.getProducts();
    const container = document.getElementById('products');
    container.innerHTML = products.map((p, i) => `
      <div class="product-item">
        <div class="product-info">
          <div>${p.title}</div>
          <div>数量: ${p.quantity}</div>
        </div>
        <button onclick="deleteProduct(${i})">削除</button>
      </div>
    `).join('');
  };

  window.deleteProduct = async (index) => {
    await ProductManager.deleteProduct(index);
    await updateList();
  };

  document.getElementById('save').addEventListener('click', async () => {
    const url = document.getElementById('url').value;
    const title = document.getElementById('title').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!url || !title) {
      document.getElementById('status').textContent = 'URLと商品名を入力してください';
      return;
    }

    await ProductManager.saveProduct({ url, title, quantity });
    document.getElementById('url').value = '';
    document.getElementById('title').value = '';
    document.getElementById('quantity').value = '1';
    await updateList();
  });

  document.getElementById('addToCart').addEventListener('click', async () => {
    const products = await ProductManager.getProducts();
    if (products.length === 0) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    for (const product of products) {
      await chrome.tabs.update(tab.id, { url: product.url });
      await new Promise(resolve => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        });
      });
      await chrome.tabs.sendMessage(tab.id, {
        action: 'addToCart',
        quantity: product.quantity
      });
    }
  });

  await updateList();
});