const path = require('path');
const fs = require('fs');

module.exports = (myPath) => {
    let absolutePath = path.resolve(myPath);
    return fs.readFileSync(absolutePath, { encoding: "utf-8" });
};