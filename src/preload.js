const { contextBridge, ipcRenderer } = require('electron')
const rive = require('rive-js')
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



contextBridge.exposeInMainWorld('rive', {
    appstart: (canvas) =>
        new rive.Rive({
            src: __dirname + "/../assets/appstart.riv",
            canvas: document.getElementById(canvas),
            autoplay: true,
        })

})

contextBridge.exposeInMainWorld('systray', {
    me: () => ipcRenderer.invoke('systray:me'),
})

contextBridge.exposeInMainWorld('topbarmenu', {
    close: () => ipcRenderer.invoke('topbarmenu:close'),
    min: () => ipcRenderer.invoke('topbarmenu:min'),
    max: () => ipcRenderer.invoke('topbarmenu:max'),
})