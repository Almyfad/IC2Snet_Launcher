const { app, BrowserWindow, Menu, Tray } = require('electron')
const log = require("electron-log")
const path = require('path');
const { autoUpdater } = require("electron-updater")
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()


let mainWindow = null;

/*---------------------UNIQ INSTANCE------------------------*/
/*---------------------------------------------------------*/
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/


/*---------------------    TRAY    ------------------------*/
/*---------------------------------------------------------*/
let SetTray = () => {
  let tray = null
  tray = new Tray(path.join(__dirname, 'icon16x16.png'))
  const contextTrayedMenu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir', click: show
    },
    {
      label: 'Quitter', click: function () {
        app.isQuiting = true;
        RemoveMountedFolder()
        app.quit();
      }
    }
  ]);
  tray.setToolTip('IC2S.net Intranet')
  tray.setContextMenu(contextTrayedMenu)
  return tray;
}
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/


var menu = Menu.buildFromTemplate([])
Menu.setApplicationMenu(menu);

/*---------------------AUTO UPDATER------------------------*/
/*---------------------------------------------------------*/

require('./autoupdater')(app, log, () => mainWindow)

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/



/*---------------------   EVENT    ------------------------*/
/*---------------------------------------------------------*/

app.whenReady().then(() => {
  SetTray()
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


//DARWIN
app.on('activate', () => {
  show()
});

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/



function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'ic2snet-intranet ',
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })


  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      hide();
    }
    return false;
  });

  mainWindow.loadFile('index.html')
}


function hide() {
  if (process.platform === 'darwin')
    app.dock.hide();
  if (mainWindow) {
    mainWindow.hide();
  }
  /* if (!config.CurrentCTX.updating.get())
     config.CurrentCTX.systray.set(true)*/
}

function show() {
  if (process.platform === 'darwin')
    app.dock.show();
  if (!mainWindow)
    createWindow()
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
  mainWindow.show();
  /* if (!config.CurrentCTX.updating.get())
     config.CurrentCTX.systray.set(false)*/
}




