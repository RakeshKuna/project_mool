import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import MlRegistrationPreCondition from "./registrationPreConditions";
import MlAccounts from "../../../commons/mlAccounts";
import mlRegistrationRepo from "./mlRegistrationRepo";
import MlAdminUserContext from "../../../mlAuthorization/mlAdminUserContext";
import MlUserContext from "../../../MlExternalUsers/mlUserContext";
import geocoder from "geocoder";
import _lodash from "lodash";
import _ from "underscore";
import moment from "moment";
import MlEmailNotification from "../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlNotificationController from '../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import {getCommunityName, encryptPassword, deCryptPassword} from '../../../commons/utils';
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';
import MlSMSNotification from '../../../mlNotifications/mlSmsNotifications/mlSMSNotification'
import {userAgent} from '../../../commons/utils';

var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');


MlResolver.MlMutationResolver['createRegistration'] = (obj, args, context, info) => {
  var validationCheck = null;
  let updateRecord = {}
  if (!args.registration.registrationType) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("'Registration Type' is mandatory", code);
    return response;
  } else if (!args.registration.userName) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("Username is mandatory!", code);
    return response;
  }
  validationCheck = MlRegistrationPreCondition.validateEmail(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }

  let date = new Date()
  validationCheck = MlRegistrationPreCondition.validateMobile(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }

  validationCheck = MlRegistrationPreCondition.validateBackEndUserExist(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }
  validationCheck = MlRegistrationPreCondition.validateCommunity(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }
  /**Validate Office Bearer registration,Fix: MOOLYA-2690*/
  validationCheck = MlRegistrationPreCondition.validateOFBCommunity(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }

 // let accountTypeName = mlDBController.findOne('MlAccountTypes', {_id: args.registration.accountType}, context) || {};
  // let subChapterDetails = MlSubChapters.findOne({chapterId: args.registration.chapterId})||{};
  //args.registration.accountType = accountTypeName.accountName;
  let subChapterDetails
  if (args.registration.subChapterId) {
    subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: args.registration.subChapterId}, context) || {};
  } else {  //default moolya subChapter will be taken
    subChapterDetails = mlDBController.findOne('MlSubChapters', {chapterId: args.registration.chapterId}, context) || {};
  }
  const password = args.registration && args.registration.password ? encryptPassword(args.registration.password) : ""
  args.registration.password = password;
  args.registration.clusterName = subChapterDetails.clusterName;
  args.registration.chapterName = subChapterDetails.chapterName;
  args.registration.subChapterName = subChapterDetails.subChapterName;
  args.registration.subChapterId = subChapterDetails._id;

  var communityDetails = mlDBController.findOne('MlCommunity', {
      subChapterId: (subChapterDetails._id || null),
      communityDefCode: args.registration.registrationType
    }, context) || {};
  var communityDef = mlDBController.findOne('MlCommunityDefinition', {code: (args.registration.registrationType || null)}, context) || {};
  args.registration.communityId = communityDetails._id;
  args.registration.communityName = communityDetails.communityName || communityDef.name;
  args.registration.communityDefName = communityDetails.communityDefName;
  args.registration.communityDefCode = communityDetails.communityDefCode;

  // args.registration.registrationDate=moment(date).format('DD/MM/YYYY HH:mm:ss')
  args.registration.registrationDate = date
  // let transactionCreatedDate = moment(date).format('DD/MM/YYYY hh:mm:ss')
  orderNumberGenService.assignRegistrationId(args.registration)
  var emails = [{address: args.registration.email, verified: false}];
  var user = mlDBController.findOne('users', {_id: context.userId}) || {}
  var firstName = '';
  var lastName = '';

  //todo:// make it same for internal and external user for first and last name according to new schema
  if (user) {
    if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {
      firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
      lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
    } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName = (user.profile || {}).firstName || '';
      lastName = (user.profile || {}).lastName || '';
    }
  }
  // /**
  //  * @Note: merging the condition for the "internal/external" user's
  //   * for opening this condition take care of the systemAdmin with ETL in all instance
  //  * */
  // if (user && user.profile) {
  //     firstName = (user.profile || {}).firstName || '';
  //     lastName = (user.profile || {}).lastName || '';
  // }
  /*Assign UserAgent to registration object - Fix for Issue: MOOLYA-769*/
  setUserAgentForRegistration(args.registration,userAgent(context.browser),context.ip);

  let createdBy = firstName + ' ' + lastName
  args.registration.createdBy = createdBy ? createdBy : user.username;
  let id = mlDBController.insert('MlRegistration', {
    registrationInfo: args.registration,
    status: "REG_EMAIL_P",
    emails: emails,
    transactionId: args.registration.registrationId,
    transactionCreatedDate: new Date()
  }, context)
  if (id) {
    mlRegistrationRepo.updateStatus(updateRecord,'REG_EMAIL_P');
    let updatedResponse = mlDBController.update('MlRegistration',id,updateRecord, {$set: true}, context)
    //sms to be sent on new moolya registration
    MlSMSNotification.sendSMSonSuccessfulEmailVerification(id)
    MlResolver.MlMutationResolver['sendEmailVerification'](obj, {registrationId: id}, context, info);
    validationCheck = MlRegistrationPreCondition.validateActiveCommunity(id, args.registration);
    if (validationCheck && !validationCheck.isValid) {
      return validationCheck.validationResponse;
    }
    // MlResolver.MlMutationResolver['sendSmsVerification'](obj, {registrationId:id}, context, info);

    //send email and otp;
    let code = 200;
    let result = {registrationId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

/**
 * @Note: commented the authorization as the authorization now moved to generic layer
 * todo:// need to check with business for the moolya and non-moolya pre conditions before the register as
 * */
MlResolver.MlMutationResolver['registerAs'] = (obj, args, context, info) => {
  let updateRecord = {}
  var response = null;
  if (!args.registrationId) {
    let code = 409;
    response = new MlRespPayload().errorPayload("'Registration Id' is mandatory!", code);
    return response;
  }
  if (!args.registration.registrationType) {
    let code = 409;
    response = new MlRespPayload().errorPayload("'Registration Type' is mandatory!", code);
    return response;
  } else if (!args.registration.userName) {
    let code = 409;
    response = new MlRespPayload().errorPayload("'Username' is mandatory!", code);
    return response;
  }
  var validationCheck = MlRegistrationPreCondition.validateRegisterAsActiveCommunity(args.registration);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }
  var userInfo = mlDBController.findOne('MlRegistration', args.registrationId, context) || {};
  let userRegisterInfo = userInfo.registrationInfo;
  let registrationInfo = args.registration;

  let clusterInfo = MlClusters.findOne({_id: registrationInfo.clusterId});
  let communityDef = mlDBController.findOne('MlCommunityDefinition', {code: (args.registration.registrationType || null)}, context) || {};
  registrationInfo.communityName = communityDef.name;
  registrationInfo.clusterName = clusterInfo.clusterName;
  registrationInfo.clusterId = clusterInfo._id;

  var regDetails = _lodash.pick(userRegisterInfo, ['countryId', 'cityId', 'password', 'accountType', 'institutionAssociation', 'companyname', 'companyUrl', 'remarks', 'referralType']);
  registrationInfo = _lodash.extend(registrationInfo, regDetails);
  registrationInfo.createdBy = userRegisterInfo.firstName + ' ' + userRegisterInfo.lastName;

  const regDetailsStep = _lodash.pick(userInfo.registrationDetails, ['dateOfBirth', 'firstName', 'middleName', 'lastName', 'displayName', 'gender']);


  if (registrationInfo.subChapterId) {
    let mlSubChapterAccessControl = MlSubChapterAccessControl.getAccessControl('TRANSACT', context, registrationInfo.subChapterId);
    if (!mlSubChapterAccessControl.hasAccess) {
      let code = 400;
      let response = new MlRespPayload().errorPayload('You do not have access to transact', code);
      return response;
    }
    var subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: registrationInfo.subChapterId}) || {}
    registrationInfo.chapterName = subChapterDetails.chapterName
    registrationInfo.subChapterName = subChapterDetails.subChapterName
  }
  registrationInfo.registrationDate = new Date();
  validationCheck = MlRegistrationPreCondition.validateEmailClusterCommunity(registrationInfo);
  if (validationCheck && !validationCheck.isValid) {
    return validationCheck.validationResponse;
  }

  orderNumberGenService.assignRegistrationId(args.registration)
  var emails = [{address: args.registration.email, verified: true}];
  //create transaction
  /*let resp = MlResolver.MlMutationResolver['createRegistrationTransaction'] (obj,{'transactionType':"registration"},context, info);
   args.registration.transactionId = resp.result;*/
  let id = mlDBController.insert('MlRegistration', {
    registrationInfo: registrationInfo,
    status: "REG_EMAIL_V",
    emails: emails,
    transactionId: registrationInfo.registrationId,
    registrationDetails: regDetailsStep
  }, context);
  if (id) {
    mlRegistrationRepo.updateStatus(updateRecord,'REG_EMAIL_V');
    let updatedResponse = mlDBController.update('MlRegistration',id,updateRecord, {$set: true}, context)
    let communityName = communityDef&&communityDef.name?communityDef.name:""
    if(updatedResponse){
      MlSMSNotification.registerAsRequest(id,communityName,context)
      MlEmailNotification.registerAsRequestSent(id,communityName,context)
      MlNotificationController.onNewRegistrationRequest(id,communityName,context)
    }



    /*  MlResolver.MlMutationResolver['sendEmailVerification'](obj, {registrationId:id}, context, info);*/
    // MlResolver.MlMutationResolver['sendSmsVerification'](obj, {registrationId:id}, context, info);

    //send email and otp;
    let code = 200;
    let result = {registrationId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

/**
 * @module [PHP website]
 * Registration request can be raised for specific sub chapter or for a cluster/chapter
 * */
MlResolver.MlMutationResolver['createRegistrationAPI'] = (obj, args, context, info) => {
  var response = null
  var registrationRecord={};
  var requestedSubChapterId=args.registration && args.registration.subChapterId ?args.registration.subChapterId.trim() :null;
  args.registration=_lodash.omit(args.registration,'subChapterId');
  var countryId=args.registration && args.registration.countryId ?args.registration.countryId :null;
  var cityId = args.registration && args.registration.cityId ? args.registration.cityId : "";
  var communityType = args.registration && args.registration.registrationType ? args.registration.registrationType :null;
  /**Country is mandatory if subChapter is not specified*/
  if(!requestedSubChapterId&&!countryId){
    response = new MlRespPayload().errorPayload({message:"Country is mandatory"},400);
    return response;
  }
  /**registration Type is mandatory*/
  if (!communityType) {
   return new MlRespPayload().errorPayload("'Community Type' is mandatory", 400);
  }
  /**set context for systemadmin user*/
  var sysAdmin = mlDBController.findOne('users', {"profile.email": 'systemadmin@moolya.global'}, context) || {};
  var sysAdminProfile=sysAdmin&&sysAdmin.profile&&sysAdmin.profile.InternalUprofile&&sysAdmin.profile.InternalUprofile.moolyaProfile?sysAdmin.profile.InternalUprofile.moolyaProfile:{};
  context.userId = sysAdmin._id;
  //context.browser = 'Registration API'
  context.url = Meteor.absoluteUrl("");
 /**Validate if User is registered in moolya application (specific business requirement) */
  /**fix:MOOLYA-3391*/
  var registrationExist = MlRegistration.findOne({
    $or:[{"registrationInfo.email": args.registration.email},{"registrationInfo.contactNumber": args.registration.contactNumber}],
    status: {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}
  })
  var userExist = mlDBController.findOne('users', {"profile.email": args.registration.email}, context) || {};
  if (registrationExist || userExist._id) {
    let code = 400;
    let result = {message: "There is an existing registration with the same email-Id/mobile number"}
    var isActiveOFB = MlRegistrationPreCondition.checkActiveOfficeBearer(args)
    if (isActiveOFB)
      result = {message: "Sorry, your request requires Office admin attention. Please contact your Office Admin."}
    let errResp = new MlRespPayload().errorPayload(result, code);
    return errResp;
  }
  else if (args.registration) {
    //Community type and name
    var communityDef = mlDBController.findOne('MlCommunityDefinition', {code: (communityType || null)}, context) || {};
    registrationRecord["registrationInfo.registrationType"] = args.registration.registrationType;
    registrationRecord["registrationInfo.communityName"] = communityDef.name;
    registrationRecord["registrationInfo.communityDefName"] = communityDef.name;
    registrationRecord["registrationInfo.communityDefCode"] = communityDef.code;


    registrationRecord["registrationInfo.email"] = args.registration.email;
    registrationRecord["registrationInfo.firstName"] = args.registration.firstName;
    registrationRecord["registrationInfo.lastName"] = args.registration.lastName;
    registrationRecord["registrationInfo.userName"] = args.registration.email;
    registrationRecord["registrationInfo.contactNumber"] = args.registration.contactNumber;
    registrationRecord["registrationInfo.password"] = encryptPassword(args.registration.password);         //password encryption of the registration from WEB
    registrationRecord["registrationInfo.countryId"] = args.registration.countryId;
    registrationRecord["registrationInfo.cityId"] = args.registration.cityId;

    //Coupon Code/Campaign Code for promotions
    registrationRecord["promoCode"] = args.registration.promoCode||null;
    registrationRecord["campaignCode"] = args.registration.campaignCode||null;

    var emails = [{address: args.registration.email, verified: false}];

    orderNumberGenService.assignRegistrationId(args.registration);
    registrationRecord["registrationInfo.registrationDate"] = new Date();

    /**
     * attaching "clusterId, chapterId, subChapterId" if they are active
     * @else giving null value to them
     * */
    var subChapterData=null;var clusterData=null;var chapterData=null;var chapterId=null;
    if(requestedSubChapterId){/**Registration request for specific sub chapter*/
      subChapterData = mlDBController.findOne('MlSubChapters', {_id:requestedSubChapterId,isActive:true}, context) || {};
      clusterData = mlDBController.findOne('MlClusters', {_id: subChapterData.clusterId}, context) || {}
      chapterData = mlDBController.findOne('MlChapters', {_id: subChapterData.chapterId}, context) || {};
      args.registration.countryId=clusterData?clusterData.countryId:null;
    }else{
       clusterData = mlDBController.findOne('MlClusters', {countryId: countryId, isActive: true}, context) || {}
       chapterData = mlDBController.findOne('MlChapters', {cityId: cityId, isActive: true}, context) || {}
       chapterId = chapterData && chapterData._id ? chapterData._id : ""
       subChapterData = mlDBController.findOne('MlSubChapters', {chapterId: chapterId, isActive: true,isDefaultSubChapter:true}, context) || {}
    }
    registrationRecord["registrationInfo.clusterId"] = clusterData && clusterData._id ? clusterData._id : "";
    registrationRecord["registrationInfo.clusterName"]  = clusterData && clusterData.clusterName ? clusterData.clusterName : "";
    registrationRecord["registrationInfo.chapterId"]  = chapterData && chapterData._id ? chapterData._id : "";
    registrationRecord["registrationInfo.chapterName"] = chapterData && chapterData.chapterName ? chapterData.chapterName : "";
    registrationRecord["registrationInfo.subChapterId"] = subChapterData && subChapterData._id ? subChapterData._id : "";
    registrationRecord["registrationInfo.subChapterName"] = subChapterData && subChapterData.subChapterName ? subChapterData.subChapterName : "";
    registrationRecord["registrationInfo.createdBy"] = (sysAdminProfile.firstName||'') + ' ' + (sysAdminProfile.lastName||'');

    var transactionId=args.registration.registrationId;


    registrationRecord["emails"] = emails;
    registrationRecord["status"] = "REG_EMAIL_P";
    registrationRecord["registrationDetails"] = {identityType: args.registration.identityType};

    /*Assign UserAgent to registration object - Fix for Issue: MOOLYA-769*/
    var {source,deviceName,deviceNumber,ipAddress,ipLocation}=setUserAgentForRegistration({},userAgent(context.browser),context.ip);
    registrationRecord["registrationInfo.source"]=source;registrationRecord["registrationInfo.deviceName"]=deviceName;registrationRecord["registrationInfo.deviceNumber"]=deviceNumber;registrationRecord["registrationInfo.ipAddress"]=ipAddress;registrationRecord["registrationInfo.ipLocation"]=ipLocation;

    var updateCount=mlDBController.update('MlRegistration',{"registrationInfo.email":args.registration.email,status: {$nin: ['REG_ADM_REJ', 'REG_USER_REJ']}},registrationRecord,{$set: true,upsert:true,setOnInsert:true,setOnInsertObject:{transactionId:transactionId}}, context);

    if(updateCount==1){
     // mlRegistrationRepo.updateStatus(updateRecord,'REG_EMAIL_P');
    //  let updatedResponse = mlDBController.update('MlRegistration',response,updateRecord, {$set: true}, context)
      let regRec = mlDBController.findOne('MlRegistration', {transactionId:transactionId}, context);
      if(regRec){
         //sms to be sent on new moolya registration
        MlSMSNotification.sendSMSonSuccessfulEmailVerification(regRec&&regRec._id?regRec._id:"")
         let updatedResponse = mlDBController.update('MlRegistration',regRec._id,{'registrationInfo.registrationId':transactionId}, {$set: true}, context);
         MlResolver.MlMutationResolver['sendEmailVerification'](obj, {registrationId: regRec._id}, context, info);
         // MlResolver.MlMutationResolver['sendSmsVerification'](obj, {registrationId:response}, context, info);
        let code = 200;
        let result = {message: "You have successfully registered on moolya. Please check your email inbox for our email with the verification link", registrationId: args.registration.registrationId}
        let succResp = new MlRespPayload().successPayload(result, code);
        return succResp;
      }else{
        return new MlRespPayload().errorPayload({message: "Registration already exists"},400);
      }

    }
  }
  return response
}
/**
 * @module [registration]
 * getting user registration details
 * */
MlResolver.MlQueryResolver['findRegistrationInfo'] = (obj, args, context, info) => {
  var response = null
  if (args.registrationId) {
    var id = args.registrationId;
    response = MlRegistration.findOne({"_id": id}) || {}
    var countryId = response.registrationInfo && response.registrationInfo.countryId ? response.registrationInfo.countryId : ""
    let country = countryId ? mlDBController.findOne('MlCountries', {_id: countryId}, context) : {};
    if (response && response.registrationInfo)
      response.registrationInfo.countryCode = country ? country.countryCode : ""
    return response
    // if (response && response.registrationInfo && response.registrationInfo.clusterId && response.registrationInfo.chapterId && response.registrationInfo.subChapterId) {
    //   return response;
    // } else(response && response.registrationInfo && !response.registrationInfo.clusterId && !response.registrationInfo.chapterId && response.registrationInfo.subChapterId)
    // {
    //   // let countryId = response.registrationInfo && response.registrationInfo.countryId ? response.registrationInfo.countryId : ""
    //   let cityId = response.registrationInfo && response.registrationInfo.cityId ? response.registrationInfo.cityId : ""
    //   let clusterData = mlDBController.findOne('MlClusters', {countryId: countryId, isActive: true}, context)
    //   let chapterData = mlDBController.findOne('MlChapters', {cityId: cityId, isActive: true}, context)
    //   let chapterId = chapterData && chapterData._id ? chapterData._id : ""
    //   let subChapterData = mlDBController.findOne('MlSubChapters', {chapterId: chapterId, isActive: true}, context)
    //   response.registrationInfo.clusterId = clusterData && clusterData._id ? clusterData._id : "";
    //   response.registrationInfo.chapterId = chapterData && chapterData._id ? chapterData._id : "";
    //   response.registrationInfo.subChapterId = subChapterData && subChapterData._id ? subChapterData._id : "";
    //   return response
    // }
  }
}

/**
 * @appHeader
 * @Note 1) "getting user registrationId from its default profile"
 *       2) "getting if any registration is other than pending or approved state"
 * */
MlResolver.MlQueryResolver['findRegistrationInfoForUser'] = (obj, args, context, info) => {
  let userId = context.userId;
  if (userId) {
    let profile = new MlUserContext(userId).userProfileDetails(userId)
    if (profile) {
      let registerId = profile.registrationId
      let username = mlDBController.findOne('users', {_id: userId}, context).username
      if (registerId) {
        var response = MlRegistration.findOne({"_id": registerId}) || {}

        let isAllowRegisterAs = mlDBController.findOne('MlRegistration', {   //MOOLYA_2792
          "registrationInfo.userName": username,
          "registrationInfo.communityDefCode": {$ne: "BRW"},
          "status": {$nin: ["REG_USER_APR", 'REG_ADM_REJ', 'REG_USER_REJ']}
        })
         const portfolioStatus = mlDBController.findOne('MlPortfolioDetails', { registrationId: registerId }) || {}
         response.portfolioStatus = portfolioStatus && portfolioStatus.status ? portfolioStatus.status : "" ;
        if (_lodash.isEmpty(isAllowRegisterAs))
          response.isAllowRegisterAs = true
        else {
          response.isAllowRegisterAs = false
          response.pendingRegId = isAllowRegisterAs._id;
        }

        if (response.status === "REG_USER_APR") {
          response.isCalendar = true;
        } else {
          response.isCalendar = false;
        }
        let communityCode = response && response.registrationInfo && response.registrationInfo.registrationType ? response.registrationInfo.registrationType : ''
        response.registrationInfo.communityName = getCommunityName(communityCode);
        response.headerCommunityDisplay = headerCommunityDisplay(response.registrationInfo, context)
        response.profileImage = profile.profileImage
        response.firstName = profile.firstName
        return response;
      }
    }
  }
}

MlResolver.MlMutationResolver['updateRegistrationInfo'] = (obj, args, context, info) => {

  if (args.registrationId) {
    var updatedResponse;
    var validationCheck = null;
    var result = null;
    // var registerDetails = null;
    var registrationInfo=null;
    var subChapterDetails = null;
    var id = args.registrationId;

    /**Get the registration Details*/
    var registerDetails = mlDBController.findOne('MlRegistration', id, context) || {};
    registrationInfo = registerDetails.registrationInfo ? registerDetails.registrationInfo : {};

    validationCheck = MlRegistrationPreCondition.isUserCanUpdate(registerDetails, context)
    if (validationCheck && !validationCheck.isValid) {
      return validationCheck.validationResponse;
    }


    if (args && args.registrationDetails && !args.registrationDetails.identityType) {
      if(!(args.registrationDetails.registrationType==="OFB" || args.registrationDetails.registrationType==="BRW")){
        let code = 401;
        let response = new MlRespPayload().errorPayload("Identity Type is required", code);
        return response;
      }

    }


    if (args.registrationDetails) {
      let details = args.registrationDetails || {};
      /**
       *Validate email verification of registration
       *return the error if email is not verified
       */
      validationCheck = MlRegistrationPreCondition.validateEmailVerification(registerDetails);
      if (validationCheck && !validationCheck.isValid) {
        return validationCheck.validationResponse;
      }
      validationCheck = MlRegistrationPreCondition.checkDuplicateContactNumber(details)
      if (validationCheck && !validationCheck.isValid) {
        return validationCheck.validationResponse;
      }
      /**country and operational area changes then making kyc null.*/
      if((registrationInfo.countryId!=details.countryId)||(registrationInfo.clusterId!=details.clusterId)||(registrationInfo.chapterId!=details.chapterId)||(registrationInfo.subChapterId!=details.subChapterId)||(registrationInfo.registrationType!=details.registrationType)||(registrationInfo.userType!=details.userType)||(registrationInfo.identityType!=details.identityType)||(registrationInfo.profession!=details.profession)||(registrationInfo.industry!=details.industry)){
          let updatedResp= MlRegistration.update({_id:id},{$unset:{kycDocuments:""}})
     }

   /*   if ((registrationInfo.clusterId != details.clusterId) || (registrationInfo.chapterId != details.chapterId) || (registrationInfo.subChapterId != details.subChapterId) || (registrationInfo.registrationType != details.registrationType) || (registrationInfo.userType != details.userType) || (registrationInfo.identityType != details.identityType) || (registrationInfo.profession != details.profession) || (registrationInfo.industry != details.industry)) {
        let updatedResp = MlRegistration.update({_id: id}, {$pull: {"kycDocuments": {$and: [{docTypeName: "process"}, {docTypeName: "chapter"}]}}})
      } else {
        let updatedResp = MlRegistration.update({_id: id}, {$unset: {kycDocuments: ""}})
      }*/
      /**Fetch accountType from accountType collection */
     // let accountTypeName = mlDBController.findOne('MlAccountTypes', {_id: args.registrationDetails.accountType}, context) || {};
     // args.registrationDetails.accountType = accountTypeName.accountName;
      /**If subChapter is selected by admin*/
      if (details.subChapterId) {
        subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: details.subChapterId}, context) || {};
      } else {
        /**Else Default moolya subChapter will be considered*/
        subChapterDetails = mlDBController.findOne('MlSubChapters', {chapterId: details.chapterId}, context) || {};
      }
      /**Operational details are captured*/
      details.clusterName = subChapterDetails.clusterName;
      details.chapterName = subChapterDetails.chapterName;
      details.subChapterName = subChapterDetails.subChapterName;
      details.subChapterId = subChapterDetails._id;
      details.createdBy = registrationInfo.createdBy;

      /**Assign UserAgent for registration : fix for Issue: MOOLYA-769*/
      let {source,ipAddress,ipLocation,deviceName,deviceNumber}=registrationInfo;
      details=_.extend(details,{source:source,ipAddress:ipAddress,ipLocation:ipLocation,deviceName:deviceName,deviceNumber:deviceNumber});

      details.registrationDate = registerDetails && registerDetails.registrationDate ? registerDetails.registrationDate : new Date();
      //details.transactionUpdatedDate =  new Date();
      // let communityDetails=MlCommunity.findOne({subChapterId:details.subChapterId,communityDefCode:details.registrationType})||{};
      /**Fetch community Definition*/
      let communityDetails = mlDBController.findOne('MlCommunity', {
          subChapterId: details.subChapterId,
          communityDefCode: details.registrationType
        }, context) || {};

      var communityDef = mlDBController.findOne('MlCommunityDefinition', {code: (details.registrationType || null)}, context) || {};
      /**
       *Validate selected community of user
       *return the error if community is inActive
       */
      validationCheck = MlRegistrationPreCondition.validateCommunity(details,id);
      if (validationCheck && !validationCheck.isValid) {
        return validationCheck.validationResponse;
      }
      /**
       *Community Details are captured or else for getting def code for (Browser and Office Bearer)
       */
      details.communityId = communityDetails._id;
      details.communityName = communityDetails.communityName || communityDef.name;
      details.communityDefName = communityDetails.communityDefName || communityDef.name;
      details.communityDefCode = communityDetails.communityDefCode || communityDef.code;

      details.identityType = details.identityType || null;
      details.transactionType = "registration";
      details.userType = details.userType || null;
      let user = Meteor.users.findOne({"username": details.userName});
      details.userId = user ? user._id : null;

      let registrationDetails = {identityType: details.identityType, userType: details.userType};

      //validate the registrationInfo for mandatory fields such as cluster chapter etc
      // updatedResponse= MlRegistration.update(id, {$set:  {registrationInfo:details,"registrationDetails.identityType":details.identityType,"registrationDetails.userType":details.userType }});
      /** Update the registration details like - registraionInfo and firstName,lastName,identityType,userType*/
      details.password = registrationInfo.password;     //password copy from DB encrypted only taken at creation type only
      let updateObj = {
        registrationInfo: details,
        "registrationDetails.firstName": details.firstName,
        "registrationDetails.lastName": details.lastName,
        "registrationDetails.identityType": details.identityType,
        "registrationDetails.userType": details.userType
      }
      mlRegistrationRepo.updateStatus(updateObj,'REG_SOFT_APR');
      //Auto Approve for Office Bearer
      if(_lodash.isMatch(details, {communityDefCode: 'OFB'})){
        mlRegistrationRepo.updateStatus(updateObj,'REG_USER_APR');//updateObj.status= 'REG_USER_APR';
      }

      updatedResponse = mlDBController.update('MlRegistration', id, updateObj, {$set: true}, context)

      /** External User Profile Object*/
      var userProfile = {
        registrationId: id,
        countryId: details.countryId,
        cityId: details.cityId,
        mobileNumber: details.contactNumber,
        clusterId: details.clusterId,
        clusterName: details.clusterName,
        chapterId: details.chapterId,
        chapterName: details.chapterName,
        subChapterId: details.subChapterId,
        subChapterName: details.subChapterName,
        communityId: details.communityId,
        communityName: details.communityName,
        communityDefCode: details.communityDefCode,
        communityDefName: details.communityDefName,
        accountType: details.accountType,
        userType: details.userType || null,
        identityType: details.identityType || null,
        countryName: '',
        cityName: '',
        communityType: '',
        isDefault: false,
        isActive: true,
        isApprove: false,
        optional: false
      }
      /** External User Profile Object if community is office breare make user default active*/
      let profile = {
        isInternaluser: false,
        isExternaluser: true,
        email: details.email,
        mobileNumber: details.contactNumber,
        isActive: (userProfile.communityDefCode=='OFB')?true:false,
        firstName: details.firstName,
        lastName: details.lastName,
        displayName: details.firstName + ' ' + details.lastName,
        externalUserProfiles: [userProfile],
        dateOfBirth: null,
        genderType: null
      }
      /**External User Object*/
      const password = details && details.password ? deCryptPassword(details.password) : ""               //password decrypt and sending to users for further implications
      //let pwdEncrypted = CryptoJS.SHA256(password).toString()
      let userObject = {
        username: details.email,
        password: password,
        profile: profile,
        emails: registerDetails && registerDetails.emails ? registerDetails.emails : [],
        mobileNumbers:registerDetails && registerDetails.otps ? registerDetails.otps : []
      }
      /** Check for User record, if it exists, update the profile of user*/
      var existingUser = mlDBController.findOne('users', {"username": userObject.username}, context)
      var updateCount = 0;
      var userId = null;

      if (existingUser) {
        /** Check if the registration profile(community based) exists for user and can be updated
         **/
        userId = existingUser._id;
        let externalUserProfiles = existingUser.profile.externalUserProfiles
        let userExProfile = _lodash.find(externalUserProfiles, {registrationId: id})
        /** If Profile exists,use the existing profileId*/
        if (userExProfile) {
          userProfile.profileId = userExProfile.profileId
        } else {
          /**Else Generate a new profileId*/
          orderNumberGenService.createUserProfileId(userProfile)
        }
        /**Update the registration profile Array item for external user profile*/
        result = mlDBController.update('users', {
            username: userObject.username,
            'profile.externalUserProfiles': {$elemMatch: {'registrationId': id}}
          },
          {"profile.externalUserProfiles.$": userProfile}, {$set: true}, context)

        /**if registration profile Array item doesn't exist,then push the profile item and update the profile*/
        if (result != 1) { //in the case of register as this query is used
          updateCount = mlDBController.update('users', {username: userObject.username}, {'profile.externalUserProfiles': userProfile}, {$push: true}, context);
        } else {
          updateCount = 1;
        }
        /**Email & MobileNumber verification updates to User Profile*/
        mlRegistrationRepo.updateUserVerificationDetails(id, 'all', context);
      } else {/**User record does not exists, create the profile of user*/
        /** This is to generate the profileId if it does not exist */
        orderNumberGenService.createUserProfileId(userProfile)
        /** create the profile of user*/
        userId = mlDBController.insert('users', userObject, context)
        if (userId) {
          /** Creating user record in Conversations */

          MlNotificationController.createNewUser({userId:userId, userName:userObject.username})

          /** Email & MobileNumber verification updates to user*/
          mlDBController.update('users', {username: userObject.username},
            {
              $set: {
                'services.email': registerDetails && registerDetails.services ? registerDetails.services.email : {},
                'emails': userObject.emails,
                'mobileNumbers':userObject.mobileNumbers
              }
            }, {'blackbox': true}, context);

          /**if user is type Office brearer then update office members also*/
          if(_lodash.isMatch(details, {communityDefCode: 'OFB'})){
            let officeObj = {
              registrationId: id,
              officeMember: {userId: userId, profileId: userProfile.profileId, isActive:true}
            }
            MlResolver.MlMutationResolver['updateOfficeMemberOnReg'](obj, officeObj, context, info);
          }
        }
      }
      /** This condition check is to update the userId in the registration record once the External User Profile is created*/
      if (updateCount === 1 || userId) {
        let code = 200;
        result = {username: userObject.username};
        mlDBController.update('MlRegistration', id, {"registrationInfo.userId": userId}, {$set: true}, context)
        /**Creating moolya request*/
        //mlRegistrationRepo.createRegistrationProxy(id, context);

        updatedResponse = new MlRespPayload().successPayload(result, code);
        //update transaction with operational area
        // var temp =mlDbController.find('MlRegistration',id,{"registrationInfo.userId": userId},context ).fetch()
        /**update transaction with operational area*/
        let transactionInfo = {
          cluster: details.clusterId,
          chapter: details.chapterId,
          requestId: details.transactionId
        }
        let resp = MlResolver.MlMutationResolver['updateRegistrationTransaction'](obj, {'transactionInfo': transactionInfo}, context, info);
        return updatedResponse;
      }


    } else {
      /**
       *Validate selected community of user
       *return the error if community is inactive
       */
      validationCheck = MlRegistrationPreCondition.validateActiveCommunity(id);
      if (validationCheck && !validationCheck.isValid) {
        return validationCheck.validationResponse;
      }
      /**Update the registration Details*/
      var aprvStatus=mlRegistrationRepo.updateStatus({},'REG_SOFT_APR');
      updatedResponse = mlDBController.update('MlRegistration', id, {registrationDetails: args.details,status:aprvStatus.status,statusDesc:aprvStatus.statusDesc}, {$set: true}, context);
      /**
       * Updating the User profile details(DateOfBirth an GenderType)
       * Check why user profile is updated here??. User may have multiple registrations
       */
      let email = registrationInfo.email
      var existingUser = mlDBController.findOne('users', {"username": email}, context)
      if (existingUser) {
        let dob = args && args.details && args.details.dateOfBirth ? moment(args.details.dateOfBirth).startOf("day").toDate() : null
        let gender = args && args.details && args.details.gender ? args.details.gender : null
        result = mlDBController.update('users', {username: email},
          {"profile.genderType": gender, "profile.dateOfBirth": dob}, {$set: true}, context)
      }

    }

    let code = 200;
    result = {id: id};
    updatedResponse = new MlRespPayload().successPayload(result, code);
    return updatedResponse;
  }
}

