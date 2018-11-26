// import needed packages
const axios = require('axios');

module.exports = (cashierId) => {

    // url
    const url = 'http://18.216.58.18:3000/tables';

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // prepare request body
    const requestBody = {
        'cashier_id': cashierId
    };
    
    // get result
    return axios.post(url, requestBody, config);
}