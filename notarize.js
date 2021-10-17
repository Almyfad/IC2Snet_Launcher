require('dotenv').config();
const { notarize } = require('electron-notarize');

return -1;

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  console.log(`output path is : ${appOutDir}/${appName}.app`)

  return await notarize({
    appBundleId: 'com.IC2SNET.Launcher',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};