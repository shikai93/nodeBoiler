const ServiceManager = require('./services/ServiceManager.js')
"use strict";
class API {
    constructor () {
        this.serviceManager = new ServiceManager()
        this.userAccountService = this.serviceManager.GetUserAccountService()
    }
    VerifyJWT(req,res,callback) {
        let token = req.signedCookies['jwtToken']
        if (token) {
           this.userAccountService.VerifyToken(token,(decoded,err) => {
                if (err != null) {
                    callback(null,err)
                } else {
                    this.userAccountService.GenerateToken(decoded.accountId,(token,err) => {
                        res.cookie('jwtToken',token,{ maxAge: 24 * 60 * 60 * 1000, httpOnly: true, signed : true})
                        callback(decoded,null)
                    })
                }
           })
        } else {
            callback(null,'Auth Token is missing')
        }
    }
    // Access Control
    Login(username, password, callback) {
        this.serviceManager.GetUserAccountService().Login(username, password, callback)
    }
    Signup(username, password, callback) {
        this.serviceManager.GetUserAccountService().SignUp(username, password, callback)
    }
    // Get Data Dump 
}
module.exports = API;