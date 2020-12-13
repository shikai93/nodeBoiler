var AWS = require('aws-sdk');
const config = require('../config/config.js')
const SQLService = require('./SQLService.js');
const sql = new SQLService()
function sendEmail(recipient, subject, htmlBody, callback) {
    // if (process.env.NODE_ENV !== "PROD") {
    //   callback(false)
    //   return
    // }
    // get if recipient is in blacklisted email addresses
    // sql.sqlInterface.PerformQuery(`
    // SELECT * FROM blacklistEmail WHERE email = ?
    // `, [recipient], (results, error) => {
    //     if (results === null || results.length === 0) {
            
    //     } else {
    //         callback(false)
    //     }
    // })
    send(recipient, subject, htmlBody, callback)
}

function send(recipient, subject, htmlBody, callback) {
    console.log(recipient)
    var params = {
        Destination: {
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                recipient
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<!DOCTYPE html>
         <html>
         <body>${htmlBody}</body></html>`
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: String(subject)
            }
        },
        Source: config.email,
        ReplyToAddresses: [config.email],
    };
    AWS.config.update(config.awsEmail)
    AWS.config.update({ region: "ap-southeast-2" });
    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01', region: 'ap-southeast-2' }).sendEmail(params).promise();
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function (data) {
            callback(true);
        }).catch(
            function (err) {
                callback(false)
                console.log(err)
            }
        );
}
module.exports = sendEmail