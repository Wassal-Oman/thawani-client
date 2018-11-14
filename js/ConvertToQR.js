const remote = require('electron').remote

// sets the QR code image.
// pre: string to generate QR code.
// post: QR code, or default picture. 
function setImage(x){
    if (x != '') {
        return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + x
    } else {
        return "../assets/placeholder.png"
    }
}