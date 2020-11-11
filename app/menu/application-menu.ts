import { Menu } from 'electron';
import { MenuItemConstructorOptions } from 'electron/main';

// 应用菜单，在macOS上屏幕顶部状态栏的菜单，Windows上为窗口状态栏下方的菜单
// 这里提供了一个基础的版本
const menuOptions: MenuItemConstructorOptions[] = [
  {
    role: 'appMenu',
    submenu: [
      { role: 'about', label: '关于' },
      { role: 'hide', label: '隐藏' },
      { role: 'hideOthers', label: '隐藏其他应用' },
      { role: 'quit', label: '退出' },
    ],
  },
  {
    role: 'editMenu',
    label: '编辑',
    submenu: [
      { role: 'undo', label: '撤回' },
      { role: 'redo', label: '重做' },
      { type: 'separator' },
      { role: 'cut', label: '剪切' },
      { role: 'copy', label: '复制' },
      { role: 'paste', label: '粘贴' },
      { role: 'pasteAndMatchStyle', label: '粘贴对应格式' },
      { role: 'delete', label: '删除' },
      { role: 'selectAll', label: '全选' },
    ],
  },
  {
    role: 'viewMenu',
    label: '视图',
    submenu: [
      { role: 'zoomIn', label: '放大' },
      { role: 'zoomOut', label: '缩小' },
      { role: 'resetZoom', label: '恢复默认大小' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: '切换全屏' },
    ],
  },
  {
    label: '窗口',
    submenu: [
      { role: 'minimize', label: '最小化' },
      { role: 'zoom', label: '最大化' },
      { role: 'toggleDevTools', label: '切换控制台' },
    ],
  },
];

// 设置应用菜单
function setup() {
  const menu = Menu.buildFromTemplate(menuOptions);
  Menu.setApplicationMenu(menu);
}

export const applicationMenu = {
  setup,
};
