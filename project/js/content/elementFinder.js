// 要素を探すためのセレクター定義
export const SELECTORS = {
  quantity: [
    'select#quantity',
    'select#quantity-select',
    'select[name="quantity"]',
    '#quantity'
  ],
  
  addToCart: [
    'input#add-to-cart-button',
    'input[name="submit.add-to-cart"]',
    'span#submit\\.add-to-cart input',
    'span#submit\\.add-to-cart-button input',
    'input[type="submit"][title*="カートに入れる"]'
  ],
  
  checkout: [
    'input[name="proceedToRetailCheckout"]',
    'a[href*="/gp/checkoutportal/enter-checkout"]',
    'input[aria-labelledby="attach-sidesheet-checkout-button-announce"]',
    'input[aria-labelledby="sc-buy-box-ptc-button-announce"]',
    'span[data-feature-id="proceed-to-checkout-action"] input',
    '#sc-buy-box-ptc-button',
    '#submitOrderButtonId',
    'input[name="placeYourOrder1"]',
    'a.a-button-text[href*="checkoutportal"]',
    'input[name="submit.buy-now"]',
    'span.a-button-inner input[type="submit"]',
    'input.a-button-input[type="submit"]',
    'a[href*="buy/checkout"]'
  ]
};

// 要素を探して返す関数
export function findElement(selectors) {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  
  for (const selector of selectorList) {
    const element = document.querySelector(selector);
    if (element && isElementVisible(element)) {
      return element;
    }
  }
  return null;
}

// 要素が表示されているかチェックする関数
export function isElementVisible(element) {
  if (!element || !element.offsetParent) return false;
  
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         style.pointerEvents !== 'none';
}