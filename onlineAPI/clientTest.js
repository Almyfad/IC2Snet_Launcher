const tls = require('tls');
const fs = require('fs');

const options = {
    host: 'vps-15b74b37.vps.ovh.net',
    port: 8000,
    key: fs.readFileSync('./certs/client/client.key'),
    cert: fs.readFileSync('./certs/client/client.crt'),
    // Necessary only if the server uses the self-signed certificate
    ca: fs.readFileSync('./certs/ca/ca.crt')
};

const socket = tls.connect(options, () => {
    console.log('client connected',
        socket.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(socket);
    process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
    console.log(data);
});
socket.on('end', () => {
    server.close();
});
