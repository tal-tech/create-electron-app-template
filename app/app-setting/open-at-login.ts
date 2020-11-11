import { app, ipcMain } from 'electron';

(async () => {
  await app.whenReady();

  // 设置开机自动启动
  ipcMain.on('app:set-login', (event, openAtLogin: boolean) => {
    app.setLoginItemSettings({
      openAtLogin, // 是否自动启动
      openAsHidden: true, // 以隐藏的方式启动应用
    });
  });

  // 获取是否开机自动启动
  ipcMain.handle('app:get-open-login', async () => app.getLoginItemSettings().openAtLogin);
})();
