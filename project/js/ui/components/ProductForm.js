import { EventEmitter } from '../../utils/EventEmitter.js';

export class ProductForm extends EventEmitter {
  constructor(container) {
    super();
    this.urlInput = container.getElementById('productUrl');
    this.titleInput = container.getElementById('productTitle');
    this.quantityInput = container.getElementById('quantity');
    this.saveButton = container.getElementById('saveProduct');
    
    this.saveButton.addEventListener('click', () => this.handleSave());
  }

  async handleSave() {
    const data = {
      url: this.urlInput.value,
      title: this.titleInput.value,
      quantity: parseInt(this.quantityInput.value) || 1
    };

    if (!this.validate(data)) {
      this.emit('error', 'URLと商品名を入力してください');
      return;
    }

    this.emit('save', data);
    this.reset();
  }

  validate(data) {
    return data.url && data.title;
  }

  reset() {
    this.urlInput.value = '';
    this.titleInput.value = '';
    this.quantityInput.value = '1';
  }
}