MlResolver.MlMutationResolver['updateRegistrationUploadedDocumentUrl'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args.docUrl && args.documentId && args.docTypeId) {
    var id = args.registrationId;
    var randomId = Math.floor(Math.random() * 90000) + 10000;

    let documentDetails = MlDocumentMapping.findOne(args.documentId)
    // let updatedResponse=MlRegistration.update({_id:args.registrationId,'kycDocuments':{$elemMatch: {'documentId':args.documentId,'docTypeId':args.docTypeId}}},{$push: {"kycDocuments.$.docFiles":{fileId:randomId,fileName:args.document.name, fileSize:args.document.size, fileUrl:args.docUrl}}});
    let updatedResponse = mlDBController.update('MlRegistration', {
      _id: args.registrationId,
      'kycDocuments': {$elemMatch: {'documentId': args.documentId, 'docTypeId': args.docTypeId}}
    }, {
      "kycDocuments.$.docFiles": {
        fileId: randomId,
        fileName: args.document.name,
        fileSize: args.document.size,
        fileUrl: args.docUrl
      }
    }, {$push: true}, context)
    if (updatedResponse) {
      let statusResponse = mlDBController.update('MlRegistration', {
        _id: args.registrationId,
        'kycDocuments': {$elemMatch: {'documentId': args.documentId, 'docTypeId': args.docTypeId}}
      }, {"kycDocuments.$.status": "Pending Verification"}, {$set: true}, context)
      if (statusResponse) {
        let allManditoryKYCuploaded;
        let registrationDetails = MlRegistration.findOne(args.registrationId)
        let registrationKYCDocs = registrationDetails && registrationDetails.kycDocuments && registrationDetails.kycDocuments.length ? registrationDetails.kycDocuments : []
        for(let i=0; i < registrationKYCDocs.length; i++){
          if (registrationKYCDocs[i] && registrationKYCDocs[i].isMandatory) {
            if (registrationKYCDocs[i] && registrationKYCDocs[i].docFiles && registrationKYCDocs[i].docFiles.length) {
              allManditoryKYCuploaded = true
            } else {
              allManditoryKYCuploaded = false
              break;
            }
          }
        }
        mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
        let updateRecord = {}
        if(allManditoryKYCuploaded){
          mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_U_PEND');
          let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
        }else if(!allManditoryKYCuploaded){
          mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_U_KOFF');
          let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
        }
        return updatedResponse;
      }
    }

  } else if (args.registrationId) {
    // MlRegistration.update({_id:args.registrationId},{ $set:{'registrationInfo.profileImage': args.docUrl}})
    mlDBController.update('MlRegistration', args.registrationId, {'registrationInfo.profileImage': args.docUrl},{$set: true}, context)
  }
}


