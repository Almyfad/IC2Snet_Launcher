const { app, BrowserWindow, Menu, Tray, nativeTheme, ipcMain, shell, powerMonitor } = require('electron')
const log = require("electron-log")
const isDev = require('electron-is-dev');
const path = require('path');
var { machineIdSync } = require('node-machine-id');
nativeTheme.themeSource = 'dark'
let mainWindow = null;
let trayIcon = null; //Prevent garbage collecter to make disapear icon

let DeviceId = machineIdSync()
const PrereleaseDevices = [
  "76c86dda3eaa1eff2a71b1b2b3eadd1e9bc9baa10984681cbf96fb4c0e465bd0", //cs-macbookpro.local
  "b6c83609a09238b183b08a6a3d4fdd5acefbbef9beb6b0e8e45e4577a6897fe0" //LAPTOP-969GB5UC
]
const AdminDevices = [
  "76c86dda3eaa1eff2a71b1b2b3eadd1e9bc9baa10984681cbf96fb4c0e465bd0", //cs-macbookpro.local
  "b6c83609a09238b183b08a6a3d4fdd5acefbbef9beb6b0e8e45e4577a6897fe0", //LAPTOP-969GB5UC
  "8f46dcfa7ee0e40420ef0574a41ab485bdd4e2022af193c7d56038a9b2ba9a28", //R2D2
  "63e729a8545bfb178f79842ac45188351e6a54a7cc3ab42322c2328b2a30b9b1", //ic2snet-minimac.home
  "b128c15d73dcc15fb602bc2728dec54ca4df488b30b0f0514f2c56091cb7ec49", //ic2snet-ipad.home
]

const IsAdmin = () => AdminDevices.includes(DeviceId)
const IsPrelease = () => PrereleaseDevices.includes(DeviceId)

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
  trayIcon = new Tray(path.join(__dirname, 'assets/img/icon16x16.png'))
  const contextTrayedMenu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir', click: show
    },
    {
      label: 'Fichier de log', click: () => shell.openPath(log.transports.file.getFile().path)
    },
    {
      label: 'Quitter', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  trayIcon.setToolTip('IC2S.net Intranet')
  trayIcon.setContextMenu(contextTrayedMenu)
  return trayIcon;
}
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/



/*---------------------AUTO UPDATER------------------------*/
/*---------------------------------------------------------*/

require('./modules/autoupdater')(app, log, IsPrelease())

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/


/*---------------------AUTO LAUNCH------------------------*/
/*---------------------------------------------------------*/

require('./modules/autolaunch')(app);

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

/*---------------------   ONLINE   ------------------------*/
/*---------------------------------------------------------*/

require('./modules/online')(app, log, DeviceId);


/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

/*---------------------   EVENT    ------------------------*/
/*---------------------------------------------------------*/

app.whenReady().then(() => {
  SetTray()
  if (isDev)
    show()
  else
    hide()
  /* createWindow()
   app.on('activate', function () {
     if (BrowserWindow.getAllWindows().length === 0) createWindow()
   })*/
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
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

  let vs = `ic2s-net-version-${app.getVersion()}`;
  mainWindow = new BrowserWindow({
    title: 'ic2snet-intranet ' + vs.replace("ic2s-net-version-", "v"),
    show: isDev,
    frame: false,
    minHeight: 1024,
    minWidth: 1280,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, '/preload.js'),
      additionalArguments: [vs.toString()]
    }
  })

  if (isDev)
    mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      hide();
    }
    return false;
  });

  mainWindow.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`)


  //  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
}


function hide() {
  if (process.platform === 'darwin')
    app.dock.hide();
  if (mainWindow) {
    mainWindow.hide();
  }

  mainWindow = null;
}

function show() {
  if (process.platform === 'darwin')
    app.dock.show();
  if (!mainWindow)
    createWindow()
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
  mainWindow.maximize();
  mainWindow.show();
}



/*--------------------------EVENT--------------------------*/
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

ipcMain.handle('systray:me', () => { hide() });
ipcMain.handle('profil:isadmin', () => IsAdmin());
ipcMain.handle('topbarmenu:close', () => { hide() });

ipcMain.handle('topbarmenu:min', () => {
  mainWindow.minimize()
});
ipcMain.handle('topbarmenu:max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
});
ipcMain.handle('topbarmenu:menuapp', () => {
 
});