const path = require("path");
const fs = require("fs");
const mkdirp = require('mkdirp');

module.exports = () => {
    // get inputs
    let absolutePath = path.resolve('C:/thawani/data/settings.json');

    return new Promise((resolve, reject) => {
        fs.exists(absolutePath, (found) => {
            if(!found) {
                // create a directory and a file
                mkdirp('/thawani/data', err => {
                    if(err) {
                        console.log(err);
                        return reject(false);
                    } else {
                        // create settings structure
                        let data = {
                            SOURCE_ID: "",
                            MERCHANT_ID: "",
                            PRIVATE_KEY: ""
                        };

                        // write user settings
                        fs.writeFile(absolutePath, JSON.stringify(data), (err) => {
                            if(err) {
                                console.log(err);
                                return reject(false);
                            }
                            else return resolve(true);
                        });
                    }
                });
            }
        });
    });
};