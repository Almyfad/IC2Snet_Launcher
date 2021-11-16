const tls = require('tls');
const fs = require('fs');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const docrefOnline = firestore.collection('online')


const PORT = 2323
const MAXCONNECTIONS = 100
const KILL_SOCKET_TIME = 1800000 //30minutes
const SOCKET_TIMEOUT = 600000  //86400000 1jour
//const tlsSessionStore = {};

const options = {

    key: fs.readFileSync('./certs/server/server.key'),
    cert: fs.readFileSync('./certs/server/server.crt'),
    ca: fs.readFileSync('./certs/ca/ca.crt'), // authority chain for the clients
    requestCert: true, // ask for a client cert
    //rejectUnauthorized: false, // act on unauthorized clients at the app level
};

const server = tls.createServer(options, (socket) => {
    let CurrentDeviceMSg = null
    let fireDocDevice = null
    console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');
    socket.setEncoding('utf8');
    socket.pipe(socket);

    socket.setTimeout(SOCKET_TIMEOUT, function () {
        console.log('Socket timed out');
        socket.destroy();
    });

    socket.on('data', (data) => {
        CurrentDeviceMSg = JSON.parse(data);
        fireDocDevice = docrefOnline.doc(CurrentDeviceMSg.id)
        online()
    });

    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });

    socket.on('error', (error) => {
        console.log('Error : ' + error);
        offline()

    });

    socket.on('timeout', () => {
        console.log('Socket timed out !');
        socket.end('Timed out!');
        offline()
    });

    socket.on('end', (data) => {
        console.log('Socket ended from other end!');
        offline()
    });

    socket.on('close', function (error) {
        console.log('Socket closed!');
        //   offline(CurrentDeviceMSg)
        if (error) {
            console.log('Socket was closed coz of transmission error');
        }
    });

    setTimeout(function () {
        console.log(`🔥🔥🔥 Killing socket for ${CurrentDeviceMSg.hostname ?? CurrentDeviceMSg.id} with v${CurrentDeviceMSg.getVersion}🔥🔥🔥`);
        socket.write(JSON.stringify({ type: "SOCKET_MAX_TIME_REACH", reconect: true }), () => {
            socket.destroy();
        })
    }, KILL_SOCKET_TIME);


    const offline = async () => {
        if (CurrentDeviceMSg)
            if (CurrentDeviceMSg.id) {
                console.log(`❌❌❌${CurrentDeviceMSg.hostname ?? CurrentDeviceMSg.id} is deconnected with v${CurrentDeviceMSg.getVersion}❌❌❌`)
                CurrentDeviceMSg.online = false;
                CurrentDeviceMSg.disconectedAt = new Date();
                fireDocDevice.set(CurrentDeviceMSg);
            }
    }

    const online = async () => {
        if (CurrentDeviceMSg)
            if (CurrentDeviceMSg.id) {
                console.log(`🚀🚀🚀${CurrentDeviceMSg.hostname ?? CurrentDeviceMSg.id} is online with v${CurrentDeviceMSg.getVersion}🚀🚀🚀`)
                if (CurrentDeviceMSg.reconecting === false) {
                    CurrentDeviceMSg.connectedAd = new Date();
                    fireDocDevice.set(CurrentDeviceMSg);
                } else {
                    fireDocDevice.update(CurrentDeviceMSg);
                }
            }
    }


});


server.maxConnections = MAXCONNECTIONS;
/*
server.on('newSession', (id, data, cb) => {
    console.log("newSession", Object.keys(tlsSessionStore).length)
    tlsSessionStore[id.toString('hex')] = data;
    cb();
});
server.on('resumeSession', (id, cb) => {
    cb(null, tlsSessionStore[id.toString('hex')] || null);
});
*/

server.listen(PORT, () => {
    console.log('server bound');
});
