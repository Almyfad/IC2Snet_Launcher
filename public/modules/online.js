const port = 2323;
const hostname = 'vps-15b74b37.vps.ovh.net';
const tls = require('tls');
const fs = require('fs');
const path = require('path');



module.exports = (app, log, DeviceId, powerMonitor) => {
  var interval;
  var reconecting = false;
  const options = {
    host: hostname,
    port: port,
    // Necessary only if using the client certificate authentication
    key: fs.readFileSync(path.join(__dirname, '/certs/client/client.key')),
    cert: fs.readFileSync(path.join(__dirname, './certs/client/client.crt')),
    // Necessary only if the server uses the self-signed certificate
    ca: fs.readFileSync(path.join(__dirname, './certs/ca/ca.crt'))
  };

  const CreateMsg = () => {
    var os = require('os');
    let arch, platform, hostname
    try {
      arch = os.arch() ?? ""
    } catch (e) {
      log.info("Couldn't find  os.arch()")
    }

    try {
      platform = os.platform() ?? ""
    } catch (e) {
      log.info("Couldn't find  os.platform()")

    }

    try {
      hostname = os.hostname() ?? ""
    } catch (e) {
      log.info("Couldn't find  os.hostname()")

    }

    return JSON.stringify({
      id: DeviceId,
      arch: os.arch() ?? "",
      platform: os.platform() ?? "",
      hostname: os.hostname() ?? "",
      username: process.env.username,
      getVersion: app.getVersion(),
      online: true,
      reconecting: reconecting
    });

  }

  let ClientSocket;

  launchInterval = () => {
    log.info("launchInterval")
    if (interval)
      clearInterval(interval)
    ClientSocket = Connect()
    return setInterval(() => {
      if (ClientSocket.pending && !ClientSocket.connecting) {
        ClientSocket = Connect()
        log.info("[online]reconect")
      } else {
        //    log.info(`[online] pending: ${ClientSocket.pending} connecting :${ClientSocket.connecting}`,)
      }
    }, 5000);
  }
  Connect = () => {
    return tls.connect(options, () => {
      log.info('client connected', ClientSocket.authorized ? 'authorized' : 'unauthorized');
      ClientSocket.write(CreateMsg())
      reconecting = false;
    })
      .setEncoding('utf8')
      .setKeepAlive(true, 300000)//Toutes les 5min
      .on('data', (data) => {
        log.info("[online]receveing data")
        try {
          let msg = JSON.parse(data)
          if (msg)
            if (msg.type === "SOCKET_MAX_TIME_REACH")
              if (msg.reconect === true)
                reconecting = true
        }
        catch (err) { }
      })
      .on('error', (err) => {
        log.info('[online]Socket error reconecting');
      })
      .on('end', () => {
        log.info('[online]Socket ended from other end!');
      });
  }

  interval = launchInterval()


  powerMonitor.on('suspend', () => {
    log.info("[PM][Online]Machine suspending...")
    if (interval)
      clearInterval(interval)
  });

  powerMonitor.on('resume', () => {
    log.info("[PM][Online]Machine resuming...")
    interval = launchInterval()

  });

}


