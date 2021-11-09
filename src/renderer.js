window.rive.appstart('canvas')

document.getElementById('asystrayme').addEventListener('click',  () => {
	window.systray.me();
})

document.getElementById('minimizeAppBtn').addEventListener('click',  () => {
	window.topbarmenu.min();
})

document.getElementById('maxResAppBtn').addEventListener('click',  () => {
	window.topbarmenu.max();
})

document.getElementById('CloseAppBtn').addEventListener('click',  () => {
	window.topbarmenu.close();
})
