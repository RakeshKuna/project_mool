/**
 * Created by ajiteshkumar on 17/5/17.
 */

import mlAccounts from '../mlAccounts';
import '../../../lib/collections/admin/registration/mlRegistration.js';

const MlDBController = require('../mlDBController');
const MlEmail = require('../mlEmail.js');

describe('mlAccounts Module', function(){
    before(function(){
        regId = "";
        emailOptions = {"context": {}};
        customEmailComponent = "";

        mldbfoStub = sinon.stub(MlDBController.prototype, 'findOne');
        mlemailStub = sinon.stub(MlEmail.prototype, 'sendHtml');
    });
    after(function(){
        mldbfoStub.restore();
        mlemailStub.restore();
    });
    it('should verify email link', function(){
        var token = "kjsdhaYT6576kewqjehwq^%$NBVNBV";
        var expectedUrl = Meteor.absoluteUrl("verify-email/" + token);
        var returnedUrl = mlAccounts.verifyEmailLink(token);
        expect(returnedUrl).to.be.equal(expectedUrl);
    });
    it('should greet users with message', function(){
        var message = "Some Message";
        var url = "http://www.moolya.in";
        var user = {
            "registrationInfo": {
                "firstName": "Rakesh"
            }
        }
        var messageReturned = mlAccounts.greet(message, user, url);
        var messageExpected = '<html xmlns="http://www.w3.org/1999/xhtml"> <body> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#e1e4e7" background="https://s3.ap-south-1.amazonaws.com/moolya-public-images/email_background.png" style="background-size:cover; background-position:center;"> <tr> <td align="center"><table class="table-inner" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td height="60"></td></tr><tr> <td align="center" style="border-top:3px solid #ef4647; border-radius:4px; border-left: 1px solid #ccc; border-right: 1px solid #ccc;" bgcolor="#FFFFFF"><table width="550" align="center" class="table-inner" border="0" cellspacing="0" cellpadding="0"> <tr> <td height="15"></td></tr><tr> <td> <table class="table-full" border="0" align="left" cellpadding="0" cellspacing="0"> <tr> <td align="center" style="line-height:0px;"><img style="display:block; line-height:0px; font-size:0px; border:0px;" src="https://s3.ap-south-1.amazonaws.com/moolya-public-images/moolya_logo.png" alt="logo"/></td></tr></table> <table width="1" height="15" border="0" cellpadding="0" cellspacing="0" align="left"> <tr> <td height="15" style="font-size: 0;line-height: 0;border-collapse: collapse;"><p style="padding-left: 26px;">&nbsp;</p></td></tr></table> <table align="right" class="table-full" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="center" style="font-family: "Roboto", sans-serif; font-size:14px; color:#7f8c8d; line-height:30px;"><a href="#"><img src="https://s3.ap-south-1.amazonaws.com/moolya-public-images/world_startup.png"></a> </td></tr></table> </td></tr><tr> <td height="15"></td></tr></table></td></tr><tr> <td align="center" bgcolor="#FFFFFF" style=" border-radius:4px; border: 1px solid #ccc; border-top: 0;"><table align="center" class="table-inner" width="550" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="left" style="font-family: "Roboto", sans-serif; font-size:15px; font-weight:600; color:#485D74; line-height:30px;"><p style="text-align: left;"> Dear <span style="color: #ef4647; font-weight:bold">Rakesh,</span></p><p style="font-size: 15px;">Greetings and thank you for creating an account with <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya ! </span></p><p> There is just one more step before you can explore infinite possibilities with <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span>: you need to activate your <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span> account. To activate your account, click on the following link or copy and paste the link into your browser\'s address bar. </p><p> Link:http://www.moolya.in</p><p>After you activate your account, you can complete your profile. You we will receive occasional emails from us about new information or other updates.</p><p> If you need our help, write to us at <span style="color:#ef4647">startup@moolya.in</span> or <br>give us a call <span style="color:#ef4647">+91-40-6551 8300.</span> </p><p> Have an <span style="color:#ef4647">empowering</span> day ! </p><p>Regards </p><p>Team <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span> </p></td></tr><tr> <td height="40"></td></tr><tr> <td height="40" align="left" style="font-family: "Roboto", sans-serif; font-size:10px; color:#485D74; line-height:14px; border-top: 1px solid #ccc"> <p><span style="color:#ef4647">Disclaimer:</span> Breach of confidentiality: </p><p>This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error please notify us at ‘startup@moolya.in’. This message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. If you are not the intended recipient you are notified that disclosing, copying, distributing or taking any action in reliance on the contents of this information is strictly prohibited.</p><p> <span style="color:#ef4647">Disclaimer:</span> Liability for the unintentional transmission of computer viruses: </p><p> WARNING: Although we have taken reasonable precautions to ensure no viruses are present in this email, we cannot accept responsibility for any loss or damage arising from the use of this email or attachments. </p></td></tr><tr> <td height="20"></td></tr></table></td></tr><tr> <td> <table align="left" class="table-full" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="font-family: "Roboto", sans-serif; font-size:12px; color:#7f8c8d; line-height:30px;"> © 2017 moolya All Rights Reserved. </td></tr></table> </td></tr><tr> <td height="60"></td></tr></table></table> </body></html>';
        expect(messageReturned).to.be.equal(messageExpected);
    });
    it('should fail to send verification email if there is an error in retrieving user details', function(){
        var address = "";

        mldbfoStub.returns(undefined);
        expect(function(){
            mlAccounts.sendVerificationEmail(regId, emailOptions, address, customEmailComponent);
        }).to.throw(/Can't find user/);

    });
    it('should fail to send verification email if user email address is not provided', function(){

        var address = false;
        var user = {_id: "abcdefgh1234", email: "rakesh.naik@raksan.in", emails:["rakesh.naik@raksan.in"], password: "Welcome123$%", profile: {name: "rakesh.naik"}};

        mldbfoStub.returns(user);
        expect(function(){
            mlAccounts.sendVerificationEmail(regId, emailOptions, address, customEmailComponent);
        }).to.throw(/That user has no unverified email addresses./);

    });
    it('should fail to send verification email if matching user is not found', function(){

        var address = "mohammed.mohasin@raksan.in";
        var user = {_id: "abcdefgh1234", email: "rakesh.naik@raksan.in", emails:[{"address": "rakesh.naik@raksan.in"}], password: "Welcome123$%", profile: {name: "rakesh.naik"}};

        mldbfoStub.returns(user);
        expect(function(){
            mlAccounts.sendVerificationEmail(regId, emailOptions, address, customEmailComponent);
        }).to.throw(/No such email address for user./);

    });
    it('should send customized verification email', function(){
        var user = {_id: "abcdefgh1234", email: "rakesh.naik@raksan.in", emails:[{"address": "rakesh.naik@raksan.in"}], password: "Welcome123$%", profile: {name: "rakesh.naik"}};
        mldbfoStub.returns(user);


        var address = "rakesh.naik@raksan.in";
        var tokenRecord = {
            token: Random.secret(),
            address: address,
            when: new Date()
        };
        var verificationLink = MlAccounts.verifyEmailLink(tokenRecord.token);
        var customEmailComponent = function(user, verificationLink) {
            return "This is a tests email message";
        }

        var mlRegStub = stubs.create('mlRegUpdate', MlRegistration, 'update');

        //
        // For contentType as HTML
        //
        var emailOptionsContentTypeHtml = {"context": {}, "emailContentType": "html" };
        // mlAccounts.sendVerificationEmail(regId, emailOptionsContentTypeHtml, address, customEmailComponent);
        // var args = mlemailStub.getCall(0).args;

        stubs.restoreAll();
    });
    it('should send packaged verification email', function(){
    });
    it('should send verification email of type html', function(){
    });
    it('should send verification email of type json', function(){
    });
    it('should throw verification email link expired error for expired tokens', function(){
    });
    it('should throw verification email link error for unknown address', function(){
    });
    it('should verify email address', function(){
    });
    it('should fail to send verification SMS OTP for unregistered mobile number', function(){
    });
    it('should send customized verification SMS OTP', function(){
    });
    it('should send packaged verification SMS OTP', function(){
    });
    it('should fail to resend verification SMS OTP for unregistered mobile number', function(){
    });
    it('should resend customized verification SMS OTP', function(){
    });
    it('should resend packaged verification SMS OTP', function(){
    });
    it('should fail to verify OTP for unregistered mobile number', function(){
    });
    it('should fail to verify for already verified mobile number', function(){
    });
    it('should fail to verify for expired OTP', function(){
    });
    it('should fail to verify for incorrect OTP', function(){
    });
    it('should fail to verify for invalid OTP', function(){
    });
    it('should verify Mobile Number OTP', function(){
    });
});
