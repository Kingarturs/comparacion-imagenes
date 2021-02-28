const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000
const path = require('path')
const CryptoJS = require("crypto-js");

app.use(express.static(path.join(__dirname + '/')))

server.listen(port, () => {
    console.log(`Servidor iniciado en puerto: ${port}`)
});

const io = require('socket.io')(server)
var decryptedImage = ""
var key = ""

io.on("connection", socket => {
    console.log(`Nueva conexión al servidor`)
    
    socket.on("requestKey", function(data) {
        key = data.key;
        console.log(key)
    });
    
    socket.on("message", function(data) {
        var image = data;
        
        decryptedImage = CryptoJS.AES.decrypt(image, key)
        socket.emit("requestDecrytedImage", decryptedImage.toString(CryptoJS.enc.Utf8))
    });

});
