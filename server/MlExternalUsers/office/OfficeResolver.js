/**
 * Created by venkatsrinag on 11/5/17.
 */

import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";
import MlUserContext from "../../MlExternalUsers/mlUserContext";
import mlOfficeValidationRepo from "./officeRepo";
import passwordUtil from "../../commons/passwordUtil";
import _ from "lodash";
import MlEmailNotification from "../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from '../../mlNotifications/mlAlertNotifications/mlAlertNotification';
import mlOfficeInteractionService from './mlOfficeInteractionRepo'
import MlAccounts from '../../commons/mlAccounts';
import MlSMSNotification from '../../mlNotifications/mlSmsNotifications/mlSMSNotification'
import MlNotificationController from '../../mlNotifications/mlAppNotifications/mlNotificationsController';


let request = require('request');
var base64 = require('base64-min');
let Future = Npm.require('fibers/future');
let CryptoJS = require("crypto-js");
MlResolver.MlQueryResolver['fetchOffice'] = (obj, args, context, info) => {
  let officeSC = [];
  let profileId = args.profileId;
  let profile;
  if (context.userId) {
    let query = {
      userId: context.userId,
      isActive:true
    };
    if(profileId){
      query.profileId = profileId;
    } else {
      profile = new MlUserContext(context.userId).userProfileDetails(context.userId);
    }

    if(profile && profile.communityDefCode === "OFB"){
      let pipeline = [
        { "$lookup": { from: "mlOfficeMembers", localField: "_id", foreignField: "officeId", as: "officeMembers" } },
        { "$unwind": "$officeMembers" },
        { "$match" : { "officeMembers.userId": context.userId, "officeMembers.profileId": profile.profileId } }
      ];
      officeSC = mlDBController.aggregate('MlOffice', pipeline );
    } else {
      officeSC = mlDBController.find('MlOffice', query ).fetch();
    }
    return officeSC
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Not a valid user", code);
    return response;
  }
}

/**
 * @Note: {"isActive:true"} removed from query having effect on "MOOLYA-2024"
 * */
