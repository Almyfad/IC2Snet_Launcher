const tls = require('tls');
const fs = require('fs');

const options = {

    key: fs.readFileSync('./certs/server/server.key'),
    cert: fs.readFileSync('./certs/server/server.crt'),
    ca: fs.readFileSync('./certs/ca/ca.crt'), // authority chain for the clients
    requestCert: true, // ask for a client cert
    //rejectUnauthorized: false, // act on unauthorized clients at the app level
};

const server = tls.createServer(options, (socket) => {
    console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(socket);


    socket.on('data', (data) => {
        console.log(data)
    });
});




const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
    console.log("newSession",Object.keys(tlsSessionStore).length )
    tlsSessionStore[id.toString('hex')] = data;
    cb();
});
server.on('resumeSession', (id, cb) => {
    cb(null, tlsSessionStore[id.toString('hex')] || null);
});




server.listen(2323, () => {
    console.log('server bound');
});
