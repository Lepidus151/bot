export class LogDisplay {
  constructor(container) {
    this.container = container;
    this.maxLogs = 50;
    this.logs = [];
  }

  addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icon = this.getIcon(type);
    
    this.logs.unshift({ timestamp, message, type, icon });
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    this.render();
  }

  getIcon(type) {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'retry': return '🔄';
      default: return 'ℹ️';
    }
  }

  render() {
    this.container.innerHTML = this.logs
      .map(log => `
        <div class="log-entry ${log.type}">
          <span class="log-time">[${log.timestamp}]</span>
          <span class="log-icon">${log.icon}</span>
          <span class="log-message">${log.message}</span>
        </div>
      `)
      .join('');
  }

  clear() {
    this.logs = [];
    this.render();
  }
}