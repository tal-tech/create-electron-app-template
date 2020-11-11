import {
  nativeTheme, Tray, app, Menu,
} from 'electron';
import { mainWindow } from 'app/browser-window';
import path from 'path';

const lightIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_light.png');
const darkIcon = path.join(__dirname, '..', '..', 'resources', 'tray', 'StatusIcon_dark.png');
const trayMenu = Menu.buildFromTemplate([
  { label: '打开应用', click: mainWindow.restore },
  { label: '退出', click: app.quit },
]);

(async () => {
  await app.whenReady();

  const tray = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon);

  tray.setToolTip('my-app');
  tray.setTitle(' some message');
  tray.setContextMenu(trayMenu);
  tray.on('double-click', mainWindow.restore);

  nativeTheme.on('updated', () => {
    tray?.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon);
  });
})();
