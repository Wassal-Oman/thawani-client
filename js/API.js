// import needed libraries
const axios = require('axios');
const crypto = require('crypto');
const path = require("path");
const fs = require("fs");
const qs = require('qs');
const jwt = require('jsonwebtoken');

function sendLoginRequest(cashierId, password) {

    // encrypt password
    encryptedPass = encryptData(password);

    // source id
    const sourceId = "1D4CAD80-E461-4E9C-873A-9F7457F9099D";
    const MSG = `USERNAME=${cashierId}|PASSWORD=${encryptedPass}`;

    // url
    const url = 'http://uat.thawani.om:7501/api/Login';

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // prepare request body
    const requestBody = qs.stringify({
        'Trantype': 'LOGIN',
        'SourceID': sourceId,
        'MSG': MSG
    });

    // send http request
    axios.post(url, requestBody, config).then((response) => {
        // get reponse data
        data = JSON.parse(JSON.stringify(response)).data;
        
        // get status code
        let statusCode = JSON.parse(JSON.stringify(data)).Status;
        let message = JSON.parse(JSON.stringify(data)).Msg;

        // check for login
        if(statusCode == '00') {
            // get user data
            let userData = JSON.parse(message)[0];
            if(storeData(userData)) {
                $("#loader").removeClass('loading');
                window.location = 'home.html';
            } else {
                $("#loader").removeClass('loading');
                alert('Cannot store user data');
            }
        } else {
            $("#loader").removeClass('loading');
            alert(message);
        }

    }).catch((error) => {
        alert(JSON.stringify(error));
    });
}

function sendWayyak(phone, amount, remarks) {
    
    // url
    const url = 'http://uat.thawani.om:7501/api/ThirdParty';

    // get access token
    let token = getAccessToken();

    // access token
    let accessToken = `Bearer ${token}`;

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        }
    }

    // create jwt
    let jwtToken = getJwtToken('THTPTRANSACTION', phone, amount, remarks);

    // body
    requestBody = {
        'REQUEST': jwtToken,
        'SOURCEID': "1D4CAD80-E461-4E9C-873A-9F7457F9099D"
    }

    console.log(JSON.stringify(requestBody));

    // send http request
    axios.post(url, requestBody, config).then((response) => {
        // get data from response
        let data = JSON.parse(JSON.stringify(response)).data;
        let status = JSON.parse(JSON.stringify(data)).Status;
        let message = JSON.parse(JSON.stringify(data)).Msg;
        let timestamp = JSON.parse(JSON.stringify(data)).TimeStamp;
        console.log(`Date: ${new Date(Number.parseInt(timestamp))}`);

        if(status == '00') {
            let mes = JSON.parse(message)[0];
            let ref = JSON.parse(JSON.stringify(mes)).ReferenceNo;
            alert(`Wayyak has been sent successfully\nReference Number is ${ref}`);
        }
    }).catch((error) => {
        alert(JSON.stringify(error));
    });
}

function sendNotificationRequest(phone) {

    // url
    const url = 'http://uat.thawani.om:7501/api/ThirdParty';

    // get access token
    let token = getAccessToken();

    // access token
    let accessToken = `Bearer ${token}`;

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        }
    }

    // create jwt
    let jwtToken = getJwtToken('THTPSTATUSENQUIRY', phone); 

    // body
    requestBody = {
        'REQUEST': jwtToken,
        'SOURCEID': "1D4CAD80-E461-4E9C-873A-9F7457F9099D"
    }

    console.log(JSON.stringify(requestBody))

    // send http request
    // axios.post(url, requestBody, config).then((response) => {
    //     // get data from response
    //     let data = JSON.parse(JSON.stringify(response)).data
    //     let status = JSON.parse(JSON.stringify(data)).Status
    //     let message = JSON.parse(JSON.stringify(data)).Msg
    //     let timestamp = JSON.parse(JSON.stringify(data)).TimeStamp
    //     console.log(`Date: ${new Date(Number.parseInt(timestamp))}`)

    //     if(status == '00') {
    //         let mes = JSON.parse(message)[0]
    //         let ref = JSON.parse(JSON.stringify(mes)).ReferenceNo
    //         alert(`Wayyak has been sent successfully\nReference Number is ${ref}`)
    //     }
    // }).catch((error) => {
    //     alert(JSON.stringify(error)) 
    // })
}

