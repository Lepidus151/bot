// 非同期処理に関する共通処理
export class AsyncOperations {
  static async retry(operation, options = {}) {
    const {
      maxAttempts = 3,
      delay = 1000,
      onRetry = null,
      errorMessage = 'Operation failed'
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`${errorMessage}: ${error.message}`);
        }
        if (onRetry) {
          onRetry(attempt, maxAttempts);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static async safeExecute(operation, errorHandler = null) {
    try {
      return await operation();
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error);
      }
      return { success: false, error: error.message };
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}