MlResolver.MlMutationResolver['ApprovedStatusForUser'] = (obj, args, context, info) => {
  var updateRecord={};
  if (args.registrationId) {

    let temp = 0
    let registrationRecord = MlRegistration.findOne(args.registrationId)

    let addressDetails = registrationRecord && registrationRecord.addressInfo ? registrationRecord.addressInfo : []

    /**
     * Check whether registration contains address array
     */
    if (addressDetails && addressDetails.length < 1) {
      let code = 401;
      let response = new MlRespPayload().errorPayload("'Default Address' is mandatory", code);
      return response;
    } else if (addressDetails && addressDetails.length > 0) {
      /**
       * If registration contains address array
       * Check isDefault Address Exist or Not
       */
      var found = addressDetails.some(function (el) {
        return el.isDefaultAddress == true;
      });
      if (!found) {
        /**
         * If registration contains address array
         * If default address not found throw an error
         */
        let code = 401;
        let response = new MlRespPayload().errorPayload("'Default Address' is mandatory", code);
        return response;
      } else if (found) {
        /**
         * If registration contains address array
         * If default address exist
         * Check whether default address is active for single or multiple address
         */
        let addressData = _.filter(addressDetails, {'isDefaultAddress': true});
        if (addressData && addressData.length > 1) {
          let code = 401;
          let response = new MlRespPayload().errorPayload("Only one default address should exist", code);
          return response;
        }
      }
    }
    if (registrationRecord && registrationRecord.emails.length > 0) {
      let email = registrationRecord.emails;
      emailVerified = _.find(email, function (mail) {
        return mail.verified == true
      })
      if (emailVerified) {
        if (registrationRecord && registrationRecord.status != 'REG_USER_APR' && registrationRecord.status != 'REG_USER_REJ') {
          let kycDocuments = registrationRecord.kycDocuments&&registrationRecord.kycDocuments.length>0?registrationRecord.kycDocuments:[]
         if (kycDocuments && kycDocuments.length >= 1) {
            //mandatory doc exist or not
            mandatorykycDoc = kycDocuments.filter(function (item) {
              return item.isMandatory == true;
            });
            if (mandatorykycDoc.length >= 1) {
              //mandatory document should approved and upload
              kycDoc = mandatorykycDoc.filter(function (item) {
                return item.status == 'Approved' && item.docFiles.length >= 1 && item.isMandatory == true;
              });
              if (kycDoc && kycDoc.length == mandatorykycDoc.length) {
                //nonmandatory document exist should approved and upload
                nonMandatorykycDoc = kycDocuments.filter(function (item) {
                  return item.docFiles.length >= 1 && item.isMandatory == false;
                });
                if (nonMandatorykycDoc.length >= 1) {
                  status = nonMandatorykycDoc.filter(function (item) {
                    return item.status == 'Approved'
                  });
                  if (status && nonMandatorykycDoc.length == status.length) {
                    temp = 1;
                  }
                } else {
                  temp = 1;
                }
              }
            } else {
              nonMandatorykycDoc = kycDocuments.filter(function (item) {
                return item.docFiles.length >= 1 && item.isMandatory == false;
              });
              if (nonMandatorykycDoc.length >= 1) {
                status = nonMandatorykycDoc.filter(function (item) {
                  return item.status == 'Approved'
                });
                if (status && nonMandatorykycDoc.length == status.length) {
                  temp = 1;
                }
              }
            }

          }
        } else {
          let code = 555;
          const getRegStatus = registrationUserApprovalResponse(registrationRecord.status);
          let response = new MlRespPayload().errorPayload(getRegStatus, code);
          // let response = new MlRespPayload().errorPayload("User already approved", code);
          return response;
        }
      } else {
        let code = 556;
        let response = new MlRespPayload().errorPayload("Email verification not completed", code);
        return response;
      }
    }

    let updatedResponse;
    if (temp == 1) {
      // updatedResponse=MlRegistration.update({_id:args.registrationId},{$set: {"status":"Approved"}});
      //Update the Status
      mlRegistrationRepo.updateStatus(updateRecord,'REG_USER_APR');
      updatedResponse = mlDBController.update('MlRegistration', args.registrationId,updateRecord,{$set: true}, context)

    }

    if (updatedResponse === 1) {
      mlRegistrationRepo.updateExternalProfileInfo(args.registrationId, 'all', context);
      mlRegistrationRepo.ApproveExternalProfileInfo(args.registrationId, 'all', context)
    }

    //Portfolio Request Generation
    if (updatedResponse === 1) {
      // let regRecord = MlRegistration.findOne(args.registrationId)||{"registrationInfo":{}};
      let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
      let regRecord = mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context) || {"registrationInfo": {}};
      MlEmailNotification.onKYCApprove(regRecord);
      MlNotificationController.onUserApproval(regRecord);
      MlSMSNotification.sendSMSonKYCApproved(regRecord)
      // mlSmsController
      //creating payload for portfolio
      let portfolioDetails = mlRegistrationRepo.createPayloadForPortfolio(regRecord);
      orderNumberGenService.assignPortfolioId(portfolioDetails)

      let registrationData = regRecord.registrationDetails;
      registrationData.contactNumber = regRecord.registrationInfo.contactNumber;
      registrationData.emailId = regRecord.registrationInfo.userName;
      registrationData.industry = regRecord.registrationInfo.industry;
      registrationData.profession = regRecord.registrationInfo.profession;
      registrationData.userName = regRecord.registrationInfo.userName;
      registrationData.profileImage = regRecord.registrationInfo.profileImage;
      registrationData.investmentFrom = regRecord.registrationInfo.investmentFrom;
      registrationData.socialLinksInfo = regRecord.socialLinksInfo;
      registrationData.gender = regRecord.registrationDetails.gender;
      registrationData.employmentStatus = regRecord.registrationDetails.employmentStatus;
      try {
        const portRequest = MlResolver.MlMutationResolver['createPortfolioRequest'](obj, {
          'portfoliodetails': portfolioDetails,
          'registrationInfo': registrationData
        }, context, info); //portfolio request
        console.log("new portfolio request response..........", portRequest);
      } catch (e) {
        console.log(e);
        //send error response;
      }
    }
    if (updatedResponse === 1) {
      let code = 200;
      let result = {registrationId: updatedResponse}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    } else {
      let code = 401;
      let response = new MlRespPayload().errorPayload("Please validate the user details", code);
      return response;
    }
  }
}

