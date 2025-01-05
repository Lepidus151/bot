export class Logger {
  static logs = [];
  static listeners = new Set();

  static log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      type,
      icon: this.getIcon(type)
    };
    
    this.logs.push(logEntry);
    this.notifyListeners();
    
    // コンソールにも出力
    switch (type) {
      case 'info':
        console.log(`${timestamp} ℹ️ ${message}`);
        break;
      case 'success':
        console.log(`${timestamp} ✅ ${message}`);
        break;
      case 'error':
        console.error(`${timestamp} ❌ ${message}`);
        break;
      case 'warn':
        console.warn(`${timestamp} ⚠️ ${message}`);
        break;
      case 'retry':
        console.log(`${timestamp} 🔄 ${message}`);
        break;
    }
  }

  static getIcon(type) {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'retry': return '🔄';
      default: return 'ℹ️';
    }
  }

  static subscribe(callback) {
    this.listeners.add(callback);
    callback(this.logs);
    return () => this.listeners.delete(callback);
  }

  static notifyListeners() {
    this.listeners.forEach(callback => callback(this.logs));
  }

  static clear() {
    this.logs = [];
    this.notifyListeners();
  }
}