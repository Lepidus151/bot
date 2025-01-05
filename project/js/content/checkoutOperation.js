import { SELECTORS, findElement } from './elementFinder.js';

export async function proceedToCheckout() {
  try {
    // レジボタンを探す
    const checkoutButtonSelectors = [
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
    ];

    // すべてのセレクターを試す
    let checkoutButton = null;
    for (const selector of checkoutButtonSelectors) {
      checkoutButton = document.querySelector(selector);
      if (checkoutButton) break;
    }

    if (!checkoutButton) {
      throw new Error('レジに進むボタンが見つかりません');
    }

    // ボタンをクリック
    checkoutButton.click();
    
    return { success: true };
  } catch (error) {
    console.error('レジへの進行に失敗:', error);
    return { success: false, error: error.message };
  }
}