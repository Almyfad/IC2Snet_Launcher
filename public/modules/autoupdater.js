const { autoUpdater } = require("electron-updater");

module.exports = (app, log, PrereleaseDevice) => {

  if (PrereleaseDevice) {
    autoUpdater.allowPrerelease = true;
    log.info("[AutoUpdate]allowPrerelease")
  }
  let isdownloading = false;
  autoUpdater.logger = log;


  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "Almyfad",
    repo: "IC2Snet_Launcher_release",
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
      setTimeout(() => {
        app.isQuiting = true;
        app.removeAllListeners("window-all-closed")
        autoUpdater.quitAndInstall(true, true);
      }, 500);
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

  checkForUpdates = () => {
    if (!isdownloading) {
      autoUpdater.checkForUpdates()
    } else {
      log.info('[setInterval-tick] Downloading...SKipping New Update Check');
    }
  }
  checkForUpdates()
  setInterval(() => {
    checkForUpdates()
  }, 60 * 1000);

};