/**
 * user rejection from registration
 * @Note: 1) making user profile [isActive && isApprove : false]
 *        2) registration status [rejected]
 * */
MlResolver.MlMutationResolver['RejectedStatusForUser'] = (obj, args, context, info) => {
  if (args.registrationId) {
    let isRejected = mlDBController.findOne('MlRegistration', {_id:args.registrationId, status:{'$in': ['REG_ADM_REJ', 'REG_USER_REJ']}}, context)
    var statusCode=args.regType==="1"?"REG_USER_REJ":"REG_ADM_REJ";
    var updateRecord={};
    //Update the Status
    mlRegistrationRepo.updateStatus(updateRecord,statusCode);
    if(!isRejected){
      let updatedResponse = mlDBController.update('MlRegistration', args.registrationId,updateRecord,{$set: true}, context)
      if (updatedResponse) {
        var resp = mlDBController.update('users', {
          'profile.isInternaluser': false,
          'profile.externalUserProfiles.registrationId': args.registrationId
        }, {
          "profile.externalUserProfiles.$.isApprove": false,
          "profile.externalUserProfiles.$.isActive": false
        }, {$set: true}, context);
        let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
        let user = mlDBController.findOne('MlRegistration', {_id:args.registrationId}, context)
        MlEmailNotification.UserRejectionByAdmin(user);
        let code = 200;
        let response = new MlRespPayload().successPayload("Registration rejected successfully", code);
        return response
      }
    }else {
      let code = 401;
      let response = new MlRespPayload().errorPayload("Registration already rejected", code);
      return response;
    }
  }
}

