const port = 2323;
const hostname = 'vps-15b74b37.vps.ovh.net';

const tls = require('tls');
var fs = require('fs');

const options = {
  host: hostname,
  port: port,

  // Necessary only if using the client certificate authentication
  key: fs.readFileSync('certs/client/client.key'),
  cert: fs.readFileSync('certs/client/client.crt'),

  // Necessary only if the server uses the self-signed certificate
  ca: fs.readFileSync('certs/ca/ca.crt')
};

var socket = tls.connect(options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
  socket.write("hello im here")

  socket.end();
})

.setEncoding('utf8')

.on('data', (data) => {
  console.log(data);
})

.on('end', () => {
  console.log("End connection");
});