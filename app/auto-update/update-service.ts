import { autoUpdater } from 'electron-updater';
import logger from 'electron-log';
import { ipcMain, app } from 'electron';
import { mainWindow } from 'app/browser-window';

export function checkUpdate() {
  // 正式环境
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    // 开发环境使用checkForUpdates调试更新，因为checkForUpdatesAndNotify方法在应用未打包时会跳过执行
    autoUpdater.checkForUpdates();
  }
}

function init() {
  // 日志
  logger.transports.file.level = 'info';
  autoUpdater.logger = logger;

  // 自动下载
  autoUpdater.autoDownload = true;
  // 启用退出app时自动安装更新
  autoUpdater.autoInstallOnAppQuit = true;

  // 监听事件并发送到渲染进程
  const events = [
    'error',
    'checking-for-update',
    'update-available',
    'update-not-available',
    'download-progress',
    'update-downloaded',
  ];

  events.forEach((eventName) => autoUpdater.on(eventName, (...args) => {
    const mw = mainWindow.getWindow();
    mw?.webContents.send('app:update-status-change', eventName, ...args);
  }));

  // 通过接收渲染进程发送的ipc调用方法
  ipcMain.on('app:check-update', checkUpdate);
}

(async () => {
  await app.whenReady();
  init();
})();
