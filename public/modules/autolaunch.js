var AutoLaunch = require('auto-launch');

module.exports = (app) => {

    if (process.platform === 'darwin')
        app.setLoginItemSettings({ openAtLogin: true })
    else {

        var Myapp = new AutoLaunch({
            name: 'ic2snet-launcher',
        });

        Myapp.enable();
        Myapp.isEnabled()
            .then(function (isEnabled) {
                if (isEnabled) {
                    return;
                }
                Myapp.enable();
            })
            .catch(function (err) {

            });
    }

}