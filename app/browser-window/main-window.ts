import path from 'path';
import { browserWindowHandler } from './browser-window-handler';

const MAIN_WINDOW = 'MAIN_WINDOW';

const DEV_PATH = 'http://localhost:3000';
const PROD_PATH = path.resolve(__dirname, '..', 'renderer', 'index.html');

// 获取主窗口实例
function getWindow() {
  return browserWindowHandler.getWindowByName(MAIN_WINDOW);
}

// 恢复主窗口显示
function restore() {
  const win = getWindow();
  win?.restore();
  win?.show();
}

// 主窗口关闭事件
function onClose(e: Electron.Event) {
  e.preventDefault();
  const win = getWindow();
  win?.hide();
}

// 手动关闭主窗口
function close() {
  const win = getWindow();
  win?.off('close', onClose);
  win?.close();
}

function create() {
  const win = browserWindowHandler.createWindow(MAIN_WINDOW, {
    width: 1024,
    height: 768,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.resolve(__dirname, './preload'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win?.loadURL(DEV_PATH);
  } else {
    win?.loadFile(PROD_PATH);
  }
  win.on('close', onClose);
}

export const mainWindow = {
  getWindow,
  restore,
  close,
  create,
};