MlResolver.MlQueryResolver['fetchOfficeSC'] = (obj, args, context, info) => {
  let officeSC = [];
  var query = null;
  if (context.userId) {
    var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
    const isFetchOffice = getOfficeFetchPreCondition(defaultProfile);
    if (isFetchOffice && isFetchOffice.isRemoveOFB){
      query = {userId: context.userId, profileId:defaultProfile.profileId, isActive:true,  registrationId: { $ne: isFetchOffice.registrationId  }}
    }else {
      query = {userId: context.userId, profileId:defaultProfile.profileId, isActive:true};
    }
    let myOffices = mlDBController.find('MlOfficeMembers', query).fetch().map(function (data) {
      return data.officeId;
    });
    let officeQuery= {
      $or: [
        {
          officeId: {
            $in: myOffices
          }
        },
        {
          userId: context.userId,
          profileId:defaultProfile.profileId
        }
      ]
      // isActive:true
    };
    officeSC = mlDBController.find('MlOfficeSC', officeQuery).fetch();

    let extProfile = new MlUserContext(context.userId).userProfileDetails(context.userId)
    let regData = mlDBController.findOne('MlRegistration', {'registrationInfo.communityDefCode': extProfile.communityDefCode,'registrationInfo.userId':context.userId, status:'REG_USER_APR'})
    if(regData){
      if(!_.isEmpty(officeSC)){  //if office is there and reg approved
        var newArr = _.map(officeSC, function(element) {
          if(element.officeId){
            let officeName= mlDBController.findOne('MlOffice', {_id: element.officeId}).officeName;
            return _.extend({}, element, {isRegistrationApproved: true,officeName: officeName});
          }
        });
        return newArr
      }else{          //if no office and registration is approved
        return [{isRegistrationApproved: true}]
      }

    }else {
      return [{isRegistrationApproved: false}]
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Not a valid user", code);
    return response;
  }
}

MlResolver.MlQueryResolver['fetchOfficeById'] = (obj, args, context, info) => {
  let myOffice = [];
  if (context.userId) {
    myOffice = mlDBController.findOne('MlOffice', {_id:args.officeId})
    return myOffice
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Not a valid user", code);
    return response;
  }
};

MlResolver.MlQueryResolver['fetchOfficeSCById'] = (obj, args, context, info) => {
  let myOffice = [];
  if (context.userId) {
    myOffice = mlDBController.findOne('MlOfficeSC', {officeId:args.officeId});
    return myOffice
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Not a valid user", code);
    return response;
  }
};

MlResolver.MlQueryResolver['fetchOfficeMembers'] = (obj, args, context, info) => {
  let query = {
    officeId:args.officeId,
    isPrincipal: args.isPrincipal
  };
  let pipeline = [
    { $match: query },
    { $lookup:
      {
        from: "users",
        localField: "emailId",
        foreignField: "username",
        as: "user"
      }
    },
    { $unwind:{ path: "$user", preserveNullAndEmptyArrays: true } },
    {  $addFields : { profileImage: '$user.profile.profileImage' } }
  ];
  let response = mlDBController.aggregate('MlOfficeMembers', pipeline);
  //let response = mlDBController.find('MlOfficeMembers', query).fetch();
  return response;
}

MlResolver.MlQueryResolver['fetchAllOfficeMembersWithUserId'] = (obj, args, context, info) => {
  let pipeline = [
    // { $match: { userId: context.userId } },
    { $match: { isFreeze: { "$ne": true }, isRetire: { "$ne": true } } },
    { $lookup: { from: "mlOffice", localField: "officeId", foreignField: "_id", as: "office" } },
    { $unwind: "$office" },
    { $match: { 'office.userId': context.userId } },
    { $lookup:
      {
        from: "users",
        localField: "emailId",
        foreignField: "username",
        as: "user"
      }
    },
    { $unwind:"$user"},
    { $match: { 'user.profile.isActive':true } },
    { $project: {name:1, profileId:1, userId: '$user._id' , profileImage:'$user.profile.profileImage', officeName: "$office.officeName"} }
  ];
  let response = mlDBController.aggregate('MlOfficeMembers', pipeline);
  if(!response || !response.length ) {
    let userId = context.userId;
    let profile = new MlUserContext(userId).userProfileDetails(userId)
    if(profile){
      response = [{
        name: profile.firstName + " " + profile.lastName,
        userId: userId,
        profileImage: profile.profileImage,
        profileId: profile.profileId,
        officeName: ''
      }];
    }

  }
  return response;
}

MlResolver.MlQueryResolver['fetchOfficeMember'] = (obj, args, context, info) => {

  let pipeline = [
    {
      $match : {
        _id:args.memberId
      }
    },
    {
      $lookup:
        {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users"
        }
    },
    {
      $unwind : {
        "path": "$users",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $project: {
        userId: "$userId",
        firstName: "$firstName",
        lastName: "$lastName",
        mobileNumber: "$mobileNumber",
        emailId: "$emailId",
        userType: "$userType",
        description: "$description",
        name: "$name",
        joiningDate: "$joiningDate",
        role: "$role",
        isActive: "$isActive",
        isIndependent: "$isIndependent",
        isInternalUserInteraction: "$isInternalUserInteraction",
        isExternalUserInteraction: "$isExternalUserInteraction",
        isFreeze: "$isFreeze",
        isRetire: "$isRetire",
        communityType: "$communityType",
        isPrincipal: "$isPrincipal",
        isFreeUser: "$isFreeUser",
        isPaidUser: "$isPaidUser",
        isAdminUser: "$isAdminUser",
        profileImage: "$users.profile.profileImage"
      }
    }
  ]

  // let query = {
  //   _id:args.memberId
  // };
  // let response = mlDBController.findOne('MlOfficeMembers', query);
  let response = mlDBController.aggregate('MlOfficeMembers', pipeline);
  response = response.length ? response[0] : [];
  return response;
}

MlResolver.MlMutationResolver['createOffice'] = (obj, args, context, info) => {
  let officeId = '';
  try {
    let userId = context.userId;
    let scDefId = "";
    let frequencyType = "";
    let scId = "";
    let officeDetails = args.myOffice;
    let profile = new MlUserContext(userId).userProfileDetails(userId);
    // let isFunder = _.isMatch(profile, {communityDefCode: 'FUN'})
    const isAllowedCommunity = ["CMP", 'FUN', "INS", "STU", "SPS"].indexOf(profile.communityDefCode) >= 0 ? true : false;
    if(isAllowedCommunity){
      // office beSpoke Service Card Definition
      if(officeDetails.isBeSpoke){
        var ret = mlOfficeValidationRepo.createBspokeSCDef(officeDetails, profile, context);
        scDefId = ret.officeDefId;
        frequencyType = ret.frequencyType;
      }
      else{
        // search for office id from MLOfficeSCDef
      }

      // office record creation
      officeId = mlOfficeValidationRepo.createOffice(officeDetails, profile, context);
      if (!officeId) {
        let code = 400;
        let response = new MlRespPayload().errorPayload("Failed to create office", code);
        return response;
      }

      let officeMemberData = {
        officeId: officeId,
        profileId: profile.profileId,
        userId: userId,
        isFreeUser:false,
        isPaidUser: false,
        isAdminUser: true,
        mobileNumber:profile.mobileNumber,
        joiningDate: new Date(),
        firstName: profile.firstName,
        lastName: profile.lastName,
        name: profile.firstName + ' ' + profile.lastName,
        emailId: profile.email,
        isPrincipal: true,
        isActive: true
      };

      let ret = mlDBController.insert('MlOfficeMembers', officeMemberData, context)
      mlOfficeInteractionService.createTransactionRequest(context.userId, 'principal', officeMemberData.officeId, ret, context.userId, 'user', context);
      // office Transaction record creation
      let details = {
        officeId: officeId,
        transactionType:'officeRequest',
        status: 'Pending',
        duration:{
          years:1
        }
      }
       if(ret){
         MlEmailNotification.newOfficeRequestSent(context);
         MlSMSNotification.newOfficeRequestSent(context);
         MlNotificationController.onNewOfficeRequest(context)
       }
      let extendObj = _.pick(profile, ['clusterId', 'clusterName', 'chapterId', 'chapterName', 'subChapterId', 'subChapterName', 'communityId', 'communityName','communityCode']);
      let officeTransaction = _.extend(details, extendObj)
      //Added CommunityCode -MOOLYA-2279
      officeTransaction.communityCode=profile.communityDefCode;
      MlResolver.MlMutationResolver['createOfficeTransaction'](obj, {officeTransaction}, context, info)
      scId = mlOfficeValidationRepo.createofficeServiceCard(officeDetails, profile, context, scDefId, officeId, frequencyType)
    }else {
      let code = 200;
      let response = new MlRespPayload().errorPayload("Your don't have permission to  create office", code);
      return response;
    }
  }catch (e){
    let code = 400;
    return new MlRespPayload().errorPayload("Failed to create office", code);
  }
  let code = 200;
  let officeRequest = MlAlertNotification.onOfficeRequestSent()
  let response = new MlRespPayload().successPayload(officeRequest, code);
  return response;
};

// MlResolver.MlMutationResolver['updateOffice'] = (obj, args, context, info) => {
// }

MlResolver.MlMutationResolver['updateOfficeStatus'] = (obj, args, context, info) => {
  let result;
  if(!args.id){
    let code = 400;
    let response = new MlRespPayload().errorPayload('Office id is required', code);
    return response;
  }
  try{
    // activating office
    result = mlDBController.update('MlOfficeTransaction', { officeId: args.id }, { status:"Approved" }, {$set: true}, context);
    if(!result) {
      let code = 400;
      return new MlRespPayload().errorPayload('Error in Activating the office', code);
    }

    result = mlDBController.update('MlOffice', args.id, {isActive:true}, {$set:true},  context);
    if(!result){
      let code = 400;
      return new MlRespPayload().errorPayload('Error in Activating the office', code);
    }else if(result){
        MlEmailNotification.bespokeOfficeActivated( args.id);
        MlSMSNotification.sendSMSonOfficeActivation(args.id, context);
        MlNotificationController.officeActivation(args.id)
     }
    result = mlDBController.update('MlOfficeSC', {officeId:args.id, isActive:true}, {isActivated:true, isReconciled:true}, {$set:true}, context)
    if(!result){
      let code = 400;
      return new MlRespPayload().errorPayload('Error in Activating the Office Service Card', code);
    }

    // create a ledger balance entry
    officeSC = mlDBController.findOne('MlOfficeSC', {officeId:args.id, isActive:true})
    mlOfficeValidationRepo.createOfficeLedgerEntry(officeSC._id,context)

  }catch (e){
    let code = 400;
    return new MlRespPayload().successPayload(e.message, code);
  }
  let code = 200;
  let response = new MlRespPayload().successPayload('Office activated', code);
  return response;
}

MlResolver.MlQueryResolver['findOfficeDetail'] = (obj, args, context, info) => {
  if (!args.officeId) {
    let code = 400;
    let response = new MlRespPayload().successPayload("Office Id is required", code);
    return response;
  }
  let pipeline = [{'$match': {officeId: args.officeId}},
    {'$project': {office: '$$ROOT'}},
    {
      '$lookup': {
        from: 'mlOfficeTransaction',
        localField: 'office.officeId',
        foreignField: 'officeId',
        as: 'officeTransaction'
      }
    },
    {'$unwind': '$officeTransaction'},
    {
      '$project': {
        office: 1, officeTransaction: {
          status: '$officeTransaction.status', transactionId: '$officeTransaction.transactionId',
          orderSubscriptionDetails: '$officeTransaction.orderSubscriptionDetails',
          paymentDetails: '$officeTransaction.paymentDetails'
        }
      }
    }
  ];
  let result = mlDBController.aggregate('MlOfficeSC', pipeline);
  let code = 200;
  let response = new MlRespPayload().successPayload(result, code);
  return response;
}


MlResolver.MlMutationResolver['createOfficeMembers'] = (obj, args, context, info) => {
    if(!args.myOfficeId){
        let code = 400;
        let response = new MlRespPayload().errorPayload("Invalid Office", code);
        return response;
    }
    var ret = mlOfficeValidationRepo.validateOfficeExpiryDate(args.myOfficeId);
    if(!ret.success){
        let code = 400;
        let response = new MlRespPayload().errorPayload(ret.msg, code);
        return response;
    }

    if(_.isEmpty(args.officeMember)){
        let code = 400;
        let response = new MlRespPayload().successPayload("Please add atleast one office member", code);
        return response;
    }
    args.officeMember.joiningDate = new Date();
  try {

    /**checking if user already present in the users collectio*/
    let isMobileNumberExist = mlDBController.findOne('MlRegistration', { 'registrationInfo.contactNumber': args.officeMember.mobileNumber ,status: {'$nin': ['REG_ADM_REJ','REG_USER_REJ']}});
    if(isMobileNumberExist) {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Mobile number is already registered", code);
      return response;
    }
    let isUserRegExist = mlDBController.findOne('MlRegistration', { 'registrationInfo.email': args.officeMember.emailId ,status: {'$nin': ['REG_ADM_REJ','REG_USER_REJ']}});
    let isUserExist = mlDBController.findOne('users', {username: args.officeMember.emailId});
    if (isUserExist || isUserRegExist) {
      let pipeline = [
        { "$match": { "_id": args.myOfficeId }},
        { "$lookup": { from: "mlOffice", localField: "profileId", foreignField: "profileId", as: "offices" } },
        { "$unwind": "$offices" },
        { $replaceRoot: { newRoot: "$offices" } },
        { "$lookup": { from: "mlOfficeMembers", localField: "_id", foreignField: "officeId", as: "officeMembers" } },
        { "$unwind": "$officeMembers" },
        { "$match" : { "officeMembers.emailId" : args.officeMember.emailId , _id : { $ne : args.myOfficeId } } }
      ];
      let memberAssicatedWithSameInvester = mlDBController.aggregate('MlOffice', pipeline);
      // let isAlreadyInSameOffice = mlDBController.find('MlOfficeMembers', {emailId: args.officeMember.emailId}).fetch();
      if(memberAssicatedWithSameInvester.length  == 0 || isUserRegExist.status == "REG_EMAIL_P" || isUserRegExist.status == "REG_EMAIL_V" ) {
        let code = 400;
        let response = new MlRespPayload().errorPayload("User cannot be associated with this office. Please contact your office admin.", code);
        return response;
      }
      // Send an invite to the Existing User
    }

    // Soft Registration has to be done to new user
    /**generating random password for the users and saving in the registration*/
    var emails = [{address: args.officeMember.emailId, verified: ( isUserRegExist ? true : false ) }];
    let randomPassword = orderNumberGenService.generateRandomPassword()

    /**user details who is creating the office member*/
    var adminUser = mlDBController.findOne('users', {_id: context.userId}) || {}

    var registrationData = {
      createdBy: adminUser.username,
      password: randomPassword,
      firstName: args.officeMember.firstName,
      lastName: args.officeMember.lastName,
      email:args.officeMember.emailId,
      userName:args.officeMember.emailId,
      contactNumber: args.officeMember.mobileNumber,
      communityName: "Office Bearer",
      communityDefCode : "OFB",
      registrationType : "OFB",
      communityDefName : "Office Bearer",
      registrationDate :new Date()
    }


    /**attaching creator details to the office member details in the registration*/
    let profile = new MlUserContext(context.userId).userProfileDetails(context.userId)
    let extendObj = _.pick(profile, ['clusterId', 'clusterName', 'chapterId', 'chapterName', 'subChapterId', 'subChapterName', 'countryId']);
    let finalRegData = _.extend(registrationData, extendObj)
    orderNumberGenService.assignRegistrationId(finalRegData)

    let registrationId = mlDBController.insert('MlRegistration', {
      registrationInfo: finalRegData,
      status: "REG_EMAIL_P",
      emails: emails,
      transactionId :finalRegData.registrationId
    }, context)

    /**sending email verification token to the created office member*/
    if (registrationId && !isUserRegExist) {
      let address
      var user=mlDBController.findOne('MlRegistration', {_id:registrationId},context||{});
      var email = _.find(user.emails || [], function (e) {
        return !e.verified;
      });

      address = (email || {}).address;
      var tokenRecord = {
        token: Random.secret(),
        address: address,
        when: new Date()
      };
      MlRegistration.update({_id: registrationId},
        {$push: {'services.email.verificationTokens': tokenRecord}});
      //Meteor.users.update({_id: userId }, {$push: {'services.email.verificationTokens': tokenRecord}});

      var verificationLink = MlAccounts.verifyEmailLink(tokenRecord.token);
      //MlAccounts.sendVerificationEmail(registrationId,{emailContentType:"html",subject:"Email Verification",context:context});
       MlEmailNotification.officeInvitationEmail(verificationLink,registrationId,context,registrationData)
    }
    if (registrationId) {

      /**finally saving the user to the office member collection*/
      var officeMember = args.officeMember;
      officeMember.officeId = args.myOfficeId;
      officeMember.name = officeMember.firstName + ' ' + officeMember.lastName;
      officeMember['registrationId'] = registrationId

      /**no user is created at this step user will be created after admin approval*/
      // officeMember['userId'] = userId
      officeMember['createdDate'] = new Date()
      let ret = mlDBController.insert('MlOfficeMembers', officeMember, context)
      let fromUserType = 'user';     //to userId is not available as user is not created till
      mlOfficeInteractionService.createTransactionRequest(context.userId, 'officeBearerInvitation', officeMember.officeId, ret, context.userId, fromUserType, context);
      // update ledger balance and journal
      //ret = mlOfficeValidationRepo.updateLedgerBalanceOfficeJournal(args.myOfficeId, officeMember, context)
      if(!ret)
        return new MlRespPayload().errorPayload("Error in updating ledger balance", 400);
    }
  } catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }

    let code = 200;
    let response = new MlRespPayload().successPayload("Member added successfully", code);
    return response;
}
/**
 * Todo:// If any user is made from member to principle then then office ledger to be updated again
 */

MlResolver.MlMutationResolver['updateOfficeMember'] =(obj, args, context, info) => {
  if(!args.memberId){
    let code = 400;
    let response = new MlRespPayload().successPayload("Invalid Office", code);
    return response;
  }
  try{
    if(args.officeMember.isPrincipal){
      var myOffice = mlDBController.findOne('MlOffice', {_id: args.officeId});
      let principalUserCount = MlOfficeMembers.find({officeId:args.officeId , isPrincipal:true}).count();
      if(principalUserCount == myOffice.principalUserCount){
        let response = new MlRespPayload().errorPayload('Limit Exceeded', 400);
        return response;
      }
      let memberInfo = mlDBController.findOne('MlOfficeMembers', args.memberId);
      if(!memberInfo.isActive){
        let response = new MlRespPayload().errorPayload('User not activated', 400);
        return response;
      }
    }
    if(args.officeMember.isRetire || args.officeMember.isFreeze){
      let memberInfo = mlDBController.findOne('MlOfficeMembers', args.memberId);
      args.officeMember.isRetire ? mlOfficeInteractionService.createTransactionRequest(context.userId, 'retireOfficeBearer', args.officeId, memberInfo._id, context.userId, 'user', context) : "";
      if(!memberInfo.profileId){
        let code = 200;
        let response = new MlRespPayload().errorPayload("User not activated", code);
        return response;
      }
      var myOffice = mlDBController.findOne('MlOffice', {_id: args.officeId});
      if(myOffice.profileId == memberInfo.profileId) {
        let code = 200;
        let response = new MlRespPayload().errorPayload("Office owner can't freeze/retire", code);
        return response;
      }

      let userInfo = {
        userProfiles: {
          profileId: memberInfo.profileId,
          isActive: false
        }
      };
      let userResponse = MlResolver.MlMutationResolver["deActivateUserProfileByContext"](obj, userInfo, context, info);

      if(!userResponse.success){
        let code = 200;
        let response = new MlRespPayload().errorPayload("Unable to freeze/retire, Please contact admin", code);
        return response;
      }
      let ret = mlDBController.update('MlOfficeMembers', args.memberId, args.officeMember, {$set: true}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload("Member updated successfully", code);
      return response;

    } else if (args.officeMember.isFreeze == false) {
      let memberInfo = mlDBController.findOne('MlOfficeMembers', args.memberId);
      if(!memberInfo.profileId){
        let code = 200;
        let response = new MlRespPayload().errorPayload("User not activated", code);
        return response;
      }
      var myOffice = mlDBController.findOne('MlOffice', {_id: args.officeId});
      if(myOffice.profileId == memberInfo.profileId) {
        let code = 200;
        let response = new MlRespPayload().errorPayload("Office owner can't unfreeze", code);
        return response;
      }
      let userInfo = {
        userProfiles: {
          profileId: memberInfo.profileId,
          isActive: true
        }
      };
      let userResponse = MlResolver.MlMutationResolver["deActivateUserProfileByContext"](obj, userInfo, context, info);

      if(!userResponse.success){
        let code = 200;
        mlOfficeInteractionService.createTransactionRequest(context.userId, 'deactivateOfficeBearer', args.officeId, args.memberId, context.userId, 'user', context);
        let response = new MlRespPayload().errorPayload("Unable to unfreeze, Please contact admin", code);
        return response;
      }
      let ret = mlDBController.update('MlOfficeMembers', args.memberId, args.officeMember, {$set: true}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload("Member Updated Successfully", code);
      return response;
    } else {
      let ret = mlDBController.update('MlOfficeMembers', args.memberId, args.officeMember, {$set: true}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload("Member updated successfully", code);
      return response;
    }
  } catch (e){
    let code = 400;
    let response = new MlRespPayload().successPayload(e.message, code);
    return response;
  }
}



MlResolver.MlQueryResolver['getTeamMembers'] = (obj, args, context, info) => {
  let temp = [];
  let temp1 = [];
  let result = mlDBController.find('MlOffice', {userId:context.userId} , context).fetch()

  result.map(function(communities){
    communities.availableCommunities.id = communities._id
    temp.push(communities.availableCommunities)
  })
  temp.map(function(community){
    community.map(function(attributes){
      attributes.id = community.id
      temp1.push(attributes)
    })
  })

  return temp1
}

MlResolver.MlQueryResolver['getTeamUsers'] = (obj, args, context, info) => {

  let pipeline =[];
  if(args.officeId) {
    pipeline.push({$match:{officeId:args.officeId}});
  }
  pipeline.push({"$lookup":{from: "users",localField: "emailId",foreignField: "username",as: "user"}});
  pipeline.push({"$unwind":"$user"});
  pipeline.push({ $match: { 'user.profile.isActive':true } });
  pipeline.push({"$project":{ communityType : '$communityType', userId:"$user._id", profileImage:"$user.profile.profileImage", name:"$user.profile.displayName", profileId:"$profileId"}});
  let result = mlDBController.aggregate('MlOfficeMembers', pipeline);
  return result;
}

MlResolver.MlQueryResolver['getBranchDetails'] = (obj, args, context, info) => {

  let result = mlDBController.find('MlOffice', {userId:context.userId} , context).fetch()
  return result;
}


MlResolver.MlQueryResolver['getOfficeUserTypes'] = () => {
  return MlOfficeUserType.find({"isActive":true, code: {$ne: 'PRI'}}).fetch();
}

MlResolver.MlMutationResolver['getMyOfficeRole'] = (obj, args, context, info) => {
  let role;
  let query = {
    officeId: args.officeId,
    userId: context.userId
  };
  let result = mlDBController.findOne('MlOfficeMembers', query);
  if(result.isPrincipal){
    role = 'Principal';
  } else if (result.isAdminUser){
    role = 'AdminUser';
  } else {
    role = 'User';
  }
  let code = 200;
  let response = new MlRespPayload().successPayload(role, code);
  return response;
}

/**
 * update the office member after registration Approval
 * */
MlResolver.MlMutationResolver['updateOfficeMemberOnReg'] = (obj, args, context, info) => {
  try{
    if(args.officeMember){
      var officeMember =  mlDBController.findOne('MlOfficeMembers', {registrationId : args.registrationId}, context);
      if(officeMember){
        let ret = mlDBController.update('MlOfficeMembers', {registrationId: args.registrationId}, args.officeMember, {$set: true}, context);
         if(ret){
           MlEmailNotification.officeBearerApprovedByAdmin(officeMember)
           let userId = officeMember&&officeMember.userId?officeMember.userId:""
           MlNotificationController.officeBearerApprovedByAdmin(userId)
           mlOfficeValidationRepo.updateLedgerBalanceOfficeJournal(officeMember.officeId, officeMember, context)
         }
      }else {
        let code = 400;
        let response = new MlRespPayload().successPayload("user not found", code);
        return response;
      }
      let code = 400;
      let response = new MlRespPayload().successPayload("User details updated successfully", code);
      return response;
    }
  }catch(e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
}

MlResolver.MlMutationResolver["getOfficeTransactionPaymentLink"] = (obj, args, context, info) => {
  let transactionId = args.transactionId;
  let officeTransDetails = mlDBController.findOne('MlOfficeTransaction', {transactionId: transactionId }, context);

  if(officeTransDetails){
    let userId = context.userId;
    let profile = new MlUserContext(userId).userProfileDetails(userId);
    officeTransDetails.orderSubscriptionDetails = officeTransDetails.orderSubscriptionDetails ? officeTransDetails.orderSubscriptionDetails : {};
    let paymentData = {
      paymentMethod: 'Citrus', //later from client only
      amount: officeTransDetails.orderSubscriptionDetails.cost ? officeTransDetails.orderSubscriptionDetails.cost : 0,
      currencyId: 'USD',
      resourceId: officeTransDetails.officeId,
      resourceType: 'OFFICE',
      activityId: officeTransDetails._id,
      activityType: 'OFFICE-PURCHASED',
      status:"Pending",
      userId: userId,
      profileId: profile.profileId,
      clusterId: profile.clusterId,
      clusterName: profile.clusterName,
      chapterId: profile.chapterId,
      chapterName: profile.chapterName,
      subChapterId: profile.subChapterId,
      subChapterName: profile.subChapterName,
      communityId: profile.communityId,
      communityName: profile.communityName,
      createdAt: new Date()
    };

    orderNumberGenService.createPaymentId(paymentData);

    let paymentResponse = mlDBController.insert('MlPayment', paymentData, context);
    if(paymentResponse){
      var randomString = require('random-string');
      console.log(paymentData.paymentId);
      /*****Generate Signature per payment request generation*****/
      function generateSignature(merchantTxnId, request) {
          //Need to replace the last part of URL("your-vanityUrlPart") with your Testing/Live URL
          var formPostUrl = "https://checkout.citruspay.com/ssl/checkout/"+request.vanityUrl;

          //Need to change with your Secret Key
          var secret_key = request.secret_key;

          //Need to change with your Vanity URL Key from the citrus panel
          var vanityUrl = request.vanityUrl;

          //Need to change with your Order Amount
          var orderAmount = request.orderAmount;
          var currency = "INR";

          // generate hmac
          var data = vanityUrl+request.orderAmount+request.merchantTxnId+"INR";
          console.log(data);
          var hash = CryptoJS.HmacSHA1(data,secret_key).toString();
          console.log("hash: ", hash);
          return hash;
      }

      let email="citrusdevraksan@raksan.in";
      let payObj={
        vanityUrl:"asder234rtx",
        merchantTxnId:paymentData.paymentId,
        orderAmount:(officeTransDetails.orderSubscriptionDetails.cost ? officeTransDetails.orderSubscriptionDetails.cost : 0).toString(),
        accesskey:"4KL2VV5NSPDLOHY4CAS1",
        secret_key:'22b7cc7ea856cd35e42c2ed6a76eff8e2f27a470',

      }
      let paymentInfo= {
        //"email": email,
        //"phoneNumber":'9966408213',
        "merchantTxnId":payObj.merchantTxnId,
        "orderAmount": payObj.orderAmount,
        "currency": "INR",
        "secSignature": generateSignature(payObj.merchantTxnId,payObj),
        "returnUrl":Meteor.absoluteUrl()+"moolyaPaymentStatus",
       // "returnUrl": Meteor.absoluteUrl() +"app/transaction",
      };
      let apiRequest = {
        headers: {'content-type' : 'application/text'},
        //url:     'http://payment-services-814468192.ap-southeast-1.elb.amazonaws.com/payments/process',
        url:     'https://checkout.citruspay.com/ssl/checkout/'+payObj.vanityUrl
        // url:     "http://10.0.2.140:8080/payments/process"
      };
      /*let future = new Future();

      let post_req = request.post(apiRequest, function(error, response, body){
        if(error){
          //console.log(error);
          let result = new MlRespPayload().errorPayload(error.message, 400);
          future.return(result);
        } else {
          console.log(paymentInfo);
          //console.log(response);
          console.log(response.headers);
          response.headers = response.headers ? response.headers : {};
          let result;
          if(response.headers.url){
            result = new MlRespPayload().successPayload(apiRequest.url, 200);
          } else {
            result = new MlRespPayload().errorPayload("Unable to proceed your payment right now", 400);
          }
          result = new MlRespPayload().successPayload(apiRequest.url, 200);
          future.return(result);
        }
      });


      let text = base64.encodeWithKey(JSON.stringify(paymentInfo), 'Test123');

      post_req.write(text);

      let resposne = future.wait();

      return resposne;*/
      return new MlRespPayload().successPayload(JSON.stringify({paymentUrl:apiRequest.url,paymentInfo:paymentInfo}), 200);
    }

    /*if(paymentResponse){
      let paymentInfo = {
        "orderId": officeTransDetails._id,
        "paymentAmount": (officeTransDetails.orderSubscriptionDetails.cost ? officeTransDetails.orderSubscriptionDetails.cost : 0).toString(),
        "API_KEY": "AESsdjkfhsdkjfjkshfn346346",
        "appId": "moolya",
        "currency": "USD",
        "transId": paymentData.paymentId,
        "paymentEndPoint": "paypal",
        "operation": "debit",
        "customerId": officeTransDetails.userId,
        // "callBackUrl": "http://10.0.2.188:3000/app/myOffice"
        "callBackUrl": Meteor.absoluteUrl() +"app/transaction"
      };
      // "callBackUrl": "http://103.60.212.114/app/myOffice"
      let apiRequest = {
        headers: {'content-type' : 'application/text'},
        url:     'http://payment-services-814468192.ap-southeast-1.elb.amazonaws.com/payments/process'
        // url:     "http://10.0.2.140:8080/payments/process"
      };

      let future = new Future();

      let post_req = request.post(apiRequest, function(error, response, body){
        if(error){
          console.log(error);
          let result = new MlRespPayload().errorPayload(error.message, 400);
          future.return(result);
        } else {
          response.headers = response.headers ? response.headers : {};
          let result;
          if(response.headers.url){
            result = new MlRespPayload().successPayload(response.headers.url, 200);
          } else {
            result = new MlRespPayload().errorPayload("Unable to proceed your payment right now", 400);
          }
          future.return(result);
        }
      });

      let text = base64.encodeWithKey(JSON.stringify(paymentInfo), 'Test123');

      post_req.write(text);

      let resposne = future.wait();

      return resposne;
    }*/


  } else {

  }
};

MlResolver.MlQueryResolver['getOfficeType'] = (obj, args, context, info) => {
  var officeTypes = mlDBController.find('MlOfficeType', {}, context).fetch();
  return officeTypes;
};


MlResolver.MlMutationResolver['officeMemberGoIndependent'] = (obj, args, context, info) => {
  let memberId = args.memberId;
  let communityCode = args.communityCode;
  if(memberId && communityCode) {
    let officeMember =  mlDBController.findOne('MlOfficeMembers', memberId, context);
    let query = { _id:officeMember.userId, 'profile.externalUserProfiles.communityDefCode': { "$ne" : "OFB" } };
    let isAlreadyIndependent = mlDBController.findOne('users', query, context);
    if(!isAlreadyIndependent) {

      var emails = [{address: officeMember.emailId, verified: true }];
      let randomPassword = orderNumberGenService.generateRandomPassword()

      /**user details who is creating the office member*/
      var adminUser = mlDBController.findOne('users', {_id: context.userId}) || {}

      let community = mlDBController.findOne('MlCommunityDefinition', {code: communityCode });

      console.log(community);

      let registrationData = {
        createdBy: adminUser.username,
        firstName: officeMember.firstName,
        lastName: officeMember.lastName,
        email: officeMember.emailId,
        userName: officeMember.emailId,
        contactNumber: officeMember.mobileNumber,
        communityName: community.name,
        communityDefCode : community.code,
        registrationType : community.code,
        communityDefName : community.name,
        password: randomPassword,
        registrationDate :new Date()
      };

      /**attaching creator details to the office member details in the registration*/
      let profile = new MlUserContext(context.userId).userProfileDetails(context.userId);
      let extendObj = _.pick(profile, ['clusterId', 'clusterName', 'chapterId', 'chapterName', 'subChapterId', 'subChapterName', 'countryId']);
      let finalRegData = _.extend(registrationData, extendObj);
      orderNumberGenService.assignRegistrationId(finalRegData);

      let registrationId = mlDBController.insert('MlRegistration', {
      registrationInfo: finalRegData,
      status: "REG_EMAIL_P",
      emails: emails,
      transactionId :finalRegData.registrationId
      }, context);

      let resp = mlDBController.update('MlOfficeMembers', memberId, {isIndependent : true}, {$set: true}, context);
      if(resp){
        mlOfficeInteractionService.createTransactionRequest(context.userId, 'officeBearerGoIndependent', officeMember.officeId, memberId, context.userId, 'user', context);
        MlEmailNotification.goIndependentRequest(context.userId,registrationData)
      }
      // if(resp){
      //   if(finalRegData&&finalRegData.userName){
      //     let userInfo=mlDBController.findOne('users', {username: finalRegData.userName}) || {}
      //     if(userInfo){
      //       MlNotificationController.officeMemberIndependent(userInfo._id,context.userId)
      //     }
      //   }
      // }
      let code = 200;
      let response = new MlRespPayload().successPayload("'Go-Independent' requested successfully", code);
      return response;

    } else {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Profile already marked 'Go-Independent'", code);
      return response;
    }

  } else {

    let code = 400;
    let response = new MlRespPayload().errorPayload('MemberId and Community Code are mandatory', code);
    return response;

  }
};

MlResolver.MlMutationResolver['deActivateOffice'] = (obj, args, context, info) => {
  var response = null;
  var code  = 400;
  const officeId = args.officeId ? args.officeId : null;
  if(officeId){
    const respSC = mlDBController.update('MlOfficeSC', {officeId: officeId}, {isActive: false}, {$set: true}, context);
    const respOffice = mlDBController.update('MlOffice', {_id: officeId}, {isActive: false}, {$set: true}, context);
    mlOfficeInteractionService.createTransactionRequest(context.userId, 'officeDeactivate', officeId, officeId, context.userId, 'user', context);
    if(respSC && respOffice){
      code = 200;
      response = new MlRespPayload().successPayload('Office deactivated successfully', code);
    }else {
      code = 400;
      response = new MlRespPayload().errorPayload('Cannot update office', code);
    }
  }else {
    response = new MlRespPayload().errorPayload("'Office Id' mandatory", code);
  }
  return response
};

getOfficeFetchPreCondition = (userDefaultProfile) => {
  var returnResponse = {isRemoveOFB: false};
  const isActiveProfile = userDefaultProfile && userDefaultProfile.isActive ? userDefaultProfile.isActive : false;
  const isOFBCommunity = userDefaultProfile.communityDefCode == "OFB" ? true : false;
  if (isOFBCommunity && !isActiveProfile)
    returnResponse = {isRemoveOFB: true, registrationId: userDefaultProfile.registrationId};
  return returnResponse
};
