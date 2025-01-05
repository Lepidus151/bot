import { Logger } from '../../utils/Logger.js';

export class LogViewer {
  constructor(container) {
    this.container = container;
    this.logList = document.createElement('div');
    this.logList.className = 'log-list';
    this.container.appendChild(this.logList);
    
    // ログクリアボタンを追加
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-logs-btn';
    clearButton.textContent = 'ログをクリア';
    clearButton.onclick = () => {
      Logger.clear();
      this.render([]);
    };
    this.container.appendChild(clearButton);

    // ログの購読
    Logger.subscribe(logs => this.render(logs));
  }

  render(logs) {
    this.logList.innerHTML = logs.map(log => `
      <div class="log-entry ${log.type}">
        <span class="log-icon">${log.icon}</span>
        <span class="log-time">${log.timestamp}</span>
        <span class="log-message">${log.message}</span>
      </div>
    `).join('');
    
    // 最新のログまでスクロール
    this.logList.scrollTop = this.logList.scrollHeight;
  }
}