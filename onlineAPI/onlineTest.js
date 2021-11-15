const port = 2323;
const hostname = 'vps-15b74b37.vps.ovh.net';
const tls = require('tls');
const fs = require('fs');



//module.exports = (app, log, DeviceId, powerMonitor) => {
var interval;
const options = {
  host: hostname,
  port: port,
  // Necessary only if using the client certificate authentication
  key: fs.readFileSync('certs/client/client.key'),
  cert: fs.readFileSync('certs/client/client.crt'),
  // Necessary only if the server uses the self-signed certificate
  ca: fs.readFileSync('certs/ca/ca.crt')
};

const CreateMsg = () => {
  var os = require('os');
  let arch
  let platform
  let hostname
  try {
    arch = os.arch() ?? ""
  } catch (e) {
    console.log("Couldn't find  os.arch()")
  }

  try {
    platform = os.platform() ?? ""
  } catch (e) {
    console.log("Couldn't find  os.platform()")

  }

  try {
    hostname = os.hostname() ?? ""
  } catch (e) {
    console.log("Couldn't find  os.hostname()")

  }

  return JSON.stringify({
    id: "DeviceId" ?? "NoId",
    arch: os.arch() ?? "",
    platform: os.platform() ?? "",
    hostname: os.hostname() ?? "",
    username: process.env.username,
    getVersion: "app.getVersion() " ?? "No Version",
    online: true,
  });

}

let ClientSocket;

launchInterval = () => {
  console.log("launchInterval")
  if (interval)
    clearInterval(interval)
  ClientSocket = Connect()
  return setInterval(() => {
    if (ClientSocket.pending && !ClientSocket.connecting) {
    //  ClientSocket = Connect()
      console.log("[online]reconect")
    } else {
      //    console.log(`[online] pending: ${ClientSocket.pending} connecting :${ClientSocket.connecting}`,)
    }
  }, 5000);
}
Connect = () => {
  return ClientSocket = tls.connect(options, () => {
    console.log('client connected',
      ClientSocket.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(ClientSocket);
    process.stdin.resume();
    ClientSocket.write(CreateMsg())
    // socket.end();
  })
    .setEncoding('utf8')
    .setKeepAlive(true, 300000)//Toutes les 5min
    .on('data', (data) => {
      console.log("online:receveing data")
    })
    .on('error', (err) => {
      console.log('online:Socket error reconecting');
    })
    .on('end', () => {
      console.log('online:Socket ended from other end!');
    });
}

interval = launchInterval()


/*  powerMonitor.on('suspend', () => {
    console.log("[PM][Online]Machine suspending...")
    if (interval)
      clearInterval(interval)
  });

  powerMonitor.on('resume', () => {
    console.log("[PM][Online]Machine resuming...")
    interval = launchInterval()

  });

}
*/

