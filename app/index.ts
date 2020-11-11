import { app } from 'electron';
import { mainWindow } from 'app/browser-window';
import { applicationMenu } from 'app/menu';
import 'app/store';
import 'app/tray';
import 'app/dialog';
import 'app/logger';
import 'app/app-setting';
import 'app/auto-update';

app.on('ready', () => {
  mainWindow.create();
  applicationMenu.setup();
});

// 点击下方的应用 恢复主窗口
app.on('activate', () => {
  mainWindow.restore();
});

// 当所有窗口关闭 window下不会自动退出进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 关闭主窗口 否则无法退出应用
app.on('before-quit', () => {
  mainWindow.close();
});
