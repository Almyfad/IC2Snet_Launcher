const { AppImageUpdater, MacUpdater, NsisUpdater } = require("electron-updater");

module.exports = (app, log, GetmainWindow) => {
  if (process.platform === "win32") {
    autoUpdater = new NsisUpdater(options)
  }
  else if (process.platform === "darwin") {
    autoUpdater = new MacUpdater(options)
  }
  else {
    autoUpdater = new AppImageUpdater(options)
  }

  let isdownloading = false;
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "Almyfad",
    repo: "IC2Snet_Launcher_release",
    //token: t.value
  })

  autoUpdater.on('download-progress', (progressobj) => {
    log.info('[download-progress] ' + progressobj.percent);
    // SEND TO REACT
    /*  if (GetmainWindow()) // Is null on systray
        GetmainWindow().webContents.send('wb-updating', progressobj)*/
  })



  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    log.info('[update-downloaded]');
    try {
      autoUpdater.quitAndInstall(true, true);
    } catch (e) {
      log.error('Error Failed to install updates' + JSON.stringify(e));
    }
    isdownloading = false;
  })

  autoUpdater.on('error', message => {
    log.error('There was a problem updating the application')
    log.error(message)
    isdownloading = false;
  })



  setInterval(() => {
    if (!isdownloading) {
      autoUpdater.checkForUpdates()
    } else {
      log.info('[setInterval-tick] Downloading...SKipping New Update Check');
    }
  }, 30 * 1000);

};