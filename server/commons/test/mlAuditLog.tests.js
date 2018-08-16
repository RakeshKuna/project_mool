/**
 * Created by ajiteshkumar on 14/5/17.
 */
import { resetDatabase } from 'meteor/xolvio:cleaner';
import StubCollections from 'meteor/hwillson:stub-collections';
import async from 'async';
import each from 'async/each';
import '../../../lib/collections/admin/mlAudit.js';

var diff = require('deep-diff').diff;

const mlAuditLog = require('../mlAuditLog.js');

describe('MlAuditLog Module', function(){

    beforeEach(function() {
        mlAL = new mlAuditLog();
        resetDatabase();
    });
    it('should insert audit log - integration tests', function(){
        expect(1).to.be.equal(1);
        //
        // Create a dummy user
        //
        userEmail = "tests@example.com";
        userPassword = "secret";
        userName = "Test user";
        userId = Accounts.createUser({email: userEmail, password: userPassword, profile: {name: userName}, username: userName});
        //
        // Prepare request
        //
        var context = {
          ip: '127.0.0.1',
          browser: 'chrome',
          url: 'http://www.moolya.in',
          userId: userId
        };
        var auditParams = {
          docId: 'xyz12ab34ccbMNOazyx',
          queryPayload: {
              userId: userId,
              moduleName: 'Payload Module',
              collectionName: 'MlCommunity',
              url: 'http://www.moolya.in',
              docId: 'xyz12ab34ccbMNOazyx',
              action: 'payment',
              actionName: 'ActionPayment'
          },
          collectionName: 'MlCommunity'
        };
        //
        // Create stub and spy
        //
        var stubMlAudit = stubs.create('mlAuditInsert', MlAudit, 'insert');
        var spyAsync = sinon.spy(async, 'each');
        //
        // Invoke the method to be tested
        //
        mlAL.insertAudit(auditParams, context);
        //
        // Assert that async.each method is called
        // Assert that async.each is invoked with right arguments
        //
        assert(async.each.calledOnce);
        var args = spyAsync.getCall(0).args[0];
        expect(args.length).to.be.equal(5);
        expect(args[0].path[0]).to.be.equal("userId");
        expect(args[0].rhs).to.be.equal(userId);
        expect(args[1].path[0]).to.be.equal("collectionName");
        expect(args[1].rhs).to.be.equal("MlCommunity");
        expect(args[2].path[0]).to.be.equal("url");
        expect(args[2].rhs).to.be.equal("http://www.moolya.in");
        expect(args[3].path[0]).to.be.equal("docId");
        expect(args[3].rhs).to.be.equal("xyz12ab34ccbMNOazyx");
        expect(args[4].path[0]).to.be.equal("action");
        expect(args[4].rhs).to.be.equal("payment");
        //
        // Assert that MlAudit.insert is invoked with right arguments
        //
        var args = stubMlAudit.getCall(0).args[0];
        expect(args.userId).to.be.equal(userId);
        expect(args.userName).to.be.equal(userName);

        stubs.restoreAll();
        async.each.restore();
    });
    it('should update audit log', function(){
        expect(1).to.be.equal(1);
    });
});