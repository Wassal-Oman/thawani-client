// import needed libraries
const axios = require('axios');
const qs = require('qs');
const retrieve = require('../js/GetDataSync');
const encrypt = require('../js/Encryption');
const path = require('path');

module.exports = async (cashierId, password) => {

    // define variables
    let encryptedPass = '';
    let sourceId = '';
    let message = '';

    // url
    const url = 'http://uat.thawani.om:7501/api/Login';

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // get source id
    sourceId = retrieve('C:/thawani/data/settings.json');

    // get encrypted password
    encryptedPass = encrypt(path.join(__dirname, '../keys/ThawaniPublic.key'), password);

    let promise = new Promise((resolve, reject) => {

        // prepare request body
        if(sourceId !== '') {
            if(encryptedPass !== '') {

                // form message
                message = `USERNAME=${cashierId}|PASSWORD=${encryptedPass}`;

                // form request body
                const requestBody = qs.stringify({
                    'Trantype': 'LOGIN',
                    'SourceID': sourceId,
                    'MSG': message
                });

                // make http request
                return resolve(axios.post(url, requestBody, config));

            } else {

                console.log('Cannot encrypt password!');
                let err = {
                    data: {
                        Status: '906',
                        Msg: 'Cannot encrypt password!'
                    }
                };

                return reject(err);
            }
        } else {

            console.log('Source ID is Unknown!');
            let err = {
                data: {
                    Status: '906',
                    Msg: 'Source ID is Unknown!'
                }
            };

            return reject(err);
        }
    });

    return await promise;
}