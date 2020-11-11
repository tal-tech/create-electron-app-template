import { ipcMain, Menu } from 'electron';
import { IpcMainInvokeEvent, MenuItemConstructorOptions, PopupOptions } from 'electron/main';

function popup(
  menuOptions: MenuItemConstructorOptions[],
  popupOptions?: Electron.PopupOptions,
) {
  const menu = Menu.buildFromTemplate(menuOptions);
  menu.popup(popupOptions);

  return menu;
}

// 通常用于在browserWindow上显示菜单，类似浏览器的右键菜单
export const contextMenu = {
  popup,
};

(async () => {
  ipcMain.handle('app:popup-menu', async (e:IpcMainInvokeEvent, options: PopupOptions) => {
    const menu:MenuItemConstructorOptions[] = [
      { label: '刷新', click: () => e.sender.reload() },
      { label: '返回', click: () => e.sender.goBack(), visible: e.sender.canGoBack() },
      { label: '前进', click: () => e.sender.goForward(), visible: e.sender.canGoForward() },
      { label: '切换控制台', click: () => e.sender.toggleDevTools() },
    ];

    popup(menu, options);
  });
})();
