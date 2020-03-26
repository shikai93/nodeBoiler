const ServiceManager = require('./services/ServiceManager.js')
"use strict";
class API {
    constructor () {
        this.serviceManager = new ServiceManager()
        this.userAccountService = this.serviceManager.GetUserAccountService()
    }
    VerifyJWT(req,callback) {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        if (token) {
           this.userAccountService.VerifyToken(token,callback)
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