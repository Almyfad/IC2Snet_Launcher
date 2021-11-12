var net = require('net');
var CryptoJS = require("crypto-js");
const { Firestore } = require('@google-cloud/firestore');
console.log(process.env.GCLOUD_PROJECT)
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)
const firestore = new Firestore();


const PORT = 2222
const MAXCONNECTIONS = 150
const KILL_SOCKET_TIME = 1200000
const SOCKET_TIMEOUT = 800000
const SECRET = "wJSSuJeAFMYXwrupxAkkAT425PWtYsmAYRCUFkpfYjMZncsYg5kB6R6KAakRQh4rKwYHwZasS6UpD9E9Zr26MpwGYWPS3eSnNP8V4phr6hKeJNZ6UCCnyf9A5yz2MufuDehsvsfznYUDcM7P3Jybm4cCTnnRXAz4FFBG6eZdNPGTswEEtUEdUFuQBjRVbSHQX7cbWr9KK4CtmkcfJzNVUxKfuKEAWuwkeBWTuHd5aM3EjaEfXJWWw5YpRpVt7ZnRrALNVp25MKVMV4jFtqQybvbYVXRtQrWJAPTxmqM2qKN7V2UxzpuXr8atMjua5cTNaeyrMJe8Kmk3qW7LTyyyFmT7ZYNEa7RRxzBm7LhWGhFanWff9mS3cegNR4M7Zb454bvmTGmysKKNgQTfTPWTmd4ZWa7Lg7XQUDTDxgSDTsdCkASBWMj5AZud54JuXRB9qbtz3WUrfpmw8QrUGqqsx5c6HjE2ka8mF8a7YRgU6DdvzfvJU4DKf3jHrLRhc8L4ZJHRVdvJFWH8qzSrHMXAhpPpSSS3zjvDnjBRRd8EYbLW89FwEgqRxugDVwNKmPSpCUdd5DeL2gUvVEjBmLcdTSdhBPH5knMdPgVC3YegxH5q44zWjmmagjHGwhVPrMz5X6pFfKGbG3SEbFjTJcVWv26SFhU5AhhNuK42symAn8XJeLLvxMrv4nWq4tjkK8yURVNGwL6ksPNYWKJdM5wTWwA3ZKPar5dKtaSMvmTA9urvAdZ8sj5MthKfbMmupNN2CreNH4FGHwRP6nAY9Ubp8mwMJmRG2ukK6EsQLZLUt3UQtApTMhdhBeGRrwWBDbpVG4aS66ZrmxkEV7yq2FR5VsXwttWjZpc6nQZcXr56SesxADxrbRhkZZHBKDGTSSjEtW89PtjD2knV2bVVBNNnvMFFN93kh4dRepmuQfSUFJSMGd7bgMMrXVSdXNsy9p2CVB8qwqAgr2hq8qaCkPbwNZjpRgRuwYUYbxPYnQL5WnUg6k2FYxGWkgYpbsxeQvUrpgaJqsFdXUMWAJA8RaFet7HBGbksVZkB7q9hEUaEshEXcY9bsKPmz8dvmQATr2KttF64wRZ5zhn7QeedNG2fTmnuTyX46pAcGracaL4JSBE8nVYyZBBA562xwjEZSAegz8htLeg5ZZeMVpr6gUA6XNUddDrNVZcJ6vX3KdRPHtT9tTy5Nh3yYZQWm2nNVj4Ef9WRgXvdHrGgACDRckJVLPUnSbDj4KA7yXL9dXXSGvhR8Sp8wHjhzPr9awBXqqtejaJbqcYksvQwJJnUpS36uBTHDVkzcjZTPuSKJ24cKbmaLtRG2VHfQa5H44Z3hWGRyd9TMmp2PfCmJR96CvSMdY9MrVRup6SLNfkTnf4XDDRxeE27TvqZf9Ga6TyEnd8UBMjjdTQBLmLcfT7uwE3EQFbPSQqtrLbZCEGReTLWpDgTEJ5P5KvWvsfDDqWcc67pwgBrMbNC8G8drbCMmrcWNsGb7aASrMNvS3r6aXzVnUSwyEWQ2ASP8QKfhFMFBk2Yfy9twUNTX64LgmwTTUL68G3AtQw67dcxwjUWUFdUyEtSQXjZdAVVWADZNEhLBJdELTQ4VvjRE5YPnQKfAWX86QaQTZA3PAHuEa2McrrwqQT5t8qxawdqvHGtSEPrxsbA6banhd5PQtpvr4ebUUm3kBmKr2NZN49nVZE63dLvCSAyvC52zHQTuLssvk9Wtp86JtK8tG3SksFqaAUesb3Bc7sErKg65n8SPm6jkAraqTz56HZV9a8RqfY85LrJmDCK3SkMnk42jVNjkjRndPA7hABWTxdAy29WLbGB4hwKnnn4AB9Pv2smwJ8vSUvTnwtNHXspGfYkF9nauuCLzVHhDZTGMvvxgUKtM9vJ3VZbbgG7UuMZ5BU6VQNEas9Vp97DqesDm7YEKeXn4TSFn2TR7PQcLAcG7RvwESTZEGFwk5gwUzT67Jk67nH37PWQ6mcD6nsxSh3aYNRYKgzgzLWA2AQjk23zR3DHBTzaXrdKhW3WFA4RbcVBxSDjtHBmcHJ3"


