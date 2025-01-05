import { SELECTORS, findElement } from './elementFinder.js';

export async function addToCart(quantity) {
  try {
    console.log('カート追加処理を開始します');
    
    // 要素を取得
    const quantitySelect = findElement(SELECTORS.quantity);
    const addToCartButton = findElement(SELECTORS.addToCart);

    if (!addToCartButton) {
      throw new Error('カートに追加するボタンが見つかりません');
    }

    // 数量を設定
    if (quantitySelect) {
      console.log('数量選択を開始します');
      quantitySelect.value = quantity.toString();
      quantitySelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`数量を${quantity}に設定しました`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('カートボタンをクリックします');
    addToCartButton.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('カート追加が完了しました');

    return { success: true };
  } catch (error) {
    console.error('カートへの追加に失敗:', error);
    return { success: false, error: error.message };
  }
}