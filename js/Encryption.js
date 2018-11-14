const crypto = require('crypto');
const fs = require("fs");
const path = require('path');

module.exports = (myPath, data) => {
    // load public key
    let absolutePath = path.resolve(myPath);
    let publicKey = fs.readFileSync(absolutePath, "utf8");

    // create encrypted data
    let encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, new Buffer(data));

    // return encrypted data
    return encrypted.toString("base64");
}