// creates the server
var server = net.createServer();

//emitted when server closes ...not emitted until all connections closes.
server.on('close', function () {
    console.log('Server closed !');
});

// emitted when new client connects
server.on('connection', function (socket) {
    let deviceid = null
    server.getConnections(function (error, count) {
        console.log('Number of concurrent connections to the server : ' + count);
    });

    socket.setEncoding('utf8');
    socket.setTimeout(SOCKET_TIMEOUT, function () {
        socket.destroy();
        console.log('Socket timed out');
    });


    socket.on('data', function (data) {


        try {
            var bytes = CryptoJS.AES.decrypt(data, SECRET);
            var message = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            deviceid = message
            online()
        }
        catch (e) {
            console.error('Error parsing')
            socket.destroy()
        }


    });

    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });

    socket.on('error', function (error) {
        console.log('Error : ' + error);
        offline(deviceid)

    });

    socket.on('timeout', function () {
        console.log('Socket timed out !');
        socket.end('Timed out!');
        offline(deviceid)
        // can call socket.destroy() here too.
    });

    socket.on('end', function (data) {
        console.log('Socket ended from other end!');
        console.log('End data : ' + data);
        offline(deviceid)
    });

    socket.on('close', function (error) {
        /*  var bread = socket.bytesRead;
          var bwrite = socket.bytesWritten;
          console.log('Bytes read : ' + bread);
          console.log('Bytes written : ' + bwrite);*/
        console.log('Socket closed!');
        offline(deviceid)

        if (error) {
            console.log('Socket was closed coz of transmission error');
        }
    });

    setTimeout(function () {
        var isdestroyed = socket.destroyed;
        console.log('Socket destroyed:' + isdestroyed);
        offline(deviceid)
        socket.destroy();
    }, KILL_SOCKET_TIME);

    const offline = async () => {
        console.log("Did is deconnected", deviceid)
        deviceid.online = false;
        deviceid.disconectedAt = new Date();
        const document = firestore.collection('online').doc(deviceid.id);
        await document.set(deviceid);
    }

    const online = async () => {
        console.log("Did is online", deviceid)
        deviceid.connectedAd = new Date();
        const document = firestore.collection('online').doc(deviceid.id);
        await document.set(deviceid);
     
    }
});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error', function (error) {
    console.log('Error: ' + error);
});

//emits when server is bound with server.listen
server.on('listening', function () {
    console.log('Server is listening!');
});



server.maxConnections = MAXCONNECTIONS;
server.listen(PORT);