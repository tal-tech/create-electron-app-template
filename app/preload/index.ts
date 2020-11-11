import { ipcRenderer, webFrame, crashReporter } from 'electron';

/**
 * 与主进程通信channel必须以 playground 字符串开始
 * @param {string} channel
 */
function validateIPC(channel: string) {
  if (!channel || !channel.startsWith('app:')) {
    throw new Error(`Unsupported event IPC channel '${channel}'`);
  }

  return true;
}

const globals = {
  // 暴露ipcRenderer 支持与主进程沟通
  ipcRenderer: {
    /**
     * 同步 没有返回值
     * @param {string} channel
     * @param {any[]} args
     */
    send(channel: string, ...args: any[]) {
      if (validateIPC(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },
    // 异步 返回值为promise
    invoke(channel: string, ...args: any[]) {
      if (validateIPC(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      return undefined;
    },

    /**
     * @param {string} channel
     * @param {(event: import('electron').IpcRendererEvent, ...args: any[]) => void} listener
     */
    on(
      channel: string,
      listener: (
        event: import('electron').IpcRendererEvent,
        ...args: any[]
      ) => void,
    ) {
      if (validateIPC(channel)) {
        ipcRenderer.on(channel, listener);
      }
    },

    /**
     * @param {string} channel
     * @param {(event: import('electron').IpcRendererEvent, ...args: any[]) => void} listener
     */
    once(
      channel: string,
      listener: (
        event: import('electron').IpcRendererEvent,
        ...args: any[]
      ) => void,
    ) {
      if (validateIPC(channel)) {
        ipcRenderer.once(channel, listener);
      }
    },

    /**
     * @param {string} channel
     * @param {(event: import('electron').IpcRendererEvent, ...args: any[]) => void} listener
     */
    removeListener(
      channel: string,
      listener: (
        event: import('electron').IpcRendererEvent,
        ...args: any[]
      ) => void,
    ) {
      if (validateIPC(channel)) {
        ipcRenderer.removeListener(channel, listener);
      }
    },
  },

  // 环境变量访问
  process: {
    get platform() {
      return process.platform;
    },
    get env() {
      return process.env;
    },
    get versions() {
      return process.versions;
    },
    get type() {
      return 'renderer';
    },

    cwd() {
      return process.cwd();
    },
    crash() {
      return process.crash();
    },
  },
  webFrame: {
    /**
     * @param {number} level
     */
    setZoomLevel(level: number) {
      if (typeof level === 'number') {
        webFrame.setZoomLevel(level);
      }
    },
  },

  crashReporter: {
    addExtraParameter(key: string, value: string) {
      crashReporter.addExtraParameter(key, value);
    },
  },
};

window.$preload = globals;
