const crypto = require("crypto");
const jwt  = require('jsonwebtoken');
const config = require('../config/config.js')
"use strict";
const USERTABLE = 'UserAccount'
const SECRET  = config.secretJWT
class UserAccountService {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    IsAdmin(user) {
        return user.adminId !== undefined && user.adminId !== null
    }
    GetUser(username, callback) {
        if (typeof(username) != "string" ) {
            callback (null)
        }
        this.sqlInterface.PerformQuery(
            `SELECT ua.accountId, ua.salt, ua.password, ua.username, u.firstName, u.lastName, u.email
            FROM ${config.tables.USERACCOUNT} AS ua 
            JOIN ${config.tables.USER} AS u ON u.accountId = ua.accountId
            WHERE ua.username=?`,
            [username],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(null)
                } else {
                    callback(recordset[0])
                }
            }
        )
    }
    GetUserByAccountId(accountId, callback) {
        this.GetUserInfo(accountId, callback)
    }
    GetSaltAndPw(username,callback) {
        if (typeof(username) != "string" ) {
            callback(null,"Invalid username submitted")
            return
        }
        this.sqlInterface.PerformQuery(
            `SELECT salt, password, accountId FROM ${USERTABLE} WHERE username=?`,
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
    GetUserInfo(accountId,callback) {
        this.sqlInterface.PerformQuery(
            `SELECT ua.accountId, ua.username , u.userId, u.email, u.firstName, u.lastName
            FROM ${USERTABLE} AS ua
            LEFT JOIN ${config.tables.USER} AS u ON u.accountId = ua.accountId
            WHERE ua.accountId=?`,
            [accountId],
            (recordset, error) => {
                if (recordset.length === 0) {
                    callback(null, "No such user found!")
                    return
                }
                var user = {
                    accountId : recordset[0].accountId,
                    username : recordset[0].username,
                    userId : recordset[0].userId,
                    email : recordset[0].email,
                    firstName : recordset[0].firstName,
                    lastName : recordset[0].lastName,
                }
                callback(user, null)
            }
        )
    }
    GenerateSalt() {
        return crypto.randomBytes(16).toString("hex")
    }
    GenerateToken(accountId, callback) {
        this.GetUserInfo(accountId, (info,err) => {
            if (err !== null) {
                callback(null,err)
            } else {
                Object.assign(info,{ 
                    project: 'CareerSuperDrive',
                    accountId: info.accountId,
                })
                var token = jwt.sign(info, SECRET, { expiresIn: '1d' });
                callback(token,null)
            }
        })
    }
    VerifyToken(token, callback) {
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    return callback(null,'Token has expired, please re log in')
                } else {
                    return callback(null,'Invalid Token')
                }
            } else {
                if (decoded.project == "CareerSuperDrive") {
                    return callback(decoded,null)
                } else {
                    return callback(null,'Invalid Token')
                }
            }
        });
    }

    // API functions
    SignUp(username, password, callback) {
        var salt = this.GenerateSalt();
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                callback(null,err)
                return
            }
            const hashed =  derivedKey.toString('hex');
            this.GetUser(username,(user) => {
                if (user !== null) {
                    callback (null,"User aleady exist")
                } else {
                    this.sqlInterface.PerformQuery(
                        `INSERT INTO ${USERTABLE} (username, password,salt) VALUES (?,?,?)`,
                        [username,hashed,salt],
                        (recordset, error) => {
                            callback (recordset.insertId,null)
                        }
                    )
                }
            })
        });
    }
    Login(username, password, callback) {
        this.GetSaltAndPw(username,(values,error) => {
            if (error != null) {
                callback(false,error)
            } else {
                crypto.scrypt(password, values.salt, 64, (err, derivedKey) => {
                    const hashed =  derivedKey.toString('hex');
                    if (values.password === hashed) {
                        // generate token
                        this.GenerateToken(values.accountId, (token,error) => {
                            callback({accountId : values.accountId, token : token}, null)
                        })
                    } else {
                        callback(false,"Invalid Password")
                    }
                })
            }
        }) 
    }
    UpdateCredentials(initalusername, newusername, newPW, callback) {
        // retrieve salt
        this.GetSaltAndPw(initalusername,(values,error) => {
            if (error != null) {
                callback(false,error)
            } else {
                crypto.scrypt(newPW, values.salt, 64, (err, derivedKey) => {
                    const hashed =  derivedKey.toString('hex');
                    this.sqlInterface.PerformQuery(
                        `UPDATE ${USERTABLE} SET username=?,password=? WHERE accountId=?`,
                        [newusername,hashed,values.accountId],
                        (recordset, error) => {
                            callback ({accountId : values.accountId},null)
                        }
                    )
                })
            }
        }) 
    }
    UpdateUserName(username, accountId, callback) {
        this.sqlInterface.PerformQuery(`UPDATE ${config.tables.USERACCOUNT} SET username=? WHERE accountId = ?`, [username, accountId], (rtn,err)=>{
            callback(rtn,err)
        })
    }
}
module.exports = UserAccountService;