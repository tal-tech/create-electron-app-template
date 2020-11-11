# create-electron-app-template

一个基本的electron模板，旨在提供一个有完整的基础功能和工程化设置的electron项目

如果你已经有了web项目，那么你只只需要替换一点点代码，就立马就可以拥有一个pc客户端了

## 开发
构建
```
yarn dev
```
启动
```
yarn start
```

若使用vscode也可以按F5启动debugger调试，支持断点；

## 打包
```
yarn run pack
```

- 根据命令行提示输入相应更新信息
- 打好的包默认在release目录下；

## 替换renderer

本项目中的renderer为create-react-app搭建的示例项目，开发者可自行删除并导入或搭建自己的项目；

替换项目，最主要是保证构建输出的目录(`/renderer/build`)和原来一致，开发构建命令(`yarn start`)和生产构建命令(`yarn build`)一致；

以新建一个angular项目替换为例：
1. 删除现在的渲染进程目录；
1. `ng new renderer`新建一个项目；
2. 将[/app/browser-window/main-window.ts](/app/browser-window/main-window.ts)中的`DEV_PATH`改为`http://localhost:4200`，因为Angular和React的默认开发端口不一样；
3. 修改[./renderer/angular.json](./renderer/angular.json)中的`outputPath`为`build`，构建后的文件同样输出到build目录；
4. 修改[./renderer/package.json](./renderer/package.json)中`scripts.build`为`ng build --base-href=./ --deploy-url=./`，因为在打包后是使用file协议加载；
   
> 如果不想用file协议，需要使用http协议，也可以通过启动本地服务的方式解决；
>
> 不想每次都将静态资源打入包内，而是启动应用时就更新，也有方法可做。我们预计会在两周内推出教程；

## 打包流程解析

具体实现参见[./build/pack.ts](./build/pack.ts)

1. 获取打包配置，如果是CI环境直接读取启动参数，否则弹出命令行交互选项输入配置参数；
2. 使用`npm version a.b.c`更新版本号；
3. 根据打包配置文件更新[./electron-builder.json](./electron-builder.json)，这个文件是`electron-builder`进行打包时会读取的配置项；
4. 更新[./CHANGELOG.md](./CHANGELOG.md)；
5. 构建主进程和preload的代码，输出到`/output/main`下；
6. 构建渲染进程的代码，输出到`/renderer/build`下，然后复制到`/output/renderer`目录；
7. 使用`electron-builder`开始打包，打好的包在`/release`目录；

## 自动更新配置

修改[./build/pack-config.ts](./build/pack-config.ts)中的`publish.url`，每次将打好的包上传到对应的服务器地址即可；

- 也可参考[electron-builder文档](https://www.electron.build/auto-update)中的其他服务器配置选项；

## 项目目录结构
```
.
├── app                           // 主进程代码
├── build                         // 构建脚本和配置
├── output                        // 构建输出目录
├── release                       // 打包输出目录
├── renderer                      // 渲染进程代码
├── resources                     // 资源文件
├── CHANGELOG.md                  // 更新日志
├── README.md                     
├── commitlint.config.js          // 提交规范配置
├── config.json                   // 项目基础配置
├── electron-builder.json         // 生成的打包配置，不需要修改
├── package-lock.json
├── package.json
├── tsconfig.json
└── yarn.lock
```
