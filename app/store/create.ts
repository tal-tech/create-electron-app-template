import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import { IStore } from './types';

// 用于本地数据存储，electron-store会通过文件的方式存储数据
const store = new Store<IStore>();

(async () => {
  await app.whenReady();

  const ipcHandlers = {
    'app:store-get': store.get,
    'app:store-set': store.set,
    'app:store-has': store.has,
    'app:store-clear': store.clear,
    'app:store-reset': store.reset,
    'app:store-delete': store.delete,
    'app:store-open-in-editor': store.openInEditor,
  };
  Object.entries(ipcHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (e, ...args) => {
      const res = (handler as Function).call(store, ...args);
      return res;
    });
  });
})();

export { store };
