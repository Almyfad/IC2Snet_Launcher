const { app, BrowserWindow, Menu, Tray, nativeTheme, ipcMain,shell } = require('electron')
const log = require("electron-log")
const isDev = require('electron-is-dev');
const path = require('path');
const {db} = require('./firebase-config');


const onlinestream = (callback) => db.collection("online").onSnapshot(snap => {
  const data = snap.docs.map(doc => doc.data())
  if (callback)
      callback(data)
})

nativeTheme.themeSource = 'dark'
let mainWindow = null;
let trayIcon = null; //Prevent garbage collecter to make disapear icon



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
      label:'Fichier de log' , click:() => shell.openPath(log.transports.file.getFile().path)
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

require('./src/autoupdater')(app, log, () => mainWindow)

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/


/*---------------------AUTO LAUNCH------------------------*/
/*---------------------------------------------------------*/

require('./src/autolaunch')(app);

/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

/*---------------------   EVENT    ------------------------*/
/*---------------------------------------------------------*/

app.whenReady().then(() => {
  SetTray()
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
    //transparent: true,
    //  maxWidth: 1920,
    //maxheight: 720,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'src/preload.js'),
      additionalArguments: [vs.toString()]
    }
  })

  if (isDev)
    mainWindow.webContents.openDevTools()

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

  mainWindow = null;
}

function show() {
  if (process.platform === 'darwin')
    app.dock.show();
  if (!mainWindow)
    createWindow()
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
  mainWindow.show();
}



/*--------------------------EVENT--------------------------*/
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
ipcMain.handle('systray:me', () => { hide() });
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


