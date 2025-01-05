export class RetryHelper {
  async retry(operation, errorMessage, maxAttempts = 5, interval = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await operation();
      if (result) {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error(errorMessage);
  }
}