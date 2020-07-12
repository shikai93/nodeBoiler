const crypto = require("crypto");
const jwt  = require('jsonwebtoken');
const config = require('../config/config.js')
"use strict";
const USERTABLE = 'UserAccount'
const SECRET  = config.secretJWT
const SECRETPW  = config.secretPW
class UserAccountService {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    GetUser(username, callback) {
        if (typeof(username) != "string" ) {
            callback (null)
        }
        this.sqlInterface.PerformQuery(
            `SELECT * FROM ${USERTABLE} WHERE username=@user`,
            [{ 
                name : 'user',
                type : sql.VarChar(255),
                value : username
            }],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(null)
                } else {
                    callback(recordset[0])
                }
            }
        )
    }
    GetSaltAndPw(username,callback) {
        if (typeof(username) != "string" ) {
            callback(null,"Invalid username submitted")
            return
        }
        this.sqlInterface.PerformQuery(
            `SELECT salt, password, id FROM ${USERTABLE} WHERE username=?`,
            [username],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(null, "No such user found!")
                    return
                }
                callback(recordset[0], null)
            }
        )
    }
    GetSalt(accountId, callback) {
        this.sqlInterface.PerformQuery(
            `SELECT a.accountId, a.salt FROM ${USERTABLE} AS a 
            WHERE accountId=?`,
            [accountId],
            (recordset, error) => {
                if (recordset == null || recordset.length === 0) {
                    callback(null, "No such user found!");
                    return;
                }
                callback(recordset[0], null);
            }
        );
    }

    GenerateToken() {
        var token = jwt.sign({ project: 'EmpirecodeTutor'}, SECRET, { expiresIn: '1d' });
        return token
    }

    // API functions
    SignUp(username, password, callback) {
        // retrieve salt
        const hmac = crypto.createHmac('sha256', SECRETPW);
        var salt = this.GenSalt();
        hmac.update(password + salt);
        const hashed =  hmac.digest('hex');
        this.GetUser(username,(user) => {
            if (user !== null) {
                callback (false,"User aleady exist")
            } else {
                this.sqlInterface.PerformQuery(
                    `INSERT INTO UserAccount (username, password,salt) VALUES (?,?,?)`,
                    [username,hashed,salt],
                    (recordset, error) => {
                        callback (true,null)
                    }
                )
            }
        })
    }
    Login(username, password, callback) {
        // retrieve salt
        const hmac = crypto.createHmac('sha256', SECRETPW);
        this.GetSaltAndPw(username,(values,error) => {
            if (error != null) {
                callback(null,error)
            } else {
                hmac.update(password + values.salt);
                const hashed =  hmac.digest('hex')
                if (values.password === hashed) {
                    // generate token
                    var token = this.GenerateToken()
                    callback({userId : values.id, token : token}, null)
                } else {
                    callback(null,"Invalid Password")
                }
            }
        }) 
    }
    VerifyToken(token, callback) {
        // get token from req headesr
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    return callback(null,'Token has expired, please re log in')
                } else {
                    return callback(null,'Invalid Token')
                }
            } else {
                if (decoded.project == "EmpirecodeTutor") {
                    return callback(decoded,null)
                } else {
                    return callback(null,'Invalid Token')
                }
            }
        });
    }
}
module.exports = UserAccountService;