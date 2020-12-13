var AWS = require('aws-sdk');
const config = require('../../config/config.js')

class S3Interface {
    constructor () {
        AWS.config.update(config.awsS3)
        this.s3Bucket = new AWS.S3( { params: {Bucket: config.s3Bucket} } );
    }
    getObjectData(filepath,callback) {
        AWS.config.update(config.awsS3)
        this.s3Bucket.getObject({Key : filepath}, (err,data) => {
            callback(data,err)
        })
    }
    uploadFile(buffer, name, type) {
        AWS.config.update(config.awsS3)
        var env = "development"
        if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== "") {
            env = process.env.NODE_ENV
        }
        const params = {
          ACL: 'bucket-owner-full-control',
          Body: buffer,
          ContentType: type !== undefined ? type.mime : 'text/plain',
          Key: `${env}/${name}`
        };
        return this.s3Bucket.upload(params).promise();
    };
    deleteFile(name) {
        AWS.config.update(config.awsS3)
        const params = {
            Key: `${name}`
        };
        return this.s3Bucket.deleteObject(params).promise();
    }
    getSignedUrl(filepath,callback) {
        AWS.config.update(config.awsS3)
        const params = {
            Bucket: config.s3Bucket,
            Key: `${filepath}`
        };
        this.s3Bucket.getSignedUrl('getObject',params,(err,url) => {
            callback(url,err)
        })
    }
}

const s3 = new S3Interface
module.exports = s3;