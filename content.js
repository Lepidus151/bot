// Amazonの商品ページ内の要素を取得する関数
function getElements() {
  const quantitySelectors = [
    'select#quantity',
    'select#quantity-select',
    'select[name="quantity"]',
    '#quantity'
  ];
  const quantitySelect = document.querySelector(quantitySelectors.join(','));

  const cartButtonSelectors = [
    'input#add-to-cart-button',
    'input[name="submit.add-to-cart"]',
    'span#submit\\.add-to-cart input',
    'span#submit\\.add-to-cart-button input',
    'input[type="submit"][title*="カートに入れる"]'
  ];
  const addToCartButton = document.querySelector(cartButtonSelectors.join(','));

  const buyNowSelectors = [
    'input[name="submit.buy-now"]',
    '#buy-now-button',
    'input[id*="buy-now"]',
    'input[aria-labelledby*="buy-now"]',
    'input[title*="今すぐ買う"]'
  ];
  const buyNowButton = document.querySelector(buyNowSelectors.join(','));

  return { quantitySelect, addToCartButton, buyNowButton };
}

// 商品をカートに追加する関数
async function addToCart(quantity) {
  try {
    console.log('カート追加処理を開始します');
    const { quantitySelect, addToCartButton } = getElements();

    if (!addToCartButton) {
      throw new Error('カートに追加するボタンが見つかりません');
    }

    if (quantitySelect) {
      quantitySelect.value = quantity.toString();
      quantitySelect.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addToCartButton.click();
    return { success: true };
  } catch (error) {
    console.error('カートへの追加に失敗:', error);
    return { success: false, error: error.message };
  }
}

// 今すぐ購入する関数
async function buyNow(quantity) {
  try {
    console.log('今すぐ購入処理を開始します');
    const { quantitySelect, buyNowButton } = getElements();

    if (!buyNowButton) {
      throw new Error('今すぐ購入ボタンが見つかりません');
    }

    if (quantitySelect) {
      quantitySelect.value = quantity.toString();
      quantitySelect.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    buyNowButton.click();
    return { success: true };
  } catch (error) {
    console.error('今すぐ購入に失敗:', error);
    return { success: false, error: error.message };
  }
}

// レジに進む関数
async function proceedToCheckout() {
  try {
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

    for (const selector of checkoutButtonSelectors) {
      const button = document.querySelector(selector);
      if (button && isElementClickable(button)) {
        console.log('レジボタンを発見:', selector);
        button.click();
        return { success: true };
      }
    }

    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        for (const selector of checkoutButtonSelectors) {
          const button = document.querySelector(selector);
          if (button && isElementClickable(button)) {
            observer.disconnect();
            console.log('レジボタンを発見:', selector);
            button.click();
            resolve({ success: true });
            return;
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error('レジに進むボタンが見つかりません'));
      }, 10000);
    });
  } catch (error) {
    console.error('レジへの進行に失敗:', error);
    return { success: false, error: error.message };
  }
}

function isElementClickable(element) {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  const isVisible = style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
  
  const rect = element.getBoundingClientRect();
  const hasSize = rect.width > 0 && rect.height > 0;
  
  return isVisible && 
         hasSize && 
         !element.disabled && 
         element.getAttribute('aria-disabled') !== 'true';
}

// メッセージリスナーを設定
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addToCart') {
    addToCart(request.quantity)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'buyNow') {
    buyNow(request.quantity)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'proceedToCheckout') {
    proceedToCheckout()
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});