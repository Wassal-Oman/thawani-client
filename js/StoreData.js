const path = require("path");
const fs = require("fs");

module.exports = (myPath, data) => {
    // get inputs
    let absolutePath = path.resolve(myPath);
    let d = JSON.stringify(data);

    return new Promise((resolve, reject) => {
        fs.exists(absolutePath, (found) => {
            if(!found) return reject(false);
            else {
                // write user settings
                fs.writeFile(absolutePath, d, (err) => {
                    if(err) return reject(false); 
                    else return resolve(true);
                });
            }
        })
    });
};