const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('about', {
    chrome: () =>  process.versions['chrome'],
    node: () =>  process.versions['node'],
    electron: () =>  process.versions['electron'],
    version: () =>  process.argv.find(x => x.includes("ic2s-net-version-")).replace("ic2s-net-version-", ""),
})


contextBridge.exposeInMainWorld('topbarmenu', {
    close: () => ipcRenderer.invoke('topbarmenu:close'),
    min: () => ipcRenderer.invoke('topbarmenu:min'),
    max: () => ipcRenderer.invoke('topbarmenu:max'),
    menuapp: () => ipcRenderer.invoke('topbarmenu:manuapp'),
})


contextBridge.exposeInMainWorld('profil', {
    isadmin: () => ipcRenderer.invoke('profil:isadmin'),
})