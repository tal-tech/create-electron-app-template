import { BrowserWindowExtend } from 'app/browser-window/browser-window-handler';
import { app, dialog, ipcMain } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';

// 工厂方法批量生产函数供便捷调用
function showOpenDialogGenerator(opt: Electron.OpenDialogOptions) {
  return (
    options: Electron.OpenDialogOptions,
    browserWindow?: BrowserWindowExtend,
  ) => {
    const finalOptions = { ...opt, ...options };

    if (browserWindow) {
      return dialog.showOpenDialog(browserWindow, finalOptions);
    }
    return dialog.showOpenDialog(finalOptions);
  };
}

// 创建便捷的ipc处理函数
function handleIpc(handler: ReturnType<typeof showOpenDialogGenerator>) {
  return async (event: IpcMainInvokeEvent, options: Electron.OpenDialogOptions) => {
    const res = await handler(options);
    return res;
  };
}

// 选择文件与选择文件夹方法分离是因为在windows和linux上不支持同时选择文件或文件夹
const openFile = showOpenDialogGenerator({ properties: ['openFile'] });
const openDirectory = showOpenDialogGenerator({ properties: ['openDirectory'] });
const showOpenDialog = showOpenDialogGenerator({});

export const openDialog = {
  openFile,
  openDirectory,
  showOpenDialog,
};

(async () => {
  await app.whenReady();
  ipcMain.handle('app:open-file', handleIpc(openFile));
  ipcMain.handle('app:open-directory', handleIpc(openDirectory));
  ipcMain.handle('app:show-open-dialog', handleIpc(showOpenDialog));
})();
