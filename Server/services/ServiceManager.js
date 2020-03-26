const SQLService = require('./SQLService.js')
const UserAccountService = require('./UserAccountService.js')
class ServiceManager {
    constructor () {
        this.sqlService = new SQLService()
        this.UserAccountService = new UserAccountService(this.sqlService.sqlInterface)
    }
    GetSQLService() {
        return this.sqlService;
    }
    GetUserAccountService() {
        return this.UserAccountService;
    }
}
module.exports = ServiceManager;
