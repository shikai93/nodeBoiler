const sql = require('mysql')
const config = require('../../config/config.js')
"use strict";
class SqlInterface {
    constructor () {
        this.config = {
            server: config.sqlServer,
            database: config.sqlDb,
            port : config.sqlPort,
            user : config.sqlUser,
            password : config.sqlPassword,
            timezone: "Z"
        };
    }
    ClearDB(callback) {
        this.PerformQuery(
            "DELETE FROM UserAccount WHERE id != 1", 
            {}, () => {
            callback()
        })
    }
    ConnectDB(callback) {
        if (this.pool == undefined) {
            var con = sql.createConnection(this.config);
            con.connect(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    this.pool = con;
                    callback(con);
                }
            });
        } else {
            callback(this.pool);
        }
    }

    // inputs is an array
    // [value]
    PerformQuery(queryString, inputs, callback) {
        var options = {
            sql: queryString,
            values: inputs
        };
        this.ConnectDB(function(con) {
            var sql = con.query(options, inputs, function(err, results, fields) {
                con.end();
                this.pool = undefined;
                if (callback == null) {
                    return;
                }
                if (err) {
                    // console.log(err);
                    callback(null, err);
                    return;
                }
                callback(results, null);
            });
            // console.log(sql.sql)
        });
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
module.exports = SqlInterface;