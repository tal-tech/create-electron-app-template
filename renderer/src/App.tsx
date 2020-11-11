import React, { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [appInfo, setAppInfo] = useState(null)
  const [selectedPaths, setSelectedPaths] = useState([])
  const [storeValue, setStoreValue] = useState('')
  const [getStoreValue, SetGetStoreValue] = useState('')
  const [autoStart, setAutoStart] = useState(false)
  const updateStatusRef = useRef<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [num, setNum] = useState(Math.random())

  useEffect(() => {
    window.$preload.ipcRenderer.on('app:update-status-change', (e: any, eventName: string)=>{
      updateStatusRef.current = [...updateStatusRef.current, eventName]
      setNum(Math.random())
    })
  },[])

  useEffect(()=>{
    // 上下文菜单
    window.addEventListener('contextmenu', (e) => {
      const options = { x: e.x, y: e.y }
      window.$preload.ipcRenderer.invoke('app:popup-menu', options)
    })
  },[])

  // 获取是否自动启动
  const GetOpenAtLogin = async () => {
    const openAtLogin = await window.$preload.ipcRenderer.invoke(
      'app:get-open-login'
    )
    setAutoStart(openAtLogin)
  }

  useEffect(() => {
    GetOpenAtLogin()
    getStore()
  }, [])

  const getAppInfo = async () => {
    const info = await window.$preload.ipcRenderer.invoke('app:get-app-info')
    setAppInfo(info)
  }

  const openDialog = async () => {
    const res = await window.$preload.ipcRenderer.invoke(
      'app:show-open-dialog',
      {
        title: '选择文件或文件夹',
        properties: ['openFile', 'openDirectory'],
      }
    )
    const { canceled, filePaths } = res
    if (!canceled) {
      setSelectedPaths(filePaths)
    }
  }

  // store 增删改查
  const storeName = 'token'
  const changeStoreValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoreValue(event.target.value)
  }
  const setStore = () => {
    window.$preload.ipcRenderer.invoke('app:store-set', storeName, storeValue)
  }
  const getStore = async () => {
    const res = await window.$preload.ipcRenderer.invoke('app:store-get', storeName)
    SetGetStoreValue(res)
  }
  const deleteStore = () => {
    window.$preload.ipcRenderer.invoke('app:store-delete', storeName)
  }

  const openStoreInEditor = () => {
    window.$preload.ipcRenderer.invoke('app:store-open-in-editor', storeName)
  }

  // 开机自启
  const changeAutoStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    setAutoStart(target.checked)
    window.$preload.ipcRenderer.send('app:set-login', target.checked)
  }

  // 制造渲染进程报错
  const clickCrash = () => {
    window.$preload.process.crash()
  }

  // 进程崩溃报告(crash report)
  const watchCrash = () => {
    window.$preload.crashReporter.addExtraParameter('额外崩溃信息', '用户token&链接地址等')
  }

  // web frame的大小
  const frameScale = (size: number) => {
    window.$preload.webFrame.setZoomLevel(size)
  }
  return (
    <div className="App">
      <h3>1. 窗口</h3>
      <div>
        <button
          onClick={() =>
            window.$preload.ipcRenderer.send(
              'app:create-browser-window',
              'Github',
              'https://github.com'
            )
          }
        >
          创建窗口打开Github
        </button>
        <button
          onClick={() =>
            window.$preload.ipcRenderer.send('app:toggle-devtools')
          }
        >
          打开/关闭控制台
        </button>
      </div>

      <h3>2. 获取APP信息</h3>
      <div>
        <button onClick={getAppInfo}>获取APP信息</button>
        {appInfo && <p>{JSON.stringify(appInfo)}</p>}
      </div>

      <h3>3. 环境信息</h3>
      <div>
        <p>
          {' '}
          <strong>cwd</strong>: {window.$preload.process.cwd()}
        </p>
        <p>
          {' '}
          <strong>platform</strong>: {window.$preload.process.platform}
        </p>
      </div>

      <h3>3. 检查更新</h3>
      <div>
        <button onClick={() => window.$preload.ipcRenderer.send('app:check-update')}>检查更新</button>
        <p>更新状态变化：</p>
        <ul>
          {updateStatusRef.current.map((item,index) => <li key={index}>{item}</li>)}
        </ul>
      </div>

      <h3>4. dialog</h3>
      <div>
        <button
          onClick={() =>
            window.$preload.ipcRenderer.send('app:show-message-box', {
              message: '提示信息',
            })
          }
        >
          显示对话框
        </button>
        <button onClick={openDialog}>选择文件或文件夹</button>
        <p>已选择路径：{selectedPaths.map((p) => p)}</p>
      </div>
      <h3>5. store</h3>
      <div>
        <button onClick={setStore}>set store</button>
        <input type="text" value={storeValue} onChange={changeStoreValue} />
      </div>
      <div>
        <button onClick={getStore}>get store</button>
        <span>{getStoreValue}</span>
      </div>
      <div>
        <button onClick={deleteStore}>delete store</button>
      </div>
      <div>
        <button onClick={openStoreInEditor}>open in editor</button>
      </div>

      <h3>6. APP设置</h3>
      <div>
        <input
          type="checkbox"
          name="auto-start"
          checked={autoStart}
          onChange={changeAutoStart}
        />
        <label htmlFor="auto-start">开启开机自启</label>
      </div>
      <h3>7. crash reporter</h3>
      <div>
        <button onClick={clickCrash}>制造进程崩溃(click crash)</button>
        <button onClick={watchCrash}>进程崩溃报告(crash report)</button>
      </div>
      <h3>8. webFrame</h3>
      <div>
        <button
          onClick={() => {
            frameScale(0.8)
          }}
        >
          0.8x
        </button>
        <button
          onClick={() => {
            frameScale(1)
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            frameScale(1.5)
          }}
        >
          1.5x
        </button>
        <button
          onClick={() => {
            frameScale(2)
          }}
        >
          2x
        </button>
      </div>
    </div>
  )
}

export default App
