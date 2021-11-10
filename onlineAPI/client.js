var net = require('net');
var CryptoJS = require("crypto-js");
const SECRET = "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"
const PORT = 2222

const Option = {
    host: "vpsdev.al4you.uno",
    port: PORT
}
Array(100).fill("0").forEach((x, i) => {
    console.log("test", i)


    var client = new net.Socket();

    client.connect(Option);

    client.on('connect', function () {
        console.log('Client ' + i + ': connection established with server');
        var message = { id: "456464654" + i, online: true };
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(message), SECRET).toString();
        client.write(ciphertext);


        /*    setInterval(() => {
                var message = { id: "456464654", status: "messagetest", test: i }
                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(message), SECRET).toString();
                client.write(ciphertext);  
            }, Math.floor(Math.random() * 5000+1000));
    */
    });

    client.setEncoding('utf8');

    client.on('data', function (data) {
        console.log("receveing data")
        //  console.log('Data from server:' + data);
    });

    client.on('error', function (err) {
        console.log('Socket error reconecting');
        reconect()
        //console.log(err)
    })

    client.on('end', function (data) {
        console.log('Socket ended from other end!');
        reconect()
    });

    const reconect = () =>
        setTimeout(function () {
            client.connect(Option);
        }, 30000)



})