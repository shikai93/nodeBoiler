require('dotenv').config()
module.exports = {
    secretJWT: process.env.jwt_secret,
    secretCookie: process.env.cookie_secret,
    sqlServer : process.env.sql_server,
    sqlDb : process.env.sql_db,
    sqlPort : 3306,
    sqlUser : process.env.sql_user,
    sqlPassword : process.env.sql_password,
    frontendURL : process.env.frontend_url,
    tables : {
       
    },
    awsS3 : {
        "accessKeyId": process.env.s3_accesskey,
        "secretAccessKey": process.env.s3_secretaccesskey,
        "region":"ap-southeast-1"
    },
    awsEmail : {
        "accessKeyId": process.env.ses_accesskey,
        "secretAccessKey": process.env.ses_secretaccesskey,
        "region":"ap-southeast-2"
    },
    s3Bucket : process.env.s3bucket,
};