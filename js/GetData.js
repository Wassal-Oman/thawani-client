const path = require('path');
const fs = require('fs');

module.exports = (myPath) => {
    let absolutePath = path.resolve(myPath);

    return new Promise((resolve, reject) => {
        fs.readFile(absolutePath, (err, data) => {
            if(err) return reject(err);
            else return resolve(data);
        });
    });
};