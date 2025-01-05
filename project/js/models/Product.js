export class Product {
  constructor(url, title, quantity = 1) {
    this.url = url;
    this.title = title;
    this.quantity = quantity;
  }
}