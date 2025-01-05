export const isCartPage = (url) => {
  return url.includes('/cart/') || url.includes('/gp/cart/');
};

export const isCheckoutPage = (url) => {
  return url.includes('/checkout/') || url.includes('/buy/');
};