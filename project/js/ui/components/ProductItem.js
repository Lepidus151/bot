import { EventEmitter } from '../../utils/EventEmitter.js';

export class ProductItem extends EventEmitter {
  constructor(product, index, isSelected) {
    super();
    this.product = product;
    this.index = index;
    this.isSelected = isSelected;
    this.element = this.createElement();
  }

  createElement() {
    const item = document.createElement('div');
    item.className = `product-item ${this.isSelected ? 'selected' : ''}`;
    
    item.innerHTML = `
      <div class="product-checkbox">
        <input type="checkbox" ${this.isSelected ? 'checked' : ''}>
      </div>
      <div class="product-info">
        <div class="product-title" title="${this.product.title}">
          ${this.product.title}
        </div>
        <div class="product-url" title="${this.product.url}">
          ${this.formatUrl(this.product.url)}
        </div>
        <div class="product-quantity">
          数量: 
          <input type="number" 
            min="1" 
            value="${this.product.quantity}" 
            class="quantity-input">
        </div>
      </div>
      <button class="delete-btn" title="削除">×</button>
    `;

    // イベントリスナーの設定
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      this.emit('toggle', this.index);
    });

    const quantityInput = item.querySelector('.quantity-input');
    quantityInput.addEventListener('change', (e) => {
      const quantity = parseInt(e.target.value) || 1;
      if (quantity < 1) {
        e.target.value = '1';
        this.emit('updateQuantity', { index: this.index, quantity: 1 });
      } else {
        this.emit('updateQuantity', { index: this.index, quantity });
      }
    });

    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm('この商品を削除してもよろしいですか？')) {
        this.emit('delete', this.index);
      }
    });

    return item;
  }

  formatUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 20) + '...';
    } catch {
      return url.slice(0, 30) + '...';
    }
  }

  getElement() {
    return this.element;
  }
}