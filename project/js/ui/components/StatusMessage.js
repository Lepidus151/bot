export class StatusMessage {
  constructor(container) {
    this.container = container;
  }

  show(message, type = 'info') {
    this.container.textContent = message;
    this.container.className = `status ${type}`;
    
    if (type !== 'error') {
      setTimeout(() => this.clear(), 3000);
    }
  }

  clear() {
    this.container.textContent = '';
    this.container.className = 'status';
  }
}