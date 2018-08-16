
/**
 * Created by mohammed.mohasin on 26/04/17.
 */
import mlSms from './mlSms';
import MlDBController from './mlDBController';
import MlTransactionsHandler from '../../server/commons/mlTransactionsLog';
import passwordUtil from "./passwordUtil";
import NotificationTemplateEngine from "../commons/mlTemplateEngine"
import mlSmsController from "../mlNotifications/mlSmsNotifications/mlSmsController"
import mlSMSConst from "../mlNotifications/mlSmsNotifications/mlSmsConstants"
import MlEmailNotification from "../mlNotifications/mlEmailNotifications/mlEMailNotification"
import MlSMSNotification from '../mlNotifications/mlSmsNotifications/mlSMSNotification'
import MlAdminUserContext from "../mlAuthorization/mlAdminUserContext";
import _ from 'underscore'
import moment from "moment";
var _lodash = require('lodash');

var fromEmail = Meteor.settings.private.fromEmailAddr;
export default MlAccounts=class MlAccounts {

  static verifyEmailLink(token){
    return Meteor.absoluteUrl('verify-email/' + token);
  }

  /*static greet(message,user, url) {                                                                                        // 2
      var greeting = user&&user.name ? "Hello " + user.name + "," : "Hello,";                  // 3
      return greeting + "\n\n"+message+" simply click the link below.\n\n" + url + "\n\nThanks.\n";              // 5
    };  */                                                                                                                 // 13

  static greet(message,user, url) {
    /*var greeting='<html><body><div style="max-width:900px;margin:0 auto;min-height:350px;font-family:arial;font-size:14px;background:#fff;width:90%;color:#000">' +
      'Dear ' + (user&&user.registrationInfo&&user.registrationInfo.firstName?user.registrationInfo.firstName+',':"")+'<br/><br/> Greetings and thank you for creating an account with moolya! <br/><br/>'+
      'There is just one more step before you can explore infinite possibilities with moolya: you need to activate your moolya account. <br/><br/>' +
      'To activate your account, click on the following link or copy and paste the link into your browser\'s address bar <br/><br/>' +
      'Link: '+ url +'  <br/><br/>'+
      'If you need our help, write to us at startup@moolya.in or give us a call +91-40-6551 8300.' +'<br/><br/>'+
      'Have an empowering day!<br/><br/>Regards,<br/>Team moolya.'+
      '</div></body></html>';*/
    var greeting='<html xmlns="http://www.w3.org/1999/xhtml"> <body> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#e1e4e7" background="https://s3.ap-south-1.amazonaws.com/moolya-public-images/email_background.png" style="background-size:cover; background-position:center;"> <tr> <td align="center"><table class="table-inner" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td height="60"></td></tr><tr> <td align="center" style="border-top:3px solid #ef4647; border-radius:4px; border-left: 1px solid #ccc; border-right: 1px solid #ccc;" bgcolor="#FFFFFF"><table width="550" align="center" class="table-inner" border="0" cellspacing="0" cellpadding="0"> <tr> <td height="15"></td></tr><tr> <td> <table class="table-full" border="0" align="left" cellpadding="0" cellspacing="0"> <tr> <td align="center" style="line-height:0px;"><img style="display:block; line-height:0px; font-size:0px; border:0px;" src="https://s3.ap-south-1.amazonaws.com/moolya-public-images/moolya_logo.png" alt="logo"/></td></tr></table> <table width="1" height="15" border="0" cellpadding="0" cellspacing="0" align="left"> <tr> <td height="15" style="font-size: 0;line-height: 0;border-collapse: collapse;"><p style="padding-left: 26px;">&nbsp;</p></td></tr></table> <table align="right" class="table-full" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="center" style="font-family: "Roboto", sans-serif; font-size:14px; color:#7f8c8d; line-height:30px;"><a href="#"><img src="https://s3.ap-south-1.amazonaws.com/moolya-public-images/world_startup.png"></a> </td></tr></table> </td></tr><tr> <td height="15"></td></tr></table></td></tr><tr> <td align="center" bgcolor="#FFFFFF" style=" border-radius:4px; border: 1px solid #ccc; border-top: 0;"><table align="center" class="table-inner" width="550" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="left" style="font-family: "Roboto", sans-serif; font-size:15px; font-weight:600; color:#485D74; line-height:30px;"><p style="text-align: left;"> Dear <span style="color: #ef4647; font-weight:bold">'+ (user&&user.registrationInfo&&user.registrationInfo.firstName?user.registrationInfo.firstName+',':"")+'</span></p><p style="font-size: 15px;">Greetings and thank you for creating an account with <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya ! </span></p><p> There is just one more step before you can explore infinite possibilities with <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span>: you need to activate your <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span> account. To activate your account, click on the following link or copy and paste the link into your browser\'s address bar. </p><p> Link:<a href="'+url+'" id="link" >'+url+'</a></p><p>After you activate your account, you can complete your profile. You will receive occasional emails from us about new information or other updates.</p><p> If you need our help, write to us at <span style="color:#ef4647">startup@moolya.in</span> or <br>give us a call <span style="color:#ef4647">+91-40-6551 8300.</span> </p><p> Have an <span style="color:#ef4647">empowering</span> day ! </p><p>Regards </p><p>Team <span style="color:#ef4747;">m</span><span style="color:#ffc316">oo</span><span style="color:#ef4747">lya</span> </p></td></tr><tr> <td height="40"></td></tr><tr> <td height="40" align="left" style="font-family: "Roboto", sans-serif; font-size:10px; color:#485D74; line-height:14px; border-top: 1px solid #ccc"> <p><span style="color:#ef4647">Disclaimer:</span> Breach of confidentiality: </p><p>This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error please notify us at ‘startup@moolya.in’. This message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. If you are not the intended recipient you are notified that disclosing, copying, distributing or taking any action in reliance on the contents of this information is strictly prohibited.</p><p> <span style="color:#ef4647">Disclaimer:</span> Liability for the unintentional transmission of computer viruses: </p><p> WARNING: Although we have taken reasonable precautions to ensure no viruses are present in this email, we cannot accept responsibility for any loss or damage arising from the use of this email or attachments. </p></td></tr><tr> <td height="20"></td></tr></table></td></tr><tr> <td> <table align="left" class="table-full" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="font-family: "Roboto", sans-serif; font-size:12px; color:#7f8c8d; line-height:30px;"> © 2017 moolya All Rights Reserved. </td></tr></table> </td></tr><tr> <td height="60"></td></tr></table></table> </body></html>';
    return greeting;
  };





  static sendVerificationEmail(regId,emailOptions,address,customEmailComponent){

    // XXX Also generate a link using which someone can delete this
    // account if they own said address but weren't those who created this account.
    // Make sure the user exists, and address is one of their addresses.
    // var user = Meteor.users.findOne(regId);
    var userId=regId;
    mlDBController = new MlDBController();
    var user=mlDBController.findOne('MlRegistration', {_id:regId},emailOptions.context||{});
    if (!user) throw new Error("Can't find user"); // pick the first unverified address if we weren't passed an address.
    //
    if (!address) {
      var email = _.find(user.emails || [], function (e) {
        return !e.verified;
      });

      address = (email || {}).address;

      if (!address) {
        throw new Error("That user has no unverified email addresses.");
      }
    } // make sure we have a valid address

    if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) throw new Error("No such email address for user.");
    var tokenRecord = {
      token: Random.secret(),
      address: address,
      when: new Date()
    };

    MlRegistration.update({_id: userId},
      {$push: {'services.email.verificationTokens': tokenRecord}});
    //Meteor.users.update({_id: userId }, {$push: {'services.email.verificationTokens': tokenRecord}});

    var verificationLink = MlAccounts.verifyEmailLink(tokenRecord.token);
    var emailContent=null;

    if (typeof customEmailComponent === 'function') {
      emailContent = customEmailComponent(user,verificationLink);
    }else{
      emailContent= MlAccounts.greet("To verify your account email,",user,verificationLink);
    }

    emailOptions.from=fromEmail;
    emailOptions.to=address;
    emailOptions.subject="Welcome to moolya !";
    let regObj = {
      path : verificationLink,
      firstName : user&&user.registrationInfo&&user.registrationInfo.firstName?user.registrationInfo.firstName:"",
      contactNumber : "+91-40-4672 5725 /Ext",
      hours : 72,
      fromEmail : emailOptions&&emailOptions.from?emailOptions.from:"",
      toEmail : emailOptions&&emailOptions.to?emailOptions.to:"",
    }
    //let notificationEmailContent = NotificationTemplateEngine.fetchTemplateContent("EML_User_activation_mailer","email",regObj)
    if (emailOptions&&emailOptions.emailContentType==="html") {

      MlEmailNotification.userVerficationLink(regObj);
    }else if(emailOptions&&emailOptions.emailContentType==="text") {
      emailOptions.text=emailContent;
      Meteor.setTimeout(function () {
        mlEmail.sendJson(emailOptions);
      },2 * 1000);
    };

    return {userId: user._id};

  }; // Take token from sendVerificationEmail, mark the email as verified


  static verifyEmail(token) {
       //var user = Meteor.users.findOne({'services.email.verificationTokens.token': token});

    // IF User is not found with the token, it means link "is Already Verified"
      var user=mlDBController.findOne('MlRegistration', {'services.email.verificationTokens.token': token}, {})
      if(!user) return {email:null, error: true,reason:"EMAIL ALREADY VERIFIED", code:403};

    // IF User is not found with the token and Status, it means link "has been rendered inactive"
      user=mlDBController.findOne('MlRegistration', {'services.email.verificationTokens.token': token,"status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}},{});/*Status check to handle the verification for rejected registraiton: MOOLYA-3421*/
      if (!user)  return {email:null, error: true,reason:"REGISTRATION INACTIVATED", code:403};//throw new Error(403, "Verify email link expired");

      var tokenRecord = _.find(user.services.email.verificationTokens, function (t) {
        return t.token == token;
      });

      if (!tokenRecord)
        return {email: null, error: true, reason:"Verify email link expired", code:403};

      var emailsRecord = _.find(user.emails, function (e) {
        return e.address == tokenRecord.address;
      });

      if (!emailsRecord) return {userId: user._id,error: true, reason: "Verify email link is for unknown address",code:403};
      // By including the address in the query, we can use 'emails.$' in the
         // modifier to get a reference to the specific object in the emails
         // array.


    let verficationTokensArray = user&&user.services&&user.services.email&&user.services.email.verificationTokens?user.services.email.verificationTokens:[]
    let verficationTokenObject = _.findWhere(verficationTokensArray, {token: token});
    let linkGenerateDate = verficationTokenObject&&verficationTokenObject.when?verficationTokenObject.when:null
    let hours = moment().diff(linkGenerateDate, 'hours')
    let registrationCommunityName = user&&user.registrationInfo&&user.registrationInfo.communityDefCode&&
                                          user.registrationInfo.communityDefCode? user.registrationInfo.communityDefCode:""
    //Expiring token for office memeber if link generated is more than 72hours
    // if(registrationCommunityName=="OFB"&&hours>72){
    //   return  MlRegistration.update({_id: user._id,'emails.address': tokenRecord.address},{$set: {'emails.$.verified': true },
    //     $pull: {'services.email.verificationTokens': {address: tokenRecord.address}}});
    // }
    if(hours>72) {

      MlRegistration.update({_id: user._id,'emails.address': tokenRecord.address},{$set: {'emails.$.verified': true },
            $pull: {'services.email.verificationTokens': {address: tokenRecord.address}}});

      this.sendVerificationEmail(user._id, {
        emailContentType: "html",
        subject: "Email Verification",
        context: {}
      })

      return {email:null, error: true,reason:"LINK EXPIRED", code:403};

    }

    let emailVerified = MlRegistration.update({_id: user._id,'emails.address': tokenRecord.address},{$set: {'emails.$.verified': true },
                         $pull: {'services.email.verificationTokens': {address: tokenRecord.address}}});

    if(emailVerified){
       let emailSent = MlEmailNotification.onEmailVerificationSuccess(user);
      // let smsSent = MlSMSNotification.onVerificationSuccess(user);
       //otp sms has to be send
      this.sendVerificationSmsOtp(user._id, user.registrationInfo.contactNumber)

      //on successful email verification
      //MlSMSNotification.sendSMSonSuccessfulEmailVerification(user._id, user.registrationInfo.contactNumber)
    }

    return {
      email:tokenRecord.address,emailVerified:true,recordId:user._id,error: false, mobileNumber:user.registrationInfo.contactNumber
    };
  }

/*  static sendSMSonSuccessfulEmailVerification(regId, mobileNumber){
    var regDetails = mlDBController.findOne('MlRegistration',{_id:regId});
    if(!regDetails){
      throw new Error(403, "Mobile Number entered  is not registered");
    }
    var countryCode = (regDetails.registrationInfo||{}).countryId;
    var sms = _.find(mlSMSConst, 'SMS_EMAIL_VERIFIED')
    var msg= sms.SMS_EMAIL_VERIFIED
    mlSmsController.sendSMS(msg, countryCode, mobileNumber)
  }*/

  static sendVerificationSmsOtp(regId,numbr,customEmailComponent){

    var regDetails = mlDBController.findOne('MlRegistration',{_id:regId});

    if(!regDetails){
      throw new Error(403, "Mobile Number entered  is not registered");
    }

    var otp = null;
    var mobileNumber=numbr;
    var countryCode=(regDetails.registrationInfo||{}).countryId;
    var msg=null;
    if(!numbr){
      mobileNumber=(regDetails.registrationInfo||{}).contactNumber;
    }

    var otps = regDetails.otps || [];

    if(otps){
      for(var i =0; i<otps.length; i++){
        var otpRec = otps[i];
        if(otpRec.verified === false){
          if(new Date() - otpRec.time.getTime() < 60*60*1000){
            otp = otpRec.num;
            otpRec.resendTime = new Date();
            break;
          }
        }
      }
    }else{
      var otpNumber = Math.floor(1000 + Math.random() * 9000)+"";
      otps = [{num: otpNumber, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode}];
      otp=otpNumber;
    }

    var otpNum = otp || Math.floor(1000 + Math.random() * 9000)+"";
    if(otp){
      //DO WE NEED TO UPDATE THE TIME?
    }else{
      otps.push({num:otpNum, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode});
    }

    MlRegistration.update({_id: regId},{$set:{"otps": otps}});

    if (typeof customEmailComponent === 'function') {
      msg = customEmailComponent(regDetails,otpNum);
    }else{
      /*msg= "\n\nThank you for registering with moolya!\n"+
      "\n\nUse "+otpNum+" as One Time Password (OTP) to verify your moolya account. Do not share this OTP to anyone for security reasons.\n"+
      "\n\nRegards,\n" +
      "\n\nTeam moolya\n";*/
      msg= "Your email-id has been verified."+"Please use "+otpNum+" as OTP to verify your mobile number when prompted. Do not share this OTP with anyone. - Team moolya"
    }

    //send SMS
    if(mobileNumber){

      Meteor.setTimeout(function() {
        mlSmsController.sendSMS(msg, countryCode, mobileNumber)
        // mlSms.send(countryCode,mobileNumber,msg);
      }, 1 * 1000);

    }

    // before passing to template, update user object with new token
    var resp={};
    resp.mobileNumber=mobileNumber;
    resp.otp=otp;
    return resp;
  }

  static sendUserVerificationSmsOtp(userId,customEmailComponent){

    var user = mlDBController.findOne('users',{_id:userId});

    var mobileNumber = null;
    var externalProfile = {};
    if(user && user.profile){

      if(user.profile && user.profile.externalUserProfiles && user.profile.externalUserProfiles.length>0){
        externalProfile = _.find(user.profile.externalUserProfiles, {isDefault:true});
        if(!externalProfile){
          externalProfile = user.profile.externalUserProfiles[0]
        }
      }
      mobileNumber = externalProfile.mobileNumber;

      if(!mobileNumber){
        return {mobileNumber:"", error: true,reason:"Mobile Number is not available", code:403};
      }

    }

    var otp = null;
    var mobileNumber=mobileNumber;
    var countryCode=externalProfile.countryId;
    var msg=null;
    // if(!mobileNumber){
    //   mobileNumber=(regDetails.registrationInfo||{}).contactNumber;
    // }

    var otps = user.otps || [];

    if(otps){
      for(var i =0; i<otps.length; i++){
        var otpRec = otps[i];
        if(otpRec.verified === false){
          if(new Date() - otpRec.time.getTime() < 60*60*1000){
            otp = otpRec.num;
            otpRec.resendTime = new Date();
            break;
          }
        }
      }
    }else{
      var otpNumber = Math.floor(1000 + Math.random() * 9000)+"";
      otps = [{num: otpNumber, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode}];
      otp=otpNumber;
    }

    var otpNum = otp || Math.floor(1000 + Math.random() * 9000)+"";
    if(otp){
      //DO WE NEED TO UPDATE THE TIME?
    }else{
      otps.push({num:otpNum, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode});
    }

    Meteor.users.update({_id: userId},{$set:{"otps": otps}});

    if (typeof customEmailComponent === 'function') {
      msg = customEmailComponent(user,otpNum);
    }else{
      msg= "\n\nThank you for registering with moolya!\n"+
        "\n\nUse "+otpNum+" as One Time Password (OTP) to verify your moolya account. Do not share this OTP to anyone for security reasons.\n"+
        "\n\nRegards,\n" +
        "\n\nTeam moolya\n";

    }

    //send SMS
    if(mobileNumber){

      Meteor.setTimeout(function() {
        mlSmsController.sendSMS(msg, countryCode, mobileNumber)
        // mlSms.send(countryCode,mobileNumber,msg);
      }, 1 * 1000);

    }

    // before passing to template, update user object with new token
    var resp={};
    resp.mobileNumber=mobileNumber;
    resp.otp=otp;
    return resp;
  }

  static resendVerificationSmsOtp(numbr,customEmailComponent){

    var regDetails = mlDBController.findOne('MlRegistration',{"registrationInfo.contactNumber":numbr,"status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}});

    if(!regDetails){
      throw new Error(403, "Mobile Number entered is not registered");
    }

    let to=(regDetails.registrationInfo||{}).contactNumber;
    let countryCode=(regDetails.registrationInfo||{}).countryId;

    if(!to){
      throw new Error(403, "Mobile Number entered is not registered");
    }
    var otp = null;
    var mobileNumber=to;
    var msg=null;
    var otps = regDetails.otps;
    if(otps){
      for(var i =0; i<otps.length; i++){
        var otpRec =otps[i];
        if(otpRec.verified === false){
          if(new Date() - otpRec.time.getTime() < 15*60*1000){
            otp = otpRec.num;
            otpRec.resendTime = new Date();
            break;
          }
        }
      }

    }else{
      var otpNumber = Math.floor(1000 + Math.random() * 9000)+"";
      otps = [{num: otpNumber, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode}];
      otp=otpNumber;
    }

    var otpNum = otp || Math.floor(1000 + Math.random() * 9000)+"";
    if(otp){
      //DO WE NEED TO UPDATE THE TIME?
    }else{
      otps.push({num:otpNum, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode});
    }
    MlRegistration.update({"registrationInfo.contactNumber":numbr,"status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}},{$set:{"otps":otps}});
    //send SMS
    if (typeof customEmailComponent === 'function') {
      msg = customEmailComponent(regDetails,otpNum);
    }else{
      msg= "Use "+otpNum+" as One Time Password (OTP) to verify your moolya account. Do not share this OTP to anyone for security reasons.";
    }
    //send SMS
    if(mobileNumber){

      Meteor.setTimeout(function() {

        // mlSms.send(countryCode,to,msg);
        mlSmsController.sendSMS(msg, countryCode, to)
      }, 1 * 1000);

    }

    // before passing to template, update user object with new token
    var resp={};
    resp.mobileNumber=mobileNumber;
    resp.otp=otp;
    return resp;

  }
  static resendUserVerificationSmsOtp(userId,customEmailComponent){

    var user = mlDBController.findOne('users', {'_id': userId}) || {};
    var mobileNumber = null;
    var externalProfile = {}
    if(user && user.profile){

      if(user.profile && user.profile.externalUserProfiles && user.profile.externalUserProfiles.length>0){
        externalProfile = _.find(user.profile.externalUserProfiles, {isDefault:true});
        if(!externalProfile){
          externalProfile = user.profile.externalUserProfiles[0]
        }
      }
      mobileNumber = externalProfile.mobileNumber;

      if(!mobileNumber){
        return {mobileNumber:"", error: true,reason:"Mobile Number is not available", code:403};
      }

    }

    let to=mobileNumber;
    let countryCode=externalProfile.countryId;

    if(!to){
      throw new Error(403, "Mobile Number entered is not registered");
    }
    var otp = null;
    var mobileNumber=to;
    var msg=null;
    var otps = user.otps;
    if(otps){
      for(var i =0; i<otps.length; i++){
        var otpRec =otps[i];
        if(otpRec.verified === false){
          if(new Date() - otpRec.time.getTime() < 15*60*1000){
            otp = otpRec.num;
            otpRec.resendTime = new Date();
            break;
          }
        }
      }

    }else{
      var otpNumber = Math.floor(1000 + Math.random() * 9000)+"";
      otps = [{num: otpNumber, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode}];
      otp=otpNumber;
    }

    var otpNum = otp || Math.floor(1000 + Math.random() * 9000)+"";
    if(otp){
      //DO WE NEED TO UPDATE THE TIME?
    }else{
      otps.push({num:otpNum, time: new Date(), verified: false,mobileNumber:mobileNumber,countryId:countryCode});
    }
    Meteor.users.update({_id:userId},{$set:{"otps": otps}});
    //send SMS
    if (typeof customEmailComponent === 'function') {
      msg = customEmailComponent(user,otpNum);
    }else{
      msg= "Use "+otpNum+" as One Time Password (OTP) to verify your moolya account. Do not share this OTP to anyone for security reasons.";
    }
    //send SMS
    if(mobileNumber){

      Meteor.setTimeout(function() {

        // mlSms.send(countryCode,to,msg);
        mlSmsController.sendSMS(msg, countryCode, to)
      }, 1 * 1000);

    }

    // before passing to template, update user object with new token
    var resp={};
    resp.mobileNumber=mobileNumber;
    resp.otp=otp;
    return resp;

  }

  static verifyLaterUserMobileNumber(numbr){

    var regDetails = mlDBController.findOne('MlRegistration',{"registrationInfo.contactNumber":numbr,"status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}});

    if(!regDetails){
      throw new Error(403, "Mobile Number entered is not registered");
    }

    let to=(regDetails.registrationInfo||{}).contactNumber;
    let countryCode=(regDetails.registrationInfo||{}).countryId;

    if(!to){
      throw new Error(403, "Mobile Number entered is not registered");
    }

    //send SMS
    if (typeof customEmailComponent === 'function') {
      msg = customEmailComponent(user);
    }else{
      msg= "You have opted for 'Verify later'. You can verify your mobile number from 'My Profile'.";
    }

    //send SMS
    if(to){
      Meteor.setTimeout(function() {
        // mlSms.send(countryCode,to,msg);
        mlSmsController.sendSMS(msg, countryCode, to)
      }, 1 * 1000);
    }

    // before passing to template, update user object with new token
    var resp={};
    resp.success=true;
    return resp;
  }

  static verifyUserMobileNumberOtp(userId, otp){

    var user = mlDBController.findOne('users', {'_id': userId}) || {};
    var mobileNumber = null;
    if(user && user.profile){

        if(user.profile && user.profile.externalUserProfiles && user.profile.externalUserProfiles.length>0){
          var externalProfile = _.find(user.profile.externalUserProfiles, {isDefault:true});
          if(!externalProfile){
            externalProfile = user.profile.externalUserProfiles[0]
          }
        }
        mobileNumber = externalProfile.mobileNumber;

        if(!mobileNumber){
          return {mobileNumber:"", error: true,reason:"Mobile Number is not available", code:403};
        }

    }


    if( user.otps && user.otps.length > 0){
      var otpFound = false;
      var otpVerified=false;
      var otpExpired=false;
      for(var i =0; i<user.otps.length; i++){
        var otpRec = user.otps[i];

        //Commented as it was validating old otp for reset pwd
        if(otpRec.verified === true){
          otpFound = true;
          otpVerified=true;
          break;
        }
        let otpNum=otpRec.num;
        if(otpNum&&Number(otpNum) === otp && otpRec.verified === false){
          var otpTime = 15;//todo: configure it as the settings
          if(new Date() - otpRec.time.getTime() > (otpTime*60*10000 || 5*60*10000)){
            //throw new Error(403, "OTP "+otp+" has expired, generate new one with resend option");
            otpExpired=true;
            break;
          }
          otpRec.verified = true;
          var mobileArr = user.mobileNumbers;
          if(mobileArr){
            var mobileObj = _.find(mobileArr, {mobileNumber:mobileNumber})
            if(mobileObj){
              mobileObj.verified = true
              _lodash.remove(mobileArr, {mobileNumber:mobileNumber})
              mobileArr.push(mobileObj);
            }
            user.mobileNumbers = mobileArr;
          }else{
            let mobileNumbers = [{ num: otpNum, time: new Date(), verified: otpRec.verified, mobileNumber: mobileNumber, countryId: otpRec.countryId}];
            user.mobileNumbers = mobileNumbers;
          }

          var updatedCount=Meteor.users.update({_id:userId},{$set:{"otps":user.otps, "mobileNumbers":user.mobileNumbers}});
          otpFound = true;
          break;
        }
      }

      if(otpVerified){
        return {mobileNumber:mobileNumber, error: true,reason:"Mobile Number entered has already been verified", code:403};
      }else if(otpExpired){
        return {mobileNumber:mobileNumber, error: true,reason:"OTP "+otp+" has expired, generate new one with resend option", code:403};
      }else if(!otpFound){
        return {mobileNumber:mobileNumber, error: true,reason:"OTP is Invalid, enter a correct one or try resend option", code:403};
      }else{
        return {mobileNumber:mobileNumber,recordId:user._id, error: false,reason:"Mobile Number has been verified.", code:200};
        //These commented lines are to generate token for user to login when the user verifies his mobile/email
        // var stampedLoginToken = Accounts._generateStampedLoginToken();
        // Accounts._insertLoginToken(user._id, stampedLoginToken);
        //return stampedLoginToken;
      }

    }else{
      //throw new Error(403, "Invalid otp,Please provide a valid otp to verify your number");
      return {mobileNumber:mobileNumber, error: true,reason:"Invalid otp,Please provide a valid otp to verify your number", code:403};
    }
  }

  static verifyMobileNumberOtp(mobileNumber, otp){
    /** added a check to verify the mobile Number if registration is not rejected.*/
    var regDetails = mlDBController.findOne('MlRegistration',{"registrationInfo.contactNumber":mobileNumber,"status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}});

    if(!regDetails){
      //throw new Error(403, "Mobile Number entered is not registered");
      return {mobileNumber:mobileNumber, error: true,reason:"Mobile Number entered is not registered", code:403};
    }


    if( regDetails.otps && regDetails.otps.length > 0){
      var otpFound = false;
      var otpVerified=false;
      var otpExpired=false;
      for(var i =0; i<regDetails.otps.length; i++){
        var otpRec = regDetails.otps[i];

        //Commented as it was validating old otp for reset pwd
        if(otpRec.verified === true){
          otpFound = true;
          otpVerified=true;
          break;
        }
        let otpNum=otpRec.num;
        if(otpNum&&Number(otpNum) === otp && otpRec.verified === false){
          var otpTime = 15;//todo: configure it as the settings
          if(new Date() - otpRec.time.getTime() > (otpTime*60*10000 || 5*60*10000)){
            //throw new Error(403, "OTP "+otp+" has expired, generate new one with resend option");
            otpExpired=true;
            break;
          }
          otpRec.verified = true;
          var updatedCount=MlRegistration.update({_id:regDetails._id},{$set:{"otps":regDetails.otps}});
          otpFound = true;
          break;
        }
      }

      if(otpVerified){
        return {mobileNumber:mobileNumber, error: true,reason:"Mobile Number entered has already been verified", code:403};
      }else if(otpExpired){
        return {mobileNumber:mobileNumber, error: true,reason:"OTP "+otp+" has expired, generate new one with resend option", code:403};
      }else if(!otpFound){
        return {mobileNumber:mobileNumber, error: true,reason:"OTP is Invalid, enter a correct one or try resend option", code:403};
      }else{
        return {mobileNumber:mobileNumber,recordId:regDetails._id, error: false,reason:"Mobile Number has been verified.", code:200};
        //These commented lines are to generate token for user to login when the user verifies his mobile/email
        // var stampedLoginToken = Accounts._generateStampedLoginToken();
        // Accounts._insertLoginToken(user._id, stampedLoginToken);
        //return stampedLoginToken;
      }

    }else{
      //throw new Error(403, "Invalid otp,Please provide a valid otp to verify your number");
      return {mobileNumber:mobileNumber, error: true,reason:"Invalid otp,Please provide a valid otp to verify your number", code:403};
    }
  }

  static sendForgotPasswordEamil(email, context) {
    var user = mlDBController.findOne('users', {"$or":[{username:email},{'emails.address':email}]});
    if(!user){
      return {email:email, error: true,reason:"Invalid Email, User not register with this email", code:404};
    }
    context.userId = user._id;
    context.browser = 'Forgot Password';
    context.url=Meteor.absoluteUrl('')||"moolya";
    let token = Random.secret();
    let res = mlDBController.update('users', user._id, { 'services.password.reset.token': token }, {$set:true}, context);
   /* let regObj = {
      "firstName" : user&&user.profile&&user.profile.firstName?user.profile.firstName:"",
      "path" : Meteor.absoluteUrl('reset')+'/'+token
    }*/


    /*let notificationEmailContent = NotificationTemplateEngine.fetchTemplateContent("EML_forgot_reset_password_mailer","email",regObj)*/
    if(res){
      let emailSent = MlEmailNotification.forgotPassword(context, Meteor.absoluteUrl('reset')+'/'+token);
      let userId = user&&user._id?user._id:""
    /*  var emailOptions={};
      //emailContent= MlAccounts.greet("To verify your account email,",user,Meteor.absoluteUrl('reset')+'/'+token);
      emailOptions.from=fromEmail;
      emailOptions.to=email;
      emailOptions.subject="Forgot Password !";
      emailOptions.html=notificationEmailContent&&notificationEmailContent.content?notificationEmailContent.content:"";
      Meteor.setTimeout(function () {
        mlEmail.sendHtml(emailOptions);
      }, 2 * 1000);*/
      return {error: false,reason:"Reset link send successfully", code:200};
    }
  }

  static resetPasswordWithToken(token, password, context) {
    user = mlDBController.findOne('users', {"services.password.reset.token":token});
     if(!user){
      return {token:token, error: true,reason:"Reset link Expired/Used", code:404};
    }
    context.userId = user._id;
    context.browser = 'Reset Password API';
    context.url=Meteor.absoluteUrl('')||"moolya";
    let salted = passwordUtil.hashPassword(password);
    let res = mlDBController.update('users', user._id, { 'services.password.bcrypt': salted, 'services.password.reset': {} }, {$set:true}, context);
    if(res){
      if(user._id){
        MlSMSNotification.forgotPassword(user._id,context)
      }
      return {error: false,reason:"Password reset successfully", code:200};
    }else{
      if(user._id){
        MlSMSNotification.errorForForgotPassword(user._id,context)
      }
    }
  }

  static resetSwitchProfile(userId,context){
    try {
      var user = mlDBController.findOne('users', {_id: userId}) || {};
      var userProfile = user.profile || {};
      var result = null;
      var hasSwitchedProfile = userProfile.hasSwitchedProfile;
      var switchedProfileDefaultId = userProfile.switchedProfileDefaultId;

      if (!hasSwitchedProfile || !switchedProfileDefaultId) return;

      if (userProfile.isInternaluser) {
        /*reset switch profile to false and update the default profile  */
        result = mlDBController.update('users', {'_id': userId,'profile.isInternaluser': true, "profile.hasSwitchedProfile": true,
           "profile.InternalUprofile.moolyaProfile.userProfiles": {$elemMatch: {'clusterId': switchedProfileDefaultId}}},
          {"profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": true,
           "profile.hasSwitchedProfile": false,"profile.switchedProfileDefaultId":null}, {$set: true}, context);

        /*mark remaining profiles as false if default id is set*/
        if(result===1){
          result= mlDBController.update('users', {'_id':userId,'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'clusterId':{$ne:switchedProfileDefaultId}}}},
            {"profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": false}, {$set: true,multi:true}, context);
        }

      } else {

        /*reset switch profile to false and update the default profile  */
        result = mlDBController.update('users', {'_id': userId,'profile.isExternaluser': true, "profile.hasSwitchedProfile": true,
            "profile.externalUserProfiles": {$elemMatch: {'profileId': switchedProfileDefaultId}}},
          {"profile.externalUserProfiles.$.isDefault": true,
            "profile.hasSwitchedProfile": false,"profile.switchedProfileDefaultId":null}, {$set: true}, context);

        /*mark remaining profiles as false if default id is set*/
        if(result===1){
          result= mlDBController.update('users', {'_id':userId,'profile.externalUserProfiles':{$elemMatch: {'profileId':{$ne:switchedProfileDefaultId}}}},
            {"profile.externalUserProfiles.$.isDefault": false}, {$set: true,multi:true}, context);
        }

      }
    } catch (e) {
      console.log(e);
    }

  }
}

Meteor.methods({
  checkPassword: function(digest) {
    check(digest, String);
    if (this.userId) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  }
})

Accounts.validateLoginAttempt(function (details) {
  if(details&&details.user&&details.user.profile.InternalUprofile&&details.user.profile.InternalUprofile.moolyaProfile&&details.user.profile.InternalUprofile.moolyaProfile.assignedDepartment && details.user.profile.InternalUprofile.moolyaProfile.assignedDepartment.length == 1){
    let departmentId = details.user.profile.InternalUprofile.moolyaProfile.assignedDepartment[0].department;
    let userId = details&&details.user&&details.user._id?details.user._id:""
    let userProfile=new MlAdminUserContext().userProfileDetails(userId);
    let clusterId = userProfile&&userProfile.defaultCluster?userProfile.defaultCluster:""
    if(departmentId !='all') {
      mlDBController = new MlDBController();
      var department = mlDBController.findOne('MlDepartments',{_id:departmentId}, this);
      let clusterExists = MlDepartments.findOne( {
          $and : [
              { _id : departmentId },
              {"depatmentAvailable.cluster" : {$in : [clusterId,"all"]}}
          ]
      } )
      if(!department.isActive){
        throw new Meteor.Error('department-deactivated', 'You do not have any active department');
        return false;
      }else if(!clusterExists){
        throw new Meteor.Error('department-dont exist', 'You do not have any active department');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
})

Accounts.onLogin(function (details) {
if(details.type =="password") {
  var userId = (details.user || {})._id;
  let context = {
    ip: details.connection.clientAddress,
    browser: details.connection.httpHeaders['user-agent'],
    url: details.connection.httpHeaders.host,
    userId:userId,
    deviceModel:"-",
    deviceType: "-",
    deviceVendor:"-"
  };
    //check if the switch profile has to be changed
    MlAccounts.resetSwitchProfile(userId,context);

  let transactionDetails = `User logged in to application at ${new Date()} `;
  new MlTransactionsHandler().recordTransaction({
    'activity': 'login',
    'transactionType': 'system',
    'userId': userId,
    'transactionDetails': transactionDetails,
    'context': context,
    'transactionTypeId': "system",
    'transactionId':orderNumberGenService.createSystemTransactionId()
  });
}else{

}
});

Accounts.onLogout(function (details) {
  var userId=(details.user || {})._id;
  let context={ip: details.connection.clientAddress,browser:details.connection.httpHeaders['user-agent'],url:details.connection.httpHeaders.host};
  let transactionDetails=`User logged out of application at ${new Date()} `;
  if(details&&details.user){
    new MlTransactionsHandler().recordTransaction({'activity':'logout','transactionType':'system','transactionTypeId': "system",'userId':userId,'transactionDetails':transactionDetails,'context':context,'transactionId':orderNumberGenService.createSystemTransactionId()});
  }
});

