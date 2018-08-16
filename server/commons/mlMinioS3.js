/**
 * Created by shubhankit on 23/10/17.
 */
'use strict';
let AWS = require('aws-sdk');
let awsConfig = require('aws-config');
let fs = require('fs')
Meteor.startup(function () {

})
const port = "9090"
const minioAccessKey = Meteor.settings.private.minio&&Meteor.settings.private.minio.minioConfig&&Meteor.settings.private.minio.minioConfig.accessKeyId?Meteor.settings.private.minio.minioConfig.accessKeyId:'RakSan987';
const minioSecretKey = Meteor.settings.private.minio&&Meteor.settings.private.minio.minioConfig&&Meteor.settings.private.minio.minioConfig.secretAccessKey?Meteor.settings.private.minio.minioConfig.secretAccessKey:'RakSan987';
const endPoint = Meteor.settings.private.minio&&Meteor.settings.private.minio.minioConfig&&Meteor.settings.private.minio.minioConfig.endPoint?Meteor.settings.private.minio.minioConfig.endPoint:"127.0.0.1";

var endPointUsed = "http://" + endPoint+":"+port;
if (Meteor.settings.public.minio && Meteor.settings.public.minio.minioConfig.secure){
  endPointUsed = endPoint;
}

const s3 = new AWS.S3(
  { accessKeyId: minioAccessKey,
    secretAccessKey: minioSecretKey,
    endpoint: endPointUsed,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
  }
);

module.exports = class s3Client{
  generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  uploadFile(file, s3Bucket, bucketFolder, callback){
    var uniqueId=this.generateUUID();
    let fileData = fs.createReadStream(file.path);
    let filename = file.name.replace(/ /g,'')
    var params = {
      Bucket:s3Bucket,
      Key: bucketFolder+uniqueId+"-"+filename,
      ContentType:"application/octet-stream",
      Body: fileData
    }
    s3.putObject(params, Meteor.bindEnvironment(function(err, response) {
      console.log(response);
      if(err){
        if(callback){
          callback(err, response);
        }
      }
      else{
        let url = `${bucketFolder}${uniqueId}-${filename}`;
        if(callback){
          callback(err,url);
        }
      }
    }));
  }

  getS3SignedUrl(fileName, s3Bucket, fromDate, toDate){
    //fileName is the full fileName with the folderName and uuid attached.

    var expiryDuration = (toDate-fromDate)/1000;
    s3.getSignedUrl('getObject', {
      Bucket: s3Bucket,
      Key: fileName,
      Expires: expiryDuration,
    }, function(err, presignedUrl) {
      if (err) {
        callback(err);
      }
      else{
        callback(presignedUrl);
      }
    });
  }
}
