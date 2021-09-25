const { app, BrowserWindow, Menu } = require('electron')
const log = require("electron-log")
const { autoUpdater } = require("electron-updater")
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()


let mainWindow;
var menu = Menu.buildFromTemplate([])
Menu.setApplicationMenu(menu);

/*---------------------AUTO UPDATER------------------------*/
/*---------------------------------------------------------*/

require('./autoupdater')(app, log, () => mainWindow)

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


