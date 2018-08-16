import { resetDatabase } from 'meteor/xolvio:cleaner';
import StubCollections from 'meteor/hwillson:stub-collections';
import { Email } from 'meteor/email';

const mlEmail = require('../mlEmail.js');

describe('Email Module', function () {
    //
    // Setup Test Instance before each tests is run
    //
    beforeEach(function () {
        mlE = new mlEmail();
        emailStub = sinon.stub(Email, 'send');

    });
    //
    // Demo: Stubbing the method and spying on the arguments passed to the method
    //
    it('should send right email object to Email.send', function() {
        var emailObj = {
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            "html": "Just wanted to check how is it going with testing?"
        };

        var emailSent = mlE.sendHtml(emailObj);

        assert(Email.send.calledOnce);
        assert(Email.send.calledWithMatch({
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            "html": "Just wanted to check how is it going with testing?"
        }));
    });
    //
    // Demo: Stubbing the method and spying on the arguments passed to the method
    //
    it('should send attachment with to everyone when CC provided', function() {
        var emailObj = {
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            "content": "Just wanted to check how is it going with testing?",
            "contentType": "json",
            "fileName": "helloworld.txt",
            "cc": "rakesh.naik@raksan.in"
        };
        mlE.sendAttachment(emailObj);
        assert(Email.send.calledOnce);
        assert(Email.send.calledWithMatch({
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            attachments:[{contents: "Just wanted to check how is it going with testing?",
            contentType: "json",
            fileName: "helloworld.txt"}]
        }));
        expect("rakesh.naik@raksan.in").to.be.equal(Email.send.getCall(0).args[0].cc);
    });
    //
    // Demo: Stubbing the method and spying on the arguments passed to the method
    //
    it('should send attachment to everyone when CC not provided', function() {
        var emailObj = {
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            "content": "Just wanted to check how is it going with testing?",
            "contentType": "json",
            "fileName": "helloworld.txt"
        };
        mlE.sendAttachment(emailObj);
        assert(Email.send.calledOnce);
        assert(Email.send.calledWithMatch({
            "from": "ajitesh.kumar@raksan.in",
            "to": "amit.singh@raksan.in",
            "subject": "Regarding moolya testing",
            attachments:[{contents: "Just wanted to check how is it going with testing?",
            contentType: "json",
            fileName: "helloworld.txt"}]
        }));
        expect(undefined).to.be.equal(Email.send.getCall(0).args[0].cc);
    });
    //
    //
    afterEach(function() {
        emailStub.restore();
    });
})
