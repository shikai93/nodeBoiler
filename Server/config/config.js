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
};