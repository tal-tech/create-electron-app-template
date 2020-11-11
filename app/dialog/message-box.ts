import { BrowserWindowExtend } from 'app/browser-window/browser-window-handler';
import { app, dialog, ipcMain } from 'electron';

function createMessageBoxShow(type: NonNullable<Electron.MessageBoxOptions['type']>) {
  // 这里将window参数反置，因为一般情况下其实不会用到window参数，这里参考了vscode的做法
  // TODO: 需要考虑一点就是出现多个窗口后，每个窗口下的调用应当默认展示在该窗口下
  return function dialogShowMessageBox(
    options: Omit<Electron.MessageBoxOptions, 'type'>,
    window?: BrowserWindowExtend,
  ) {
    if (window) {
      return dialog.showMessageBox(window, { type, ...options });
    }
    return dialog.showMessageBox({ type, ...options });
  };
}

// 将不同类型的messageBox封装成不同方法，简化调用
export const messageBox = {
  none: createMessageBoxShow('none'),
  info: createMessageBoxShow('info'),
  error: createMessageBoxShow('error'),
  question: createMessageBoxShow('question'),
  warning: createMessageBoxShow('warning'),
};

(async () => {
  await app.whenReady();
  ipcMain.on('app:show-message-box', (event, options: Electron.MessageBoxSyncOptions) => {
    dialog.showMessageBoxSync(options);
  });
})();
