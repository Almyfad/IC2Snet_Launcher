window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    console.log(process)
    replaceText("ic2sversion", process.argv.find(x => x.includes("ic2s-net-version-")).replace("ic2s-net-version-",""))
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }


})