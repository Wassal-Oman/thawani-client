// import needed libraries
const axios = require('axios');
const moment = require('moment');
const retrieve = require('../js/GetDataSync');
const jwt = require('../js/JsonWebToken');

module.exports = async (startDate, endDate) => {

    return await new Promise((resolve, reject) => {

        // url
        const url = 'http://uat.thawani.om:7501/api/ThirdParty';

        // get user data
        let user = retrieve('./data/user.json');
        let merchantId = JSON.parse(user).UserId;
        let token = JSON.parse(user).Token;

        if(!merchantId || !token) {
            return reject({ data: { Status: '906', Msg: 'Merchant ID or Login Token not found!'} });
        }

        // get source id
        let settings = retrieve('./data/settings.json');
        let sourceId = JSON.parse(settings).SOURCE_ID;

        if(!sourceId) {
            return reject({ data: { Status: '906', Msg: 'Source ID is Unknown!'} });
        }

        // access token
        const accessToken = `Bearer ${token}`;

        // configuration and settings
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        }

        // dates
        let today = moment().format('YYYY-MM-DD');
        let tomorrow = moment(today, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');

        if(startDate !== '' && endDate !== '') {
            today = startDate;
            tomorrow = endDate;
        }

        console.log(`today: ${today} - tomorrow: ${tomorrow}`);

        // payload
        let unique_name = {
            "TranType": 'THPTRANHISTORY',
            "THAWANIMERCHID": merchantId,
            "THAWANICUSTNO": "",
            "REQTXNID": "",
            "TXNDATE": "",
            "STARTDATE": today,
            "ENDDATE": tomorrow,
            "LASTTRANCOUNT": "0",
            "STATUS": "",
            "RECORDCOUNT": "10"
        }

        // get JSON Web Token
        jwt(unique_name).then(token => {
            // request body
            let requestBody = {
                'REQUEST': token,
                'SOURCEID': sourceId
            };

            // make http request to Third Party API
            return resolve(axios.post(url, requestBody, config));

        }).catch(err => {
            return reject(err);
        });
    });
}