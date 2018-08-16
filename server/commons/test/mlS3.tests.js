import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import StubCollections from 'meteor/hwillson:stub-collections';
import { sinon } from 'meteor/practicalmeteor:sinon';

let AWS = require('aws-sdk');
let fs = require('fs');

const s3Client = require('../mlS3.js');

describe('mlS3 Module', function () {
    //
    // Setup Test Instance before each tests is run
    //
    beforeEach(function () {
        sandbox = sinon.sandbox.create(AWS.S3);
        s3ClientInstance = new s3Client();
    });
    afterEach(function () {
        sandbox.restore();
    });
    it('tests getS3SignedUrl', function () {
        sandbox.restore();
        var getSignedUrl = AWS.S3.prototype.getSignedUrl = sandbox.stub();
        s3ClientInstance.getS3SignedUrl("myKey", "myS3Bucket");
        assert(getSignedUrl.calledOnce);
    });
    it('tests getS3PublicUrl', function () {
        sandbox.restore();
        var getPublicUrlHttp = AWS.S3.prototype.getPublicUrlHttp = sandbox.stub();
        s3ClientInstance.getS3PublicUrl("myKey", "myS3Bucket");
        assert(getPublicUrlHttp.calledOnce);
    });


});