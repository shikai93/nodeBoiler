const sql = require('mysql')
const config = require('../../config/config.js')
"use strict";
class SqlInterface {
    constructor () {
        this.config = {
            connectionLimit : 10,
            host: config.sqlServer,
            database: config.sqlDb,
            port : config.sqlPort,
            user : config.sqlUser,
            password : config.sqlPassword,
            timezone: "Z"
        };
        this.pool = sql.createPool(this.config);
    }
    ChangeDB() {
        this.pool.end()
        this.pool = sql.createPool(this.config);
    }
    ClearDB(callback) {
        var callsToMake = 0
        var callsMade = 0
        if (this.config.database !== 'test') {
            callback()
            return
        }
        for( var key in config.tables) {
            if (
                config.tables[key] != 'tabletokeep'
            ) {
                callsToMake += 1
                this.PerformQuery(
                    `DELETE FROM ${config.tables[key]}`, 
                    {}, () => {
                        callsMade += 1
                        if (callsMade == callsToMake) {
                            callback()
                        }
                })
            }
        }
    }
    ConnectDB(callback) {
        callback(this.pool)
    }

    // inputs is an array
    // [value]
    PerformQuery(queryString, inputs, callback, debug = false) {
        var options = {
            sql: queryString,
            values: inputs
        };
        var sql = this.pool.query(options, inputs, (err, results, fields) => {
            if (callback == null) {
                return;
            }
            if (err) {
                callback(null, err);
                return;
            }
            callback(results, null);
        });
        if (debug) {
            console.log(sql.sql)
        }
    }

    // inputs is an array
    // [value]
    ExecuteStoredProcedure(procedureName, inputs, callback) {
        this.ConnectDB(function(con) {
            var placeholders = [];
            inputs.forEach(element => {
                placeholders.push("?");
            });
            var allinputs = placeholders.join(",");
            con.query(`CALL ${procedureName}(${allinputs});`, inputs, function(
                err,
                results,
                fields
            ) {
                con.end();
                this.pool = undefined;
                if (callback == null) {
                    return;
                }
                if (err) {
                    console.log(err);
                    callback(null, err);
                    return;
                }
                callback(results, null);
            });
        });
    }
}
var interface = new SqlInterface()
module.exports = interface;