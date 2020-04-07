// Modules to control application life and create native browser window

const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const path = require('path')
const url = require('url')
const Menu = electron.Menu
let mainWindow

// Create the browser window.
function createWindow () {
  // Menu.setApplicationMenu(null) // 隐藏默认菜单栏
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      // webSecurity: false,
      allowDisplayingInsecureContent:true,
      allowRunningInsecureContent:true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.maximize() // 窗口最大化
  mainWindow.show()
  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
// 忽略证书相关错误
app.commandLine.appendSwitch('ignore-certificate-errors')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.