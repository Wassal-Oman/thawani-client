const retrieve = require('../js/GetDataSync');
const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = async (unique_name) => {
    // read user settings
    let data = retrieve(path.join(__dirname, '../data/settings.json'));
    
    return await new Promise((resolve, reject) => {
        if(data.length != 0) {
            // get private key
            let privateKey = JSON.parse(data).PRIVATE_KEY;
            console.log(privateKey);

            if(!privateKey) {
                return reject({ data: { Status: '906', Msg: 'No private key was found!'} });
            }
    
            // payload
            const payload = {
                unique_name
            };
    
            // jwt paramas
            const i  = 'THAWANI';                       // Issuer 
            const s  = 'Thawani Third-Party API';       // Subject 
            const a  = 'INTEGRATION';                   // Audience
    
            // signature options
            const signOptions = {
                issuer:  i,
                subject:  s,
                audience:  a,
                expiresIn: "12h",
                algorithm: "RS256"
            }
    
            // return json web token
            // return resolve(jwt.sign(payload, privateKey, signOptions));
            jwt.sign(payload, privateKey, signOptions, (err, token) => {
                if(err) return reject({ data: { Status: '906', Msg: 'Private Key Is Incorrect' } });
                else return resolve(token);
            });
    
        } else {
            // no settings were found
            return reject({ data: { Status: '906', Msg: 'No Data was found in Settings'} });
        }
    });
}