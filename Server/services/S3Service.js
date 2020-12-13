"use strict";
const config = require('../config/config.js')
const helper = require("../helper/helper")
var s3 = require('./interfaces/S3Interface')

class S3Service {
    constructor (sqlInterface) {
        this.sqlInterface = sqlInterface
    }
    getObjectData(filepath,callback) {
       s3.getObjectData(filepath, callback)
    }
    getSignedUrl(filepath,callback) {
        s3.getSignedUrl(filepath, callback)
    }
    uploadFile(buffer, name, type) {
        return s3.uploadFile(buffer, name, type)
    };
    deleteFile(name) {
        return s3.deleteFile(name)
    }
}
module.exports = S3Service;