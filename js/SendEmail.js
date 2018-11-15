// import needed libraries
const nodemailer = require('nodemailer');

module.exports = async (merchantId) => {
    return await new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'thawani.mail@gmail.com',
                pass: 'Thawani@123'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Thawani Client" <thawani.mail@gmail.com>', // sender address
            to: 'ghanim.marzouqi@thawani.om', // list of receivers
            subject: 'Reset Password', // Subject line
            text: `Please help me resetting my password for Merchant ID: ${merchantId}`, // plain text body
            html: '' // html body
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error.message);
            }
            
            return resolve('Password Reset Email has been sent!');
        });
    });
}