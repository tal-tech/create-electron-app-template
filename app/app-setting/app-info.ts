import { app, ipcMain } from 'electron';

(async () => {
  await app.whenReady();

  // 获取app基本信息
  ipcMain.handle('app:get-app-info', () => ({ version: app.getVersion(), name: app.name }));
})();
