const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    replaceText("ic2sversion", process.argv.find(x => x.includes("ic2s-net-version-")).replace("ic2s-net-version-", ""))
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
});


contextBridge.exposeInMainWorld('topbarmenu', {
    close: () => ipcRenderer.invoke('topbarmenu:close'),
    min: () => ipcRenderer.invoke('topbarmenu:min'),
    max: () => ipcRenderer.invoke('topbarmenu:max'),
})


contextBridge.exposeInMainWorld('profil', {
    isadmin: () => ipcRenderer.invoke('profil:isadmin'),
})