MlResolver.MlMutationResolver['ApprovedStatusOfDocuments'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    let documentList = args.documentId;
    let doctypeList = args.docTypeId
    let updatedResponse;
    let updateRecord = {}
    if (documentList.length > 0) {
      for (let i = 0; i < documentList.length; i++) {
        // updatedResponse=MlRegistration.update({_id:args.registrationId,'kycDocuments':{$elemMatch: {'documentId':documentList[i],'docTypeId':doctypeList[i]}}},{$set: {"kycDocuments.$.status":"Approved"}});
        let user = MlRegistration.findOne({_id: args.registrationId}) || {}
        let kyc = user.kycDocuments&&user.kycDocuments.length>0?user.kycDocuments:[]
        let kycDoc = _.find(kyc, function (item) {
          return item.documentId == documentList[i] && item.docTypeId == doctypeList[i];
        });
        if (kycDoc.docFiles && kycDoc.docFiles.length > 0) {
          let response = mlDBController.update('MlRegistration', {
            _id: args.registrationId,
            'kycDocuments': {$elemMatch: {'documentId': documentList[i], 'docTypeId': doctypeList[i]}}
          }, {"kycDocuments.$.status": "Approved"}, {$set: true}, context)
          if (response) {
           /*
            mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_APR');
            let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord, {$set: true}, context)
            */
            let allManditoryKYCuploaded;
            let registrationDetails = MlRegistration.findOne(args.registrationId)
            let registrationKYCDocs = registrationDetails && registrationDetails.kycDocuments && registrationDetails.kycDocuments.length ? registrationDetails.kycDocuments : []
            for(let i=0; i < registrationKYCDocs.length; i++){
              if (registrationKYCDocs[i] && registrationKYCDocs[i].isMandatory) {
                if (registrationKYCDocs[i]  && registrationKYCDocs[i].status == "Approved") {
                  allManditoryKYCuploaded = true
                }else if(registrationKYCDocs[i]  && registrationKYCDocs[i].status == "Rejected"){
                  allManditoryKYCuploaded = false
                  break;
                }
              }
            }
            let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
            let updateRecord = {}
            if(allManditoryKYCuploaded){
              mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_APR');
              let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
            }else if(!allManditoryKYCuploaded){
              mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_APR');
              let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
            }

            let code = 200;
            let result = {registrationId: response}

            updatedResponse = new MlRespPayload().successPayload(result, code);

          }
        } else {
          let code = 409;
          updatedResponse = new MlRespPayload().errorPayload("Please upload the mandatory KYC documents!");

        }
      }
    } else {
      let code = 409;
      updatedResponse = new MlRespPayload().errorPayload("Please select the KYC documents!");
    }
    if(updatedResponse && updatedResponse.success){
      let user = MlRegistration.findOne({_id: args.registrationId}) || {}
      MlNotificationController.onKYCApprove(user);
    }
    return updatedResponse;
  }
}
MlResolver.MlMutationResolver['RejectedStatusOfDocuments'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    let documentList = args.documentId;
    let doctypeList = args.docTypeId
    let updatedResponse;
    let updateRecord = {}
    if (documentList.length > 0) {
      for (let i = 0; i < documentList.length; i++) {
        // updatedResponse=MlRegistration.update({_id:args.registrationId,'kycDocuments':{$elemMatch: {'documentId':documentList[i],'docTypeId':doctypeList[i]}}},{$set: {"kycDocuments.$.status":"Approved"}});
        let user = MlRegistration.findOne({_id: args.registrationId})
        let kyc = user.kycDocuments
        let kycDoc = _.find(kyc, function (item) {
          return item.documentId == documentList[i] && item.docTypeId == doctypeList[i];
        });
        if (kycDoc.docFiles.length > 0) {
          let response = mlDBController.update('MlRegistration', {
            _id: args.registrationId,
            'kycDocuments': {$elemMatch: {'documentId': documentList[i], 'docTypeId': doctypeList[i]}}
          }, {"kycDocuments.$.status": "Rejected"}, {$set: true}, context)
          if (response) {
            let allManditoryKYCuploaded;
            let registrationDetails = MlRegistration.findOne(args.registrationId)
            let registrationKYCDocs = registrationDetails && registrationDetails.kycDocuments && registrationDetails.kycDocuments.length ? registrationDetails.kycDocuments : []
            for(let i=0; i < registrationKYCDocs.length; i++){
              if (registrationKYCDocs[i] && registrationKYCDocs[i].isMandatory) {
                if (registrationKYCDocs[i]  && registrationKYCDocs[i].status == "Approved") {
                  allManditoryKYCuploaded = true
                }else if(registrationKYCDocs[i]  && registrationKYCDocs[i].status == "Rejected"){
                  allManditoryKYCuploaded = false
                  break;
                }
              }
            }
            let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
            let updateRecord = {}
            if(allManditoryKYCuploaded){
              mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_REJ');
              let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
            }else if(!allManditoryKYCuploaded){
              mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_REJ');
              let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
            }
          /*
            mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_A_REJ');
            let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord, {$set: true}, context)
          */
            MlEmailNotification.onKYCDecline(user);
            MlNotificationController.onKYCDecline(user);
            MlSMSNotification.sendSMSonKYCDeclined(user)
            let code = 200;
            let result = {registrationId: response}
            updatedResponse = new MlRespPayload().successPayload(result, code);

          }
        } else {
          let code = 409;
          updatedResponse = new MlRespPayload().errorPayload("Please upload the mandatory KYC documents!");

        }
      }
    } else {
      let code = 409;
      updatedResponse = new MlRespPayload().errorPayload("Please select the KYC documents!");
    }

    return updatedResponse;
  }
}
MlResolver.MlMutationResolver['RemoveFileFromDocuments'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    let documentList = args.documentId;
    let updatedResponse;
    let user = MlRegistration.findOne({_id: args.registrationId})
    let kyc = user.kycDocuments
    let kycDoc = _.find(kyc, function (item) {
      return item.documentId == args.documentId && item.docTypeId == args.docTypeId;
    });
    if (kycDoc.docFiles.length > 0 && kycDoc.status != "Approved") {
      response = mlDBController.update('MlRegistration', {
        "$and": [{_id: args.registrationId}, {
          'kycDocuments': {
            $elemMatch: {
              'docTypeId': args.docTypeId,
              'documentId': args.documentId
            }
          }
        }]
      }, {'kycDocuments.$.docFiles': {'fileId': args.fileId}}, {$pull: true}, context)
      if (response) {
        //let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
        let registrationRecord = MlRegistration.findOne(args.registrationId);
        let kycDocuments = registrationRecord.kycDocuments
        if (kycDocuments && kycDocuments.length >= 1) {
          //if doc not available
          kycDoc = _.find(kycDocuments, function (item) {
            return item.docFiles.length < 1 && item.docTypeId == args.docTypeId && item.documentId == args.documentId;
          });
          if (kycDoc && kycDoc.docFiles.length < 1) {
            let statusResponse = mlDBController.update('MlRegistration', {
              _id: args.registrationId,
              'kycDocuments': {$elemMatch: {'documentId': args.documentId, 'docTypeId': args.docTypeId}}
            }, {"kycDocuments.$.status": "Awaiting upload"}, {$set: true}, context)
            if (statusResponse) {
              let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
              let code = 200;
              let result = {registrationId: response}
              updatedResponse = new MlRespPayload().successPayload(result, code);
            }
          }
        }


        let allManditoryKYCuploaded;
        let registrationDetails = MlRegistration.findOne(args.registrationId)
        let registrationKYCDocs = registrationDetails && registrationDetails.kycDocuments && registrationDetails.kycDocuments.length ? registrationDetails.kycDocuments : []
        for(let i=0; i < registrationKYCDocs.length; i++){
          if (registrationKYCDocs[i] && registrationKYCDocs[i].isMandatory) {
            if (registrationKYCDocs[i] && registrationKYCDocs[i].docFiles && registrationKYCDocs[i].docFiles.length) {
              allManditoryKYCuploaded = true
            } else{
              allManditoryKYCuploaded = false
              break;
            }
          }
        }
        let updateRecord = {}
        let existingStatus = registrationDetails&&registrationDetails.status?registrationDetails.status:"REG_KYC_U_KOFF"
        if(allManditoryKYCuploaded){
          mlRegistrationRepo.updateStatus(updateRecord,existingStatus);
          let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
        }else if(!allManditoryKYCuploaded){
          mlRegistrationRepo.updateStatus(updateRecord,'REG_KYC_U_KOFF');
          let updatedResponse = mlDBController.update('MlRegistration',args.registrationId,updateRecord,{$set: true}, context)
        }



        let code = 200;
        let result = {registrationId: response}
        updatedResponse = new MlRespPayload().successPayload(result, code);

      }

    }
    else {
      let code = 409;
      updatedResponse = new MlRespPayload().errorPayload("KYC Documents cannot be removed after approval");
    }
    //  updatedResponse=MlRegistration.update({_id:args.registrationId,'kycDocuments':{$elemMatch: {'documentId':args.documentId}},'kycDocuments':{$elemMatch: {'documentId.$.docFiles':{$elemMatch:{'fileId':args.fileId}}}}},{$pull: {}});
    // updatedResponse=MlRegistration.update({"$and":[{_id:args.registrationId},{'kycDocuments':{$elemMatch: {'docTypeId':args.docTypeId,'documentId':args.documentId}}}]},{ $pull: { 'kycDocuments.$.docFiles':{'fileId':args.fileId  }} });

    return updatedResponse;
  }
}


