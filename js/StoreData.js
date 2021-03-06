const path = require("path");
const fs = require("fs");
const mkdirp = require('mkdirp');

module.exports = (myPath, data) => {
    // get inputs
    let absolutePath = path.resolve(myPath);

    return new Promise((resolve, reject) => {
        fs.exists(absolutePath, (found) => {
            if(!found) {
                // create a directory and a file
                mkdirp('/thawani/data', err => {
                    if(err) {
                        console.log(err);
                        alert('Cannot Create Thawani Directory in C Drive');
                        return reject(false);
                    } else {
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

            } else {
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
    });
};