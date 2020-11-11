import { argv } from "yargs";
import inquirer from "inquirer";
import fs from "fs";
import fsExtra from 'fs-extra'
import path from "path";
import { spawn } from "child_process";
import dayjs from 'dayjs'
import { generateConfig } from "./pack-config";

// 执行命令行
function execCommand(command: string, args: string[], options = {} ) {
  return new Promise((resolve, reject) => {
    const spawnOptions = {
      stdio: 'inherit',
      ...options,
    }
    const ls = spawn(command, args, spawnOptions as any);

    ls.on("error", console.error);

    ls.on("close", (code) => {
      code === 0 ? resolve() : reject(code);
    });
  });
}

export interface PackOptions {
  version: string
  platforms: Array<'m'|'w'|'l'>
  releaseName: string
  releaseNotes: string
}

let options: PackOptions
async function parseOptions() {
  /**
   * 在CI环境，可以将环境变量`PACKAGE_WITH_NO_INQUIRER`设置为true，然后通过启动参数传递打
   * 包配置，比如：
   * PACKAGE_WITH_NO_INQUIRER=true ts-node ./build/pack.ts --version 1.0.1 --platforms wml --releaseName "new release" --releaseNotes "1. fix something;\n2. new features;"
   *
   * 没有此变量则会弹出交互命令行，手动输入配置信息，适用开发者在自己电脑打包；
   */
  if (process.env.PACKAGE_WITH_NO_INQUIRER) {
    let { version, platforms, releaseName, releaseNotes } = argv;
    if (typeof platforms === 'string') platforms = platforms.split('')
    options = { version, platforms, releaseName, releaseNotes } as PackOptions
  } else {
    options = await inquirer.prompt<PackOptions>([
      { type: "input", name: "version", validate: Boolean },
      {
        type: "checkbox",
        name: "platforms",
        choices: [
          { name: "Windows", value: "w" },
          { name: "macOS", value: "m" },
          { name: "Linux", value: "l" },
        ],
        validate: (a) => Boolean(a.length),
      },
      { type: "input", name: "releaseName" },
      { type: "editor", name: "releaseNotes" },
    ]);
  }

  if (!(options.version && options.platforms)) {
    throw new Error(`Invalid version and platforms: ${options.version}, ${options.platforms}`);
  }

  console.log("pack options: ", options);
  return options;
}

// 更新版本号
async function updateVersion(options: PackOptions) {
  const { version } = options;
  await execCommand("npm", ["version", version]);
}

// 更新打包配置文件 `electron-builder.json`
async function updateConfigJSON(options: PackOptions) {
  const JSONPath = path.resolve(__dirname, "..", "electron-builder.json");
  const config = generateConfig(options)

  fs.writeFileSync(JSONPath, JSON.stringify(config, null, 2))
}

// 更新CHANGELOG
async function updateChangelog(options: PackOptions) {
  const { version, releaseName, releaseNotes } = options;

  const content =
    `## ${version} (${dayjs().format("YYYY-MM-DD hh:mm:ss")})\n` +
    releaseName +
    `\`\`\` 
${releaseNotes}
\`\`\`
`;

  fs.appendFileSync(path.resolve(__dirname, "..", "CHANGELOG.md"), content);
}

async function buildMain(options: PackOptions) {
  await execCommand(`npm`, ["run", "build"]);
}

// 此处的渲染进程项目在electron项目内，因此采用构建后移动到打包目录下的方法；
// 如果渲染进程是独立的项目（比如用web端项目做electron兼容），可以直接将发布好的代码下载到打包
// 目录，然后进行打包；
async function buildRenderer(options: PackOptions) {
  const rendererFolder = path.resolve(__dirname, '..', 'renderer')
  const rendererBuildFolder = path.resolve(rendererFolder, 'build')
  const targetFolder = path.resolve(__dirname, '..', 'output', 'renderer')

  await execCommand(`npm`, ["run", "build"], {cwd: rendererFolder});

  fsExtra.copySync(rendererBuildFolder ,targetFolder)
}

async function pack(options: PackOptions) {
  const { platforms } = options;
  await execCommand(`electron-builder`, ["build", `-${platforms.join('')}`]);
}

async function makePack() {
  // 获取打包配置
  const options = await parseOptions();

  // 更新版本号
  await updateVersion(options);

  // 更新json配置文件
  await updateConfigJSON(options);

  // 更新CHANGELOG
  await updateChangelog(options);

  // 构建主进程
  await buildMain(options);

  // 构建渲染进程
  await buildRenderer(options);

  // 打包
  await pack(options);
}

exports.getOptions = () => {
  console.log("options", options);
};

makePack();
