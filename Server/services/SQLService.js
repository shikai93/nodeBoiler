const SQLInterface = require("./interfaces/SQLInterface.js");
"use strict";
class SqlService {
    constructor () {
        this.sqlInterface = new SQLInterface()
    }
    GetDateFromDT(datetime) {
        var twoDigitMonth = datetime.getMonth() + "";
        if (twoDigitMonth.length == 1)
            twoDigitMonth = "0" + twoDigitMonth;
        var twoDigitDate = datetime.getDate() + "";
        if (twoDigitDate.length == 1)
            twoDigitDate = "0" + twoDigitDate;
        var newDate = twoDigitDate + "/" + twoDigitMonth + "/" + datetime.getFullYear();
        return newDate
    }
    

    // GetVessels(callback) {
    //     this.sqlInterface.PerformQuery(
    //         "SELECT name FROM Vessel"
    //         ,[],callback)
    // }
}
module.exports = SqlService;