MlResolver.MlMutationResolver['createGeneralInfoInRegistration'] = (obj, args, context, info) => {

  let id = " "
  let registrationDetails = MlRegistration.findOne({_id: args.registrationId}) || {};
  var fut = new Future();
  if (args && args.registration) {
    if (args.type == "CONTACTTYPE") {
      let dbData = _.pluck(registrationDetails.contactInfo, 'numberType') || [];
      let contactExist = null;
      if (args.registration.contactInfo[0]) {
        contactExist = _.contains(dbData, args.registration.contactInfo[0].numberType);
      }

      if (contactExist) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Contact type' already exists!", code);
        return response;
      }

      if (registrationDetails.contactInfo) {
        // id = MlRegistration.update(
        //   { _id : args.registrationId },
        //   { $push: { 'contactInfo': args.registration.contactInfo[0] } }
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'contactInfo': args.registration.contactInfo[0]},{$push: true}, context)
      } else {
        // id = MlRegistration.update(
        //   { _id : args.registrationId },
        //   { $set: { 'contactInfo': args.registration.contactInfo } }
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'contactInfo': args.registration.contactInfo},{$set: true}, context)
      }
    } else if (args.type == "ADDRESSTYPE") {
      let dbData = _.pluck(registrationDetails.addressInfo, 'addressType') || [];
      let addressExist = null;
      if (args.registration.addressInfo[0]) {
        addressExist = _.contains(dbData, args.registration.addressInfo[0].addressType);
      }

      if (addressExist) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Address type' already exists!", code);
        return response;
      }
      if (registrationDetails.addressInfo) {
        // id = MlRegistration.update(
        //   { _id : args.registrationId },
        //   { $push: { 'addressInfo': args.registration.addressInfo[0] } }
        // )
        let city = args.registration.addressInfo[0].addressCity
        let area = args.registration.addressInfo[0].addressArea
        let locality = args.registration.addressInfo[0].addressLocality
        let pin = args.registration.addressInfo[0].addressPinCode
        geocoder.geocode(locality + "," + area + "," + city + "," + pin, Meteor.bindEnvironment(function (err, data) {
          if (err) {
            throw new Error("Invalid Locality selection " + e);
          }
          args.registration.addressInfo[0].latitude = data && data.results[0] && data.results[0].geometry && data.results[0].geometry.location && data.results[0].geometry.location.lat ? data.results[0].geometry.location.lat : null;
          args.registration.addressInfo[0].longitude = data && data.results[0] && data.results[0].geometry && data.results[0].geometry.location && data.results[0].geometry.location.lat ? data.results[0].geometry.location.lng : null;

          try {
            // let id = MlClusters.insert(cluster);
            let id = mlDBController.update('MlRegistration', args.registrationId, {'addressInfo': args.registration.addressInfo[0]},{$push: true}, context)
            if (id) {
              let code = 200;
              let result = {addressId: id}
              let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
              if (response) {
                fut.return(response);
              }
            }
          } catch (e) {
            throw new Error("Address updation failed " + e);
          }

        }), {key: Meteor.settings.private.googleApiKey});
        var addressData = fut.wait();
      } else {
        let city = args.registration.addressInfo[0].addressCity || "";
        let area = args.registration.addressInfo[0].addressArea || "";
        let locality = args.registration.addressInfo[0].addressLocality || "";
        let pin = args.registration.addressInfo[0].addressPinCode || "";
        geocoder.geocode(locality + "," + area + "," + city + "," + pin, Meteor.bindEnvironment(function (err, data) {
          if (err) {
            throw new Error("Invalid Locality selection " + e);
          }
          args.registration.addressInfo[0].latitude = data && data.results[0] && data.results[0].geometry && data.results[0].geometry.location && data.results[0].geometry.location.lat ? data.results[0].geometry.location.lat : null;
          args.registration.addressInfo[0].longitude = data && data.results[0] && data.results[0].geometry && data.results[0].geometry.location && data.results[0].geometry.location.lat ? data.results[0].geometry.location.lng : null;

          try {
            // let id = MlClusters.insert(cluster);
            let id = mlDBController.update('MlRegistration', args.registrationId, {'addressInfo': args.registration.addressInfo},{$set: true}, context)
            if (id) {
              let code = 200;
              let result = {addressId: id}
              let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
              if (response) {
                fut.return(response);
              }

            }
          } catch (e) {
            throw new Error("Error while updating address " + e);
          }
        }), {key: Meteor.settings.private.googleApiKey});

        var addressData = fut.wait();

      }
    } else if (args.type == "SOCIALLINKS") {
      let dbData = _.pluck(registrationDetails.socialLinksInfo, 'socialLinkType') || [];
      let addressExist = null;
      if (args.registration.socialLinksInfo[0]) {
        addressExist = _.contains(dbData, args.registration.socialLinksInfo[0].socialLinkType);
      }

      if (addressExist) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Social link' type already exists!", code);
        return response;
      }
      /*if(args.registration.addressInfo && args.registration.addressInfo[0]){*/
      if (registrationDetails.socialLinksInfo) {
        // id = MlRegistration.update(
        //   {_id: args.registrationId},
        //   {$push: {'socialLinksInfo': args.registration.socialLinksInfo[0]}}
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'socialLinksInfo': args.registration.socialLinksInfo[0]},{$push: true}, context)
      } else {
        // id = MlRegistration.update(
        //   {_id: args.registrationId},
        //   {$set: {'socialLinksInfo': args.registration.socialLinksInfo}}
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'socialLinksInfo': args.registration.socialLinksInfo},{$set: true}, context)
      }
    } else if (args.type == "EMAILTYPE") {
      /*if(args.registration.addressInfo && args.registration.addressInfo[0]){*/
      let dbData = _.pluck(registrationDetails.emailInfo, 'emailIdType') || [];
      let emailTypeExist = null;
      if (args.registration.emailInfo[0]) {
        emailTypeExist = _.contains(dbData, args.registration.emailInfo[0].emailIdType);
      }

      if (emailTypeExist) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Email type' already exists!", code);
        return response;
      }
      if (registrationDetails.emailInfo) {
        // id = MlRegistration.update(
        //   { _id : args.registrationId },
        //   { $push: { 'emailInfo': args.registration.emailInfo[0] } }
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'emailInfo': args.registration.emailInfo[0]},{$push: true}, context)
      } else {
        // id = MlRegistration.update(
        //   { _id : args.registrationId },
        //   { $set: { 'emailInfo': args.registration.emailInfo } }
        // )
        id = mlDBController.update('MlRegistration', args.registrationId, {'emailInfo': args.registration.emailInfo},{$set: true}, context)
      }

      /*}else{
       id = MlRegistrantion.insert({'addressInfo':args.registration.addressInfo});
       }*/
    }
    else if (args.type == "KYCDOCUMENT") {
      /*if(args.registration.addressInfo && args.registration.addressInfo[0]){*/
      let newKYCDocs = args.registration&&args.registration.kycDocuments?args.registration.kycDocuments:[];
      if (registrationDetails.kycDocuments) {
        let existisngKYCDocs  = registrationDetails&&registrationDetails.kycDocuments&&registrationDetails.kycDocuments.length>0?registrationDetails.kycDocuments:[]
        let registrationKYCUpdatedDocs = []
        _.map(existisngKYCDocs, function(arr2obj) {
           _.find(newKYCDocs, function (arr1obj) {
            if(arr1obj["kycCategoryId"] === arr2obj["kycCategoryId"]){
              if(arr2obj && arr2obj.docFiles && arr2obj.docFiles .length>0){
                registrationKYCUpdatedDocs.push(arr2obj)
              }else if(arr2obj && _.isEmpty(arr2obj.docFiles)){
                registrationKYCUpdatedDocs.push(arr1obj)
              }

            }

          });
        })
        registrationKYCUpdatedDocs = _lodash.uniqBy(registrationKYCUpdatedDocs, function(elem) { return [elem.docTypeId, elem.documentId].join(); }); //to remove if there are any duplicate documents
        if(registrationKYCUpdatedDocs&&registrationKYCUpdatedDocs.length>0){
          id = mlDBController.update('MlRegistration', {
            _id: args.registrationId,
            kycDocuments: {$exists: true}
          }, {'kycDocuments': registrationKYCUpdatedDocs},{$set: true}, context)
        }

      } else {
        // id = MlRegistration.update(
        //   { _id : args.registrationId,kycDocuments:{ $exists:false }},
        //   { $set: { 'kycDocuments': args.registration.kycDocuments } }
        // )
        if(newKYCDocs&&newKYCDocs.length>0){
          id = mlDBController.update('MlRegistration', {
            _id: args.registrationId,
            kycDocuments: {$exists: false}
          }, {'kycDocuments': args.registration.kycDocuments},{$set: true}, context)
        }

      }
    }
    mlRegistrationRepo.updateExternalProfileInfo(args.registrationId, 'all', context);
  }

  if (id) {
    let code = 200;
    //let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
    let insertedData = MlRegistration.findOne(id) || {};
    /*  let tabName = insertedData.contactInfo[0].numberTypeName;*/
    let result = {registrationId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}
MlResolver.MlQueryResolver['findRegistration'] = (obj, args, context, info) => {
  // let resp = MlRegistration.findOne({_id: args.registrationId});
  let resp = mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context)
  return resp;

}

MlResolver.MlMutationResolver['updateRegistrationGeneralInfo'] = (obj, args, context, info) => {
  let id = " "
  // let registrationDetails =MlRegistration.findOne({_id: args.registrationId}) || {};
  let registrationDetails = mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context) || {};
  if (args && args.registration) {
    if (args.type == "CONTACTTYPE") {
      // id = MlRegistration.update(
      //   { _id : args.registrationId },
      //   { $set: { 'contactInfo': args.registration.contactInfo } }
      // )
      id = mlDBController.update('MlRegistration', args.registrationId, {'contactInfo': args.registration.contactInfo},{$set: true}, context)
    } else if (args.type == "ADDRESSTYPE") {
      // id = MlRegistration.update(
      //   { _id : args.registrationId },
      //   { $set: { 'addressInfo': args.registration.addressInfo } }
      // )
      id = mlDBController.update('MlRegistration', args.registrationId, {'addressInfo': args.registration.addressInfo},{$set: true}, context)
    } else if (args.type == "SOCIALLINKS") {
      // id = MlRegistration.update(
      //   { _id : args.registrationId },
      //   { $set: { 'socialLinksInfo': args.registration.socialLinksInfo } }
      // )
      id = mlDBController.update('MlRegistration', args.registrationId, {'socialLinksInfo': args.registration.socialLinksInfo},{$set: true}, context)
    } else if (args.type == "EMAILTYPE") {
      // id = MlRegistration.update(
      //   { _id : args.registrationId },
      //   { $set: { 'emailInfo': args.registration.emailInfo } }
      // )
      id = mlDBController.update('MlRegistration', args.registrationId, {'emailInfo': args.registration.emailInfo},{$set: true}, context)
    }
    mlRegistrationRepo.updateExternalProfileInfo(args.registrationId, 'all', context);
  }

  if (id) {
    let code = 200;
    //let updateDocument = mlDBController.update('MlRegistration', args.registrationId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
    let insertedData = MlRegistration.findOne(id) || {};
    let result = {registrationId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }


}


MlResolver.MlMutationResolver['sendSmsVerificationForRegistration'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    // let regDetails=mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context) || null;
    // const userId=regDetails&&regDetails.registrationInfo&&regDetails.registrationInfo.userId?regDetails.registrationInfo.userId:null;
    // if ( userId ) {
    let result = MlResolver.MlMutationResolver['sendSmsVerification'](obj, {registrationId: args.registrationId}, context, info);
    //return result;
    if (result) {
      let code = 200;
      let result = {registrationId: args.registrationId}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
    //  }else{
    //Error- unable to find User
    //  }
  }
}


MlResolver.MlMutationResolver['sendEmailVerificationForRegistration'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    //let regDetails=mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context) || null;
    // const userId=regDetails&&regDetails.registrationInfo&&regDetails.registrationInfo.userId?regDetails.registrationInfo.userId:null;
    //if ( userId ) {
    let result = MlResolver.MlMutationResolver['sendEmailVerification'](obj, {registrationId: args.registrationId}, context, info);
    if (result) {
      let code = 200;
      let result = {registrationId: args.registrationId}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }

    // }else{
    //Error- unable to find User
    // }
  }
}

MlResolver.MlMutationResolver['sendEmailVerification'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    return MlAccounts.sendVerificationEmail(args.registrationId, {
      emailContentType: "html",
      subject: "Email Verification",
      context: context
    });
  }
}


MlResolver.MlMutationResolver['sendSmsVerification'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.registrationId) {
    return MlAccounts.sendVerificationSmsOtp(args.registrationId);
  }
}

MlResolver.MlMutationResolver['sendUserSmsVerification'] = (obj, args, context, info) => {
  // TODO : Authorization
    return MlAccounts.sendUserVerificationSmsOtp(context.userId);
}

MlResolver.MlMutationResolver['resendUserSmsVerification'] = (obj, args, context, info) => {
  // TODO : Authorization
    var resp = MlAccounts.resendUserVerificationSmsOtp(context.userId);
    if(resp && resp.otp){
      return {mobileNumber:resp.mobileNumber, success: true,reason:"Successfully resend OTP", code:200};
    }else{
      return {mobileNumber:resp.mobileNumber, error: true,reason:"Resend OTP failed", code:403};
    }

}

MlResolver.MlMutationResolver['verifyUserMobileNumber'] = (obj, args, context, info) => {
  // TODO : Authorization
  var user = mlDBController.findOne('users', {_id: context.userId}, context) || {};
  if(user.profile){
    if(user.profile && user.profile.externalUserProfiles && user.profile.externalUserProfiles.length>0){
      var externalProfile = _.find(user.profile.externalUserProfiles, {isDefault:true});
      if(!externalProfile){
        externalProfile = user.profile.externalUserProfiles[0]
      }
    }
    var mobileNumber = externalProfile.mobileNumber
  }

  if (mobileNumber && args.otp) {
    const result = MlAccounts.verifyUserMobileNumberOtp(context.userId, args.otp);
    if (result && result.error) {
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {
      let succResp = {mobileNumber: mobileNumber, mobileNumberVerified: true};
      return new MlRespPayload().successPayload(succResp, 200);
    }
  } else {
    return new MlRespPayload().errorPayload("Mobile Number and OTP are mandatory", 403);
  }
}

MlResolver.MlMutationResolver['resendSmsVerification'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.mobileNumber) {
    var resp = MlAccounts.resendVerificationSmsOtp(args.mobileNumber);
    if(resp && resp.otp){
      return {mobileNumber:resp.mobileNumber, success: true,reason:"OTP resent successfully", code:200};
    }else{
      return {mobileNumber:resp.mobileNumber, error: true,reason:"OTP could not be resent. Please check the mobile number or try after 30 seconds.", code:403};
    }
  }
}
MlResolver.MlMutationResolver['verifyLaterUserMobileNumber'] = (obj, args, context, info) => {
  // TODO : Authorization
    return MlAccounts.verifyLaterUserMobileNumber(args.mobileNumber);
}


/*MlResolver.MlMutationResolver['verifyEmail'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.token) {
    let updateRecord = {}
    const result = MlAccounts.verifyEmail(args.token);
    if (result && result.error) {
      let code = 403;
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {

      let code = 200;
      //check for mobile verification
      var mobileNumber = null;
      var recordId = result.recordId;
      mlRegistrationRepo.updateStatus(updateRecord,'REG_EMAIL_V');
      let updatedResponse = mlDBController.update('MlRegistration',recordId,updateRecord, {$set: true}, context)
      //requirement by venu
      if (recordId) {
        var reg = mlDBController.findOne('MlRegistration', {'_id': recordId}, context);
        if (reg && reg.registrationInfo && reg.registrationInfo.contactNumber) {
          mobileNumber = reg.registrationInfo.contactNumber;
          try {
            MlResolver.MlMutationResolver['sendSmsVerification'](obj, {registrationId: recordId}, context, info);
          } catch (e) {
            console.log(e);
          }
        }
      }
      let succResp = {
        email: result.email,
        emailVerified: true,
        mobileNumber: mobileNumber,
        mobileNumberVerified: false
      };
      let response = new MlRespPayload().successPayload(succResp, code);
      return response;
    }
  }
}*/

MlResolver.MlMutationResolver['verifyMobileNumber'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.mobileNumber && args.otp) {
    var otp = args.otp?Number(args.otp):null;
    const result = MlAccounts.verifyMobileNumberOtp(args.mobileNumber,otp);
    if (result && result.error) {
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {
      let succResp = {mobileNumber: args.mobileNumber, mobileNumberVerified: true};
      return new MlRespPayload().successPayload(succResp, 200);
    }
  } else {
    return new MlRespPayload().errorPayload("Mobile Number and OTP are mandatory", 403);
  }
}

MlResolver.MlQueryResolver['fetchContextClusters'] = (obj, args, context, info) => {
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let user = Meteor.users.findOne({_id: context.userId});
  let roleIds = [];
  let hirarichyLevel = userProfile.hierarchyLevel;
  let userProfiles = user && user.profile.InternalUprofile.moolyaProfile.userProfiles ? user.profile.InternalUprofile.moolyaProfile.userProfiles : [];
  let listData = [];
  let clusterIds = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : [];
  let chapterIds = userProfile && userProfile.defaultChapters ? userProfile.defaultChapters : [];
  let subChapterIds = userProfile && userProfile.defaultSubChapters ? userProfile.defaultSubChapters : [];
  let result = null;
  if (hirarichyLevel == 4) {
    result = mlDBController.find('MlClusters', {isActive: true}, context, {
      sort: {
        clusterName: 1,
        displayName: 1
      }
    }).fetch()
  } else {
    result = mlDBController.find('MlClusters', {_id: clusterIds, isActive: true}, context, {
      sort: {
        clusterName: 1,
        displayName: 1
      }
    }).fetch()
  }
  let code = 200;
  let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
  return result
}

MlResolver.MlQueryResolver['fetchContextChapters'] = (obj, args, context, info) => {

  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let user = Meteor.users.findOne({_id: context.userId});
  let roleIds = [];
  let hirarichyLevel = userProfile.hierarchyLevel;
  let userProfiles = user && user.profile.InternalUprofile.moolyaProfile.userProfiles ? user.profile.InternalUprofile.moolyaProfile.userProfiles : [];
  let listData = [];
  let clusterIds = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : [];
  let chapterIds = userProfile && userProfile.defaultChapters ? userProfile.defaultChapters : [];
  let subChapterIds = userProfile && userProfile.defaultSubChapters ? userProfile.defaultSubChapters : [];
  let result = null;
  if (hirarichyLevel == 4) {
    result = mlDBController.find('MlChapters', {clusterId: args.id, isActive: true}, context, {
      sort: {
        chapterName: 1,
        displayName: 1
      }
    }).fetch()
  } else {
    if (chapterIds[0] == "all") {
      result = mlDBController.find('MlChapters', {clusterId: args.id, isActive: true}, context, {
        sort: {
          chapterName: 1,
          displayName: 1
        }
      }).fetch()
    } else {
      result = mlDBController.find('MlChapters', {
        _id: {$in: chapterIds},
        isActive: true
      }, context, {sort: {chapterName: 1, displayName: 1}}).fetch()
    }

  }
  let code = 200;
  let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
  return result
}