function loadNotifications(cashierId, lastCount) {
        // url
        const url = 'http://uat.thawani.om:7501/api/ThirdParty';

        // get access token
        let token = getAccessToken();
    
        // access token
        let accessToken = `Bearer ${token}`;
    
        // configuration and settings
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        }
    
        // create jwt
        let jwtToken = getJwtForHistory(cashierId, lastCount);
    
        // body
        requestBody = {
            'REQUEST': jwtToken,
            'SOURCEID': "1D4CAD80-E461-4E9C-873A-9F7457F9099D"
        }
    
        console.log(JSON.stringify(requestBody)); 
    
        // send http request
        // axios.post(url, requestBody, config).then((response) => {
        //     // get data from response
        //     let data = JSON.parse(JSON.stringify(response)).data
        //     let status = JSON.parse(JSON.stringify(data)).Status
        //     let message = JSON.parse(JSON.stringify(data)).Msg
        //     let timestamp = JSON.parse(JSON.stringify(data)).TimeStamp
        //     console.log(`Date: ${new Date(Number.parseInt(timestamp))}`)
    
        //     if(status == '00') {
        //         let mes = JSON.parse(message)[0]
        //         let ref = JSON.parse(JSON.stringify(mes)).ReferenceNo
        //         alert(`Wayyak has been sent successfully\nReference Number is ${ref}`)
        //     }
        // }).catch((error) => {
        //     alert(JSON.stringify(error)) 
        // })
}

function encryptData(data) {
    // load public key
    let absolutePath = path.resolve('./keys/ThawaniPublic.key');
    let publicKey = fs.readFileSync(absolutePath, "utf8");

    // create encrypted data
    let encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, new Buffer(data));

    // return encrypted data
    return encrypted.toString("base64");
}

function storeData(data) {
    status = false
    let absolutePath = path.resolve('./data/user.json')
    d = JSON.stringify(data)

    fs.exists(absolutePath, (found) => {
        if(found) {
            // write user data
            fs.writeFile(absolutePath, d, (err) => {
                if(err) {
                    status = false
                } else {
                    status = true
                }
            })
        }
    })

    return status
}

function getAccessToken() {
    let absolutePath = path.resolve('./data/user.json')
    let content = fs.readFileSync(absolutePath)
    let jsonContent = JSON.parse(content)

    return jsonContent.Token
}

function getJwtToken(transType, phone, amount, remarks) {
    // keys path
    let privateKeyPath = path.resolve('./keys/private.key')
    let publicKeyPath = path.resolve('./keys/public.key')

    // keys
    let privateKey = fs.readFileSync(privateKeyPath, "utf8")
    let publicKey = fs.readFileSync(publicKeyPath, "utf8")

    // date + 60 min
    let expDate = Date.now() + 60 * 6000;
    let date = Date.now();

    // payload
    let payload = {
        unique_name: {
            "TranType": transType,
            "THAWANIMERCHID": "30167",
            "AMOUNT": amount,
            "THAWANICUSTNO": phone,
            "TPID": date,
            "REQTXNID": "token_" + date,
            "TXNDATE": "2018/11/07",
            "REMARK": remarks
          }
      }

    let i  = 'THAWANI';                       // Issuer 
    let s  = 'Thawani Third-Party API';       // Subject 
    let a  = 'INTEGRATION';                   // Audience

    let signOptions = {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn: "12h",
        algorithm: "RS256"
    }

    let token = jwt.sign(payload, privateKey, signOptions);

    return token;
}

function getJwtForHistory(cashierId, lastCount) {
    // keys path
    let privateKeyPath = path.resolve('./keys/private.key');
    let publicKeyPath = path.resolve('./keys/public.key');

    // keys
    let privateKey = fs.readFileSync(privateKeyPath, "utf8");
    let publicKey = fs.readFileSync(publicKeyPath, "utf8");

    // payload
    let payload = {
        unique_name: {
            "TranType": "THPTRANHISTORY",
            "THAWANIMERCHID": cashierId,
            "THAWANICUSTNO": "",
            "REQTXNID": "",
            "TXNDATE": "",
            "STARTDATE": new Date(2018, 10, 07, 00, 00, 00, 00),
            "ENDDATE": new Date(2018, 10, 08, 00, 00, 00, 00),
            "LASTTRANCOUNT": lastCount,
            "STATUS": "",
            "RECORDCOUNT": "10"
        }
      }

    let i  = 'THAWANI';                       // Issuer 
    let s  = 'Thawani Third-Party API';       // Subject 
    let a  = 'INTEGRATION';                   // Audience

    let signOptions = {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn: "12h",
        algorithm: "RS256"
    }

    let token = jwt.sign(payload, privateKey, signOptions);

    return token;
}

// method to get all tables
function getAllTables(cashierId) {

    // url
    const url = 'http://18.216.58.18:3000/tables'

    // configuration and settings
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // prepare request body
    const requestBody = {
        'cashier_id': cashierId
    }
    
    // get result
    return axios.post(url, requestBody, config)
}

// sendWayyak('71118963', '0.100', 'no remarks')
// loadNotifications(30167, 0);