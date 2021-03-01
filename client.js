let input = document.getElementById("imageInput");
let sendImageButton = document.getElementById("sendImageButton");
let returnedImage = document.getElementById("returnedImage");
let loader = document.getElementById("loader");

loader.style.display = "none";

input.addEventListener('change', handleChange);
sendImageButton.addEventListener('click', sendImage);

image = "";

function randomString(length = 8) {
    // Definir los carácteres
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};

function handleChange(e) {
    var canvas = document.getElementById("canvas")
    var context = canvas.getContext("2d");
    
    const fileReader = new FileReader();
    
    fileReader.readAsDataURL(e.target.files[0]);
    
    fileReader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }

    fileReader.onloadend = (e) => {
        image = fileReader.result
        sendImageButton.disabled = false
    }
}

////////////////////////////////// Logica de los sockets //////////////////////////////////7

const socket = io();
const key = randomString(24);

socket.on("connect", () => {
    console.log(key);
});

socket.on("message", (msg) => {
    alert(`Servidor> ${msg}`)
})

function sendImage() {
    loader.style.display = "flex";
    socket.emit("requestKey", { key: key });
    
    let encryptedImage = CryptoJS.AES.encrypt(image, key);
    socket.send(encryptedImage.toString());
}

socket.on("requestDecrytedImage", function(data) {
    var decryptedImage = data;
    returnedImage.src = decryptedImage;
    result = document.getElementById("result")
    
    if (image === decryptedImage) {
        result.innerHTML = "Las imágenes son iguales :D"
    } else {
        result.innerHTML = "Las imágenes son diferentes :("
    }
    loader.style.display = "none";
});