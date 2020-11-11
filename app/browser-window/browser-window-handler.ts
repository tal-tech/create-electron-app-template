// 创建browserWindow
import {
  app, BrowserWindow, ipcMain, dialog, BrowserWindowConstructorOptions,
} from 'electron';

export interface BrowserWindowExtend extends BrowserWindow {
  name: string
}

const windowMap = new Map<string, BrowserWindowExtend>();

// 创建窗口
function createWindow(
  name: string,
  options: Electron.BrowserWindowConstructorOptions,
): BrowserWindowExtend {
  const browserWindow = new BrowserWindow(options) as BrowserWindowExtend;

  browserWindow.name = name;
  windowMap.set(name, browserWindow);

  browserWindow.on('closed', () => windowMap?.delete(name));

  browserWindow.webContents.on('render-process-gone', async () => {
    const { response } = await dialog.showMessageBox({
      title: '渲染器进程崩溃',
      message: '这个进程已经崩溃.',
      buttons: ['关闭', '重载'],
    });

    if (response === 0) {
      app.quit();
      return;
    }
    browserWindow.reload();
  });
  return browserWindow;
}

// 通过name获取窗口
function getWindowByName(name: string) {
  return windowMap.get(name);
}

(async () => {
  await app.whenReady();

  // 创建窗口
  ipcMain.on('app:create-browser-window', (e, name: string, url: string, options: BrowserWindowConstructorOptions) => {
    const existedWindow = getWindowByName(name);
    if (existedWindow) {
      existedWindow.show();
      return;
    }

    const win = createWindow(name, options);
    win.loadURL(url);
  });

  // 切换控制台
  ipcMain.on('app:toggle-devtools', (e) => e.sender.toggleDevTools());
})();

export const browserWindowHandler = {
  createWindow,
  getWindowByName,
};