MlResolver.MlQueryResolver['fetchContextSubChapters'] = (obj, args, context, info) => {

  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let user = Meteor.users.findOne({_id: context.userId});
  let roleIds = [];
  let hirarichyLevel = userProfile.hierarchyLevel;
  let userProfiles = user && user.profile.InternalUprofile.moolyaProfile.userProfiles ? user.profile.InternalUprofile.moolyaProfile.userProfiles : [];
  let listData = [];
  let clusterIds = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : [];
  let chapterIds = userProfile && userProfile.defaultChapters ? userProfile.defaultChapters : [];
  let subChapterIds = userProfile && userProfile.defaultSubChapters ? userProfile.defaultSubChapters : [];

  var index = 0;
  if(args.id && chapterIds && chapterIds.length){
    index = chapterIds.lastIndexOf(args.id);
    index = index>0?index:0;
  }

  let result = null;
  if (hirarichyLevel == 4) {
    result = mlDBController.find('MlSubChapters', {
      chapterId: args.id,
      isActive: true
    }, context, {sort: {subChapterName: 1, subChapterDisplayName: 1}}).fetch()
  } else {
    if (subChapterIds[index] == "all") {
      result = mlDBController.find('MlSubChapters', {
        chapterId: args.id,
        isActive: true
      }, context, {sort: {chapterName: 1, displayName: 1}}).fetch()
    } else {
      result = mlDBController.find('MlSubChapters', {
        _id: {$in: subChapterIds},
        isActive: true
      }, context, {sort: {subChapterName: 1, subChapterDisplayName: 1}}).fetch()
    }
  }
  let code = 200;
  let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
  return result
}

MlResolver.MlMutationResolver['forgotPassword'] = (obj, args, context, info) => {
  console.log(args);
  if (args.email) {
    const result = MlAccounts.sendForgotPasswordEamil(args.email, context);
    if (result && result.error) {
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {
      return new MlRespPayload().successPayload(result.reason, 200);
    }
  } else {
    return new MlRespPayload().errorPayload("Email-Id is mandatory", 403);
  }
}

MlResolver.MlMutationResolver['resetPasswords'] = (obj, args, context, info) => {
  if (args.password && args.token) {
    const result = MlAccounts.resetPasswordWithToken(args.token, args.password, context);
    if (result && result.error) {
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {
      return new MlRespPayload().successPayload(result.reason, 200);
    }
  } else {
    return new MlRespPayload().errorPayload("Password reset link has expired or has already been used", 403);
  }
}

MlResolver.MlMutationResolver['verifyEmail'] = (obj, args, context, info) => {
  if (args.token) {
    var updateRecord={};
    let user = mlDBController.findOne('users', {"profile.email": 'systemadmin@moolya.global'}, context) || {};
    context.userId = user._id;context.url=Meteor.absoluteUrl("");context.browser="server";
    var result = MlAccounts.verifyEmail(args.token, context);
    if (result && result.error) {
      let response = new MlRespPayload().errorPayload(result.reason || "", result.code);
      return response;
    } else {
      //update the registration status on success.
      var recordId = result.recordId;
      mlRegistrationRepo.updateStatus(updateRecord,'REG_EMAIL_V');
      let id = mlDBController.update('MlRegistration',recordId,updateRecord,{$set: true}, context);
      if(id){
        mlDBController.update('MlRegistration',recordId,{'registrationInfo.transactionUpdatedDate': new Date()},{$set: true}, context)
      }
      //MlRegistration.update({_id:recordId},{$set: updateRecord});

      return new MlRespPayload().successPayload(result, 200);
    }
  } else {
    return new MlRespPayload().errorPayload("Email-Id verification link has expired or has already been used", 403);
  }
}

MlResolver.MlMutationResolver['createKYCDocument'] = (obj, args, context, info) => {

  let kycDocumentObject = {}
  let documentDetails;
  let kycCategoryDetails;
  let docTypeDetails;
  if (args.documentID) {
    documentDetails = MlDocumentMapping.findOne({"_id": args.documentID}) || {};
  } else {
    return
  }
  kycDocumentObject.documentId = args.documentID ? args.documentID : "";
  kycDocumentObject.documentDisplayName = documentDetails.documentDisplayName ? documentDetails.documentDisplayName : "";

  kycDocumentObject.documentName = documentDetails.documentName ? documentDetails.documentName : "";
  kycDocumentObject.allowableMaxSize = documentDetails.allowableMaxSize ? documentDetails.allowableMaxSize : "";
  kycDocumentObject.allowableFormat = []
  if (documentDetails.allowableFormat) {
    let documentFormat = MlDocumentFormats.find({"_id": {$in: documentDetails.allowableFormat}}).fetch();
    let documentFormatArray = _.pluck(documentFormat, 'docFormatName') || [];
    if (documentFormatArray) {
      let allowableFormatArray = documentFormatArray.join();
      kycDocumentObject.allowableFormat.push(allowableFormatArray);
    }

  }
  if (args.kycDocID) {
    kycCategoryDetails = MlDocumentCategories.findOne({"_id": args.kycDocID}) || {};
  }
  if (args.docTypeID) {
    docTypeDetails = MlDocumentTypes.findOne({"_id": args.docTypeID}) || {};
  }
  kycDocumentObject.kycCategoryId = kycCategoryDetails._id ? kycCategoryDetails._id : "";
  kycDocumentObject.kycCategoryName = kycCategoryDetails.docCategoryDisplayName ? kycCategoryDetails.docCategoryDisplayName : "";
  kycDocumentObject.docTypeId = docTypeDetails._id ? docTypeDetails._id : "";
  kycDocumentObject.docTypeName = docTypeDetails.docTypeDisplayName ? docTypeDetails.docTypeDisplayName : "";
  kycDocumentObject.isActive = true
  kycDocumentObject.isMandatory = false
  kycDocumentObject.status = "Awaiting upload"
  kycDocumentObject.docFiles = [];

  let id;
  let registrationDetails;

  let sameKYCEXist =  MlRegistration.findOne({"_id": args.registrationId,"kycDocuments.documentId" : kycDocumentObject.documentId });

  if(sameKYCEXist){
    return new MlRespPayload().errorPayload("KYC document already exists", 403);
  }
  if (args.registrationId) {
    registrationDetails = MlRegistration.findOne({"_id": args.registrationId});
  }
  if (registrationDetails.kycDocuments) {
    // id = MlRegistration.update(
    //   { _id : args.registrationId,kycDocuments:{ $exists:false } },
    //   { $push: { 'kycDocuments': args.registration.kycDocuments } }
    // )
    id = mlDBController.update('MlRegistration', {
      _id: args.registrationId,
      kycDocuments: {$exists: true}
    }, {'kycDocuments': kycDocumentObject},{$push: true}, context)
  } else {
    // id = MlRegistration.update(
    //   { _id : args.registrationId,kycDocuments:{ $exists:false }},
    //   { $set: { 'kycDocuments': args.registration.kycDocuments } }
    // )
    id = mlDBController.update('MlRegistration', {
      _id: args.registrationId,
      kycDocuments: {$exists: false}
    }, {'kycDocuments': kycDocumentObject},{$push: true}, context)
  }
  if (id) {
    return new MlRespPayload().successPayload("KYC document created successfully", 200);
  } else {
    return new MlRespPayload().errorPayload("Please enter all mandatory fields", 403);
  }
}

MlResolver.MlQueryResolver['findUserPendingRegistration'] = (obj, args, context, info) => {
  let user = mlDBController.findOne('users', {_id: context.userId}, context) || {}
  let resp = mlDBController.find('MlRegistration', {
      'registrationInfo.userName': user.username,
      "registrationInfo.communityDefCode": {$ne: "BRW"},
      status: {$nin: ['REG_USER_APR', 'REG_ADM_REJ', 'REG_USER_REJ']}
    }, context).fetch() || []
  return resp;
}

/**
 * @module [users left nav] for fetching about
 * getting user registration
 * */
MlResolver.MlQueryResolver['findRegistrationInfoUser'] = (obj, args, context, info) => {
  if (args.registrationId) {
    var id = args.registrationId;
    let response = MlRegistration.findOne({_id: id}) || {}
    let userId = response.registrationInfo && response.registrationInfo.userId ? response.registrationInfo.userId : ''
    var users = ''
    if(userId){
      users = mlDBController.findOne('users', userId, context)
      response.externalUserProfiles = users.profile.externalUserProfiles;
      response.isActive = users.profile.isActive;
      response.isShowOnMap = users.profile.isShowOnMap;
      response.userProfileImage = users.profile.profileImage;
    }
    return response;
  }
}

//*****************************************************<function start>********************************************************************/
headerCommunityDisplay = (registrationInfo, context) => {
  var subChapter = mlDBController.findOne('MlSubChapters', {_id: registrationInfo.subChapterId}) || {}
  var isMoolya = subChapter.isDefaultSubChapter
  var subChapterName = registrationInfo.subChapterName
  var chapterName = registrationInfo.chapterName
  var communityDefCode = registrationInfo.communityDefCode
  if (subChapterName && subChapterName.length > 12)
    subChapterName = subChapterName.substr(0, 12) + '...'
  chapterName = chapterName.substr(0, 4)
  var returnName = registrationInfo.communityName
  if (!isMoolya)
    returnName = subChapterName + '/' + chapterName + '/' + registrationInfo.communityName
  return returnName
};

registrationUserApprovalResponse = (status) => {
  let response = "User is already approved by admin";
  if (status === "REG_USER_APR")
    response = "User is already approved by admin";
  else if (status === "REG_USER_REJ")
    response = "Rejected user cannot be approved";
  return response
};

var setUserAgentForRegistration = (regObj,userAgent,ip)=>{
  if(regObj){
    regObj.source=(userAgent||{}).osName;
    regObj.deviceName=(userAgent||{}).deviceName;
    regObj.deviceNumber=(userAgent||{}).deviceVersion;
    regObj.ipAddress=ip;
    regObj.ipLocation=null;
  }
  return regObj;
}
//*****************************************************<function end>********************************************************************/