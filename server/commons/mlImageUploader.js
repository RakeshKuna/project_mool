/**
 * Created by mohammed.mohasin on 19/3/17.
 */
'use strict';

let Q = require('q');
import _ from 'lodash';
/*
var ImageUploader = function(options,callback){

  var deferred = Q.defer();

  mlS3Client.uploadFile(options.file,options.bucketName, options.bucketFolder,callback);

  callback(err, response);
  req.on('response', function(res) {
    if (res.statusCode === 200) {
      deferred.resolve(req.url);
    } else
      deferred.reject({error: 'true'});
  });

  req.end(buf);

  return deferred.promise;
};

module.exports = ImageUploader;
*/

module.exports = class ImageUploader{
  constructor(){
    this.deferred = Q.defer();
    this.uploadFile.bind(this);
    this.uploadCallBack.bind(this);
  }

  uploadCallBack(err,resp){
    if(resp){
       this.deferred.resolve(resp);
    }else{
       this.deferred.reject({error: 'true'});
    }
  }


  uploadFile(file, s3Bucket, bucketFolder){
    mlS3Client.uploadFile(file,s3Bucket,bucketFolder,this.uploadCallBack.bind(this));

    return this.deferred.promise;
    }
}
