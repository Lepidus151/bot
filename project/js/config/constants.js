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
    'input[name="placeYourOrder1"]'
  ]
};