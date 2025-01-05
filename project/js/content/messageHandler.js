import { addToCart } from './cartOperation.js';
import { proceedToCheckout } from './checkoutOperation.js';

// メッセージハンドラーの設定
export function setupMessageHandler() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addToCart') {
      addToCart(request.quantity)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
    
    if (request.action === 'proceedToCheckout') {
      proceedToCheckout()
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });
}