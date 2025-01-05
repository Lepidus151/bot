// プレビュー環境用のモックストレージ
class MockStorage {
  constructor() {
    this.storage = {
      products: [],
      selectedProducts: []
    };
  }

  async get(keys) {
    if (Array.isArray(keys)) {
      const result = {};
      keys.forEach(key => {
        result[key] = this.storage[key];
      });
      return result;
    }
    return { [keys]: this.storage[keys] };
  }

  async set(items) {
    Object.assign(this.storage, items);
  }

  async remove(keys) {
    if (Array.isArray(keys)) {
      keys.forEach(key => {
        delete this.storage[key];
      });
    } else {
      delete this.storage[keys];
    }
  }
}

// プレビュー環境かどうかを判定
const isPreview = window.location.pathname.includes('/preview/');

// プレビュー環境の場合はモックストレージを使用
if (isPreview && !window.chrome?.storage?.local) {
  window.chrome = {
    storage: {
      local: new MockStorage()
    }
  };
}