/**
 * Created by venkatsrinag on 28/4/17.
 */
import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";
import MlUserContext from "../../MlExternalUsers/mlUserContext";
import _ from "lodash";
import _underscore from "underscore";
import geocoder from "geocoder";
import MlEmailNotification from "../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAppUserContext from '../../mlAuthorization/mlAppUserContext'
import MlSubChapterAccessControl from '../../mlAuthorization/mlSubChapterAccessControl';
var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');
var request = require('request');

MlResolver.MlQueryResolver['fetchIdeatorUsers'] = (obj, args, context, info) =>
{
    let sample = [
        {
            username:"",
            profile:{
                isExternaluser:true,
                city:"",
                state:"",
                country:"",
                cluster:"",
                chapter:"",
                community:"",
                externalUserProfiles:{
                    firstName:"",
                    lastName:"",
                    userProfiles:[
                        {
                            registrationId:"",
                            portfolio:[
                                {
                                    portfolioId:"",
                                    isDefault:true
                                }
                            ],
                            countryName:"",
                            countryId:"",
                            cityName:"",
                            mobileNumber:"",
                            clusterId:"",
                            clusterName:"",
                            chapterId:"",
                            chapterName:"",
                            subChapterId:"",
                            subChapterName:"",
                            communityId:"",
                            communityName:"",
                            communityType:"",
                            isDefault:true,
                            isActive:true,
                            accountType:""
                        }
                    ]
                }
            }
        }
    ]
  let code = 200;
  let response = new MlRespPayload().successPayload(sample, code);
  return response;
}

MlResolver.MlQueryResolver['findAddressBook'] = (obj, args, context, info) => {
  // TODO : Authorization
  let userId=context.userId

  var  user= mlDBController.findOne('users',{_id:userId},context) || {};
  if(user){
    var registrationId;
    var clusterId;
    let profile = new MlUserContext(userId).userProfileDetails(userId)

    registrationId = profile.registrationId;
    clusterId = profile.clusterId;
    const addInfo = user.profile.externalUserAdditionalInfo?user.profile.externalUserAdditionalInfo:[]
    var infoDetails;
   /* _.each(addInfo,function (say,value) {
      if(say.registrationId == registrationId && say.clusterId == clusterId){
        infoDetails = say
      }
    })*/
    infoDetails = _underscore.find(addInfo, {'profileId': profile.profileId}) || {};
    var mobileNumbs = [];
    _.each(user.mobileNumbers, function (mob) {
      if(mob.verified){
        var country = mlDBController.findOne('MlCountries',{_id:mob.countryId}) || {};
        mob.phoneNumberCode = country.phoneNumberCode;
        mob.numberType = "Official";
        mobileNumbs.push(mob)
      }
    })
    infoDetails.mobileNumbers = mobileNumbs;
    return infoDetails;
  }else {
    let code = 409;
    let response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }
}


MlResolver.MlMutationResolver['updateUserGeneralInfo'] = (obj, args, context, info) => {

  let id = " "
  // let registrationDetails =MlRegistration.findOne({_id: args.registrationId}) || {};
  let registrationDetails = mlDBController.findOne('users',{_id:context.userId},context) || {};
  if(args && args.registration) {
    if (args.type == "CONTACTTYPE") {
      id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.contactInfo': args.registration.contactInfo},{$set: true}, context)
    } else if (args.type == "ADDRESSTYPE") {

      if(args.registration.addressInfo && args.registration.addressInfo.length){

        args.registration.addressInfo.map((address,index)=>{
          let city = address.addressCity;
          let area = address.addressArea;
          let locality = address.addressLocality;
          let pin = address.addressPinCode;

          geocoder.geocode(locality+","+area+","+city+","+pin, Meteor.bindEnvironment(function ( err, data ) {
            if(err){
              throw new Error("Invalid Locality selection "+e);
            }
            address.latitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lat:null;
            address.longitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lng:null;

            if(index+1 === args.registration.addressInfo.length){
              id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.addressInfo': args.registration.addressInfo},{$set: true}, context)

            }
          }),{key:Meteor.settings.private.googleApiKey});
        });
      }
      // id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.addressInfo': args.registration.addressInfo},{$set: true}, context)

    } else if (args.type == "SOCIALLINKS") {
      //id = mlDBController.update('MlRegistration', args.registrationId, {'socialLinksInfo': args.registration.socialLinksInfo}, {$set: true}, context)
      id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.socialLinksInfo': args.registration.socialLinksInfo},{$set: true}, context)
    } else if (args.type == "EMAILTYPE") {
      //id = mlDBController.update('MlRegistration', args.registrationId, {'emailInfo': args.registration.emailInfo}, {$set: true}, context)
      id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.emailInfo':args.registration.emailInfo},{$set: true}, context)
    }
  }

  if(id){
    let code = 200;
    let response = new MlRespPayload().successPayload(id, code);
    return response
  }


}

MlResolver.MlMutationResolver['createUserGeneralInfo'] = (obj, args, context, info) => {
    let id = "";
    let response;
  var fut = new Future();
  if(args.registration&& args.registrationId && args.profileId){

    var  registrationDetails= mlDBController.findOne('users',{_id:context.userId},context) || {};


    const addInfo = registrationDetails.profile.externalUserAdditionalInfo?registrationDetails.profile.externalUserAdditionalInfo:[]
    let infoDetails = _underscore.find(addInfo, {'profileId': args.profileId}) || {};


    if(args && args.registration){
      if(args.type == "CONTACTTYPE"){

        let dbData = _underscore.pluck(infoDetails.contactInfo, 'numberType') || [];
        let contactExist = null;
        if(args.registration&&args.registration.contactInfo&&args.registration.contactInfo[0]){
          contactExist = _underscore.contains(dbData, args.registration.contactInfo[0].numberType);
        }

        if(contactExist){
          let code = 409;
          let response = new MlRespPayload().errorPayload("'Contact type' already exist!", code);
          return response;
        }

        if(infoDetails.contactInfo){
          id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.contactInfo': args.registration.contactInfo[0]},{$push: true}, context)
        }else{
          //id = mlDBController.update('MlRegistration', args.registrationId, {'contactInfo': args.registration.contactInfo}, {$set: true}, context)
          id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.contactInfo': [args.registration.contactInfo[0]]},{$set: true}, context)
        }

      }else if(args.type == "ADDRESSTYPE"){
        let dbData = _underscore.pluck(infoDetails.addressInfo, 'addressType') || [];
        let addressExist = null;
        if(args.registration.addressInfo&&args.registration.addressInfo[0]){
          addressExist = _underscore.contains(dbData, args.registration.addressInfo[0].addressType);
        }

        if(addressExist){
          let code = 409;
          let response = new MlRespPayload().errorPayload("'Address type' already exists!", code);
          return response;
        }
        if(infoDetails.addressInfo){
          // id = MlRegistration.update(
          //   { _id : args.registrationId },
          //   { $push: { 'addressInfo': args.registration.addressInfo[0] } }
          // )
          let city = args.registration.addressInfo[0].addressCity
          let area = args.registration.addressInfo[0].addressArea
          let locality = args.registration.addressInfo[0].addressLocality
          let pin =args.registration.addressInfo[0].addressPinCode
          geocoder.geocode(locality+","+area+","+city+","+pin, Meteor.bindEnvironment(function ( err, data ) {
            if(err){
              throw new Error("Invalid Locality selection "+e);
            }
            args.registration.addressInfo[0].latitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lat:null;
            args.registration.addressInfo[0].longitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lng:null;

            try{
              // let id = MlClusters.insert(cluster);
             /* let  id = mlDBController.update('users', {_id: context.userId},{'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'$push': {
                'profile.externalUserAdditionalInfo.$.addressInfo': args.registration.addressInfo[0]
              }}, context)*/
              id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.addressInfo': args.registration.addressInfo[0]},{$push: true}, context)
              if(id){
                let code = 200;
                let result = {addressId: id}
                 response = JSON.stringify(new MlRespPayload().successPayload(result, code));
                if(response){
                  fut.return(response);
                }
              }
            }catch(e){
              throw new Error("Error while updating address "+e);
            }

          }),{key:Meteor.settings.private.googleApiKey});
          var addressData = fut.wait();
        }else{
          let city = args.registration.addressInfo[0].addressCity||"";
          let area = args.registration.addressInfo[0].addressArea||"";
          let locality = args.registration.addressInfo[0].addressLocality||"";
          let pin =args.registration.addressInfo[0].addressPinCode||"";
          geocoder.geocode(locality+","+area+","+city+","+pin, Meteor.bindEnvironment(function ( err, data ) {
            if(err){
              throw new Error("Invalid Locality selection "+e);
            }
            args.registration.addressInfo[0].latitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lat:null;
            args.registration.addressInfo[0].longitude = data&&data.results[0]&&data.results[0].geometry&&data.results[0].geometry.location&&data.results[0].geometry.location.lat?data.results[0].geometry.location.lng:null;

            try{
              // let id = MlClusters.insert(cluster);
              //let id = mlDBController.update('MlRegistration', args.registrationId, {'addressInfo': args.registration.addressInfo}, {$set: true}, context)
               id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.addressInfo': [args.registration.addressInfo[0]]},{$set: true}, context)
              if(id){
                let code = 200;
                let result = {addressId: id}
                let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
                if(response){
                  fut.return(response);
                }

              }
            }catch(e){
              throw new Error("Error while updating address "+e);
            }
          }),{key:Meteor.settings.private.googleApiKey});

          var addressData = fut.wait();

        }
      }else if (args.type == "EMAILTYPE") {
        let dbData = _underscore.pluck(infoDetails.emailInfo, 'emailIdType') || [];
        let emailTypeExist = null;
        if(args.registration.emailInfo[0]){
          emailTypeExist = _underscore.contains(dbData, args.registration.emailInfo[0].emailIdType);
        }

        if(emailTypeExist){
          let code = 409;
          let response = new MlRespPayload().errorPayload("'Email type' already exists!", code);
          return response;
        }
        if(infoDetails.emailInfo){
          id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.emailInfo': args.registration.emailInfo[0]},{$push: true}, context)
        }else{
          id = mlDBController.update('users', {_id: context.userId,'profile.externalUserAdditionalInfo.profileId': args.profileId}, {'profile.externalUserAdditionalInfo.$.emailInfo': [args.registration.emailInfo[0]]},{$set: true}, context)
        }
      }
    }


  }

  if(id){
    let code = 200;


    let response = new MlRespPayload().successPayload(id, code);
    return response
  }


}


MlResolver.MlQueryResolver['fetchUserProfiles'] = (obj, args, context, info) => {
  let userId=context.userId
  const user = Meteor.users.findOne({_id:userId}) || {}
  if(user){
    var userProfiles = user.profile.isExternaluser?user.profile.externalUserProfiles:[];

    //todo: add isApproved Attribute to the profile
    userProfiles=_.filter(userProfiles, {'isActive': true })||[];
    userProfiles=_.map(userProfiles,function (profile)
    {
      let communityDetails=mlDBController.findOne('MlCommunityDefinition', {code: profile.communityDefCode}, context) || {};
      if(communityDetails) {profile.communityImage=communityDetails.communityImageLink}

      if(profile.accountType){
        let AccountType=mlDBController.findOne('MlAccountTypes', {_id: profile.accountType}, context) || {};
        if(AccountType.accountDisplayName)
          profile.accountType = AccountType.accountDisplayName;
      }

      return profile;
    })

    return userProfiles;
  }else {
    let code = 409;
    let response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

}
MlResolver.MlMutationResolver['deActivateUserProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  const user = Meteor.users.findOne({_id:userId}) || {}
  if(user&&args&&args.profileId){
    let result = mlDBController.update('users', {'profile.externalUserProfiles':{$elemMatch: {'profileId': args.profileId}}},
      {"profile.externalUserProfiles.$.isDefault": false}, {$set: true}, context);
    response = new MlRespPayload().successPayload({}, 200);
    if(result){
      let emailSent = MlEmailNotification.onDeactivateUser(context);
      let verficationEmail = MlEmailNotification.requestForProfileDeactivation(context);

    }
  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

  return response;

}


MlResolver.MlMutationResolver['blockUserProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  const user = Meteor.users.findOne({_id:userId}) || {}
  if(user&&args&&args.profileId){
    result = mlDBController.update('users', {'profile.externalUserProfiles':{$elemMatch: {'profileId': args.profileId}}},
      {"profile.externalUserProfiles.$.isApprove": false}, {$set: true}, context);
    response = new MlRespPayload().successPayload({}, 200);
  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

  return response;

}

MlResolver.MlMutationResolver['setDefaultProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  var update=null;
  const user = mlDBController.findOne('users',{_id:userId}) || {}
  if(user&&args&&args.profileId){
    var hasSwitchedProfile=user.profile.hasSwitchedProfile;
    /**switch profile/make default- if user has makes a profile as default,check for profile switch flag and set switchedProfileDefaultId to selected id
     * if user has switched his profile, then switchedProfileDefaultId value has the default profile Id.
     *Once user logs in again, default profile Id will be retained and switchProfile details will be cleared.
     * */
    if(hasSwitchedProfile){
      result= mlDBController.update('users',{'_id':userId,"profile.hasSwitchedProfile": true,'profile.externalUserProfiles':{$elemMatch: {'profileId': args.profileId}}},
        {"profile.switchedProfileDefaultId": args.profileId}, {$set: true}, context);
    }else{
      result= mlDBController.update('users', {_id:userId,'profile.externalUserProfiles':{$elemMatch: {'isDefault': true}}},
        {"profile.externalUserProfiles.$.isDefault": false}, {$set: true,multi:true}, context);

      /**check if hasSwitchedProfile value is false/null/undefined/not exists*/
      result= mlDBController.update('users',{'_id':userId,$or:[{"profile.hasSwitchedProfile":false},{"profile.hasSwitchedProfile" : { $type: 10 }},{"profile.hasSwitchedProfile":{ $exists: false } }],'profile.externalUserProfiles':{$elemMatch: {'profileId': args.profileId}}},
        {"profile.externalUserProfiles.$.isDefault": true, "profile.switchedProfileDefaultId":null}, {$set: true}, context);

    }

    response = new MlRespPayload().successPayload({}, 200);


  }else {
    let code = 409;
     response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }
  return response;
}


MlResolver.MlMutationResolver['switchExternalProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  var update=null;
  const user = mlDBController.findOne('users',{_id:userId}) || {}
  if(user&&args&&args.profileId){

    var defaultUserProfile=_.find(user.profile.externalUserProfiles, {'isDefault':true })||user.profile.externalUserProfiles[0];
    var defaultUserProfileId=defaultUserProfile?defaultUserProfile.profileId:null;
    /**Check if switchedProfileDefaultId exists for the first time and update defaultUserProfileId*/
    result= mlDBController.update('users',{'_id':userId,$or:[{"profile.switchedProfileDefaultId" : { $type: 10 }},{"profile.switchedProfileDefaultId":{ $exists: false } }]},
      {"profile.switchedProfileDefaultId":defaultUserProfileId}, {$set: true,multi:false}, context);

    /**clear the default flag of all profiles*/
    result= mlDBController.update('users', {'_id':userId,'profile.externalUserProfiles':{$elemMatch: {'isDefault': true}}},
      {"profile.externalUserProfiles.$.isDefault": false}, {$set: true,multi:true}, context);

    /**switch profile - if user has switched profile,make the profile as default */
    result= mlDBController.update('users',{'_id':userId,'profile.externalUserProfiles':{$elemMatch: {'profileId': args.profileId}}},
      {"profile.hasSwitchedProfile": true,
        "profile.externalUserProfiles.$.isDefault": true}, {$set: true}, context);

    if(result==1) response = new MlRespPayload().successPayload({}, 200);

  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }
  return response;
}

MlResolver.MlQueryResolver['fetchMapCenterCordsForExternalUser'] = (obj, args, context, info) => {

  if(args.module === 'chapterUser' || args.module === 'subChapterUser'){
    if(args.module === 'chapterUser') {
      let clusterDetails = MlClusters.findOne(args.id||null);
      if (clusterDetails && clusterDetails.latitude && clusterDetails.longitude) {
        return {lat: clusterDetails.latitude, lng: clusterDetails.longitude};
      }
    }else if( args.module === 'subChapterUser'){
      let chapterDetails = MlChapters.findOne(args.id||null);
      if (chapterDetails && chapterDetails.latitude && chapterDetails.longitude) {
        return {lat: chapterDetails.latitude, lng: chapterDetails.longitude};
      }
    }
  }
  if(args.module == "subChapter" || args.module == "externalUsers"){
      var chapterId = args.id||null;
      if(!chapterId){
        let user= mlDBController.findOne('users',{_id:context.userId});
        var externalProfile = _.find(user.profile.externalUserProfiles, {'isDefault':true});
        if(!externalProfile){
          externalProfile = user.profile.externalUserProfiles[0];
        }
        chapterId=externalProfile.chapterId;
      }
      let chapterDetails = MlChapters.findOne(chapterId);
      if (chapterDetails && chapterDetails.latitude && chapterDetails.longitude) {
        return {lat: chapterDetails.latitude, lng: chapterDetails.longitude};
      }
  }

  var clusterId=args.id||null;
  if(!clusterId){
    let user= mlDBController.findOne('users',{_id:context.userId});
    var externalProfile = _.find(user.profile.externalUserProfiles, {'isDefault':true});
    if(!externalProfile){
      externalProfile = user.profile.externalUserProfiles[0];
    }
    clusterId=externalProfile.clusterId;
  }

  let clusterDetails = MlClusters.findOne(clusterId);
  if (clusterDetails && clusterDetails.latitude && clusterDetails.longitude) {
    return {lat: clusterDetails.latitude, lng: clusterDetails.longitude};
  }
}

/**
 * @module [users / LEFT NAV / Office Member Freeze or Retire]
 * Note: Status change of user profile coming in there context
 * */
MlResolver.MlMutationResolver['deActivateUserProfileByContext'] = (obj, args, context, info) => {
  var response = null
  if (args.userProfiles && args.userProfiles.profileId) {
    var profileId = args.userProfiles.profileId
    var result = mlDBController.update('users', {'profile.externalUserProfiles': {$elemMatch: {'profileId': profileId}}},
      {
        "profile.externalUserProfiles.$.isDefault": false,
        "profile.externalUserProfiles.$.isActive": args.userProfiles.isActive
      }, {$set: true}, context);
    if (result)
      response = new MlRespPayload().successPayload('User profile updated successfully ', 200);
    else
      response = new MlRespPayload().errorPayload('Unable to update profile', 409);
  } else {
    response = new MlRespPayload().errorPayload('User profile is required', 409);
  }
  return response;
}
/**
 * Users left nav
 * @Note: "deActivateUser" both have to be merged
 * */
MlResolver.MlMutationResolver['updateUserShowOnMap'] = (obj, args, context, info) => {
  var user = mlDBController.findOne('users', {_id: args.userId}, context)
  var resp;
  if (user) {
    resp = mlDBController.update('users', args.userId, {"profile.isShowOnMap": args.isShowOnMap}, {$set: true}, context)
    if (resp) {
      resp = new MlRespPayload().successPayload("User details updated successfully", 200);
      return resp
    } else {
      resp = new MlRespPayload().errorPayload("Error in update", 400);
      return resp
    }
  }else {
    return new MlRespPayload().errorPayload("Invalid user", 400);
  }
}

//todo:// need to use default way of geeting default profile from api "need to remove this login"
MlResolver.MlQueryResolver['findDefaultUserProfile'] = (obj, args, context, info) => {
  var defaultProfile = {};
  var user = Meteor.users.findOne({_id:context.userId});
  if(user && user.profile && user.profile.isExternaluser === true){
    var user_profiles = user.profile.externalUserProfiles||[];
    defaultProfile = _.find(user_profiles, {'isDefault': true });
    if(!defaultProfile){
      defaultProfile = user_profiles&&user_profiles[0]?user_profiles[0]:{};
    }
  }
  return defaultProfile;
}

MlResolver.MlQueryResolver['fetchMoolyaAdmins'] = (obj, args, context, info) => {
  var userId = args.userId ? args.userId : context.userId
  var profileDetails = {}
  if (args.profileId)
    profileDetails = new MlUserContext().userProfileDetailsByProfileId(args.profileId)
  else
    profileDetails = new MlUserContext(userId).userProfileDetails(userId)
  var query = [
    {
      $match: {
        'profile.isInternaluser': true, 'profile.isMoolya': true,
        'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId': profileDetails.clusterId,
        'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId': profileDetails.chapterId,
        'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.roleName': "chapteradmin",
      }
    },
    {
      "$project": {
        _id: 1, "displayName": {$concat: ["$profile.firstName", " ", "$profile.lastName"]},
        "userName": "$username",
        "profileImage": "$profile.profileImage"
      }
    }
  ]
  var response = mlDBController.aggregate('users', query, context)
  if(!response.length) {
    var query = [
      {
        $match: {
          'profile.isInternaluser': true, 'profile.isMoolya': true,
          'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId': profileDetails.clusterId,
          'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId': profileDetails.chapterId,
          'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.roleName': "clusteradmin",
        }
      },
      {
        "$project": {
          _id: 1, "displayName": {$concat: ["$profile.firstName", " ", "$profile.lastName"]},
          "userName": "$username",
          "profileImage": "$profile.profileImage"
        }
      }
    ]
    var response = mlDBController.aggregate('users', query, context);
    return response;
  }
  return response
}

/**
 * @note [FetchMapData] for map used in "communityResolver.js"
 */
MlResolver.MlQueryResolver['fetchAppMapData'] = (obj, args, context, info) => {
  let query={};
  let chapterQuery;
  let subChapterQuery;
  let moduleContext = "";
  var chapterCount=0
  let userId = context.userId;
  let userProfile = new MlUserContext().userProfileDetails(userId);
  var userSubChapterId = userProfile.subChapterId;
  let userSubChapter = mlDBController.findOne('MlSubChapters', {_id:userSubChapterId});
  var isDefaultSubChapter = userSubChapter.isDefaultSubChapter;
  if(!isDefaultSubChapter){
      var relatedSubChapterIds = [];
      // var relatedSubChapters = mlDBController.find('MlRelatedSubChapters', {$and:[{subChapters:{$elemMatch:{subChapterId:userSubChapterId}}}, {$or:[{"externalUser.canSearch":true},{"externalUser.canTransact":true},{"externalUser.canView":true}]}]}).fetch()
      var relatedSubChapters = mlDBController.find('MlRelatedSubChapters', {subChapters:{$elemMatch:{subChapterId:userSubChapterId}}}).fetch()
      if(relatedSubChapters&&relatedSubChapters.length>0){
          _.each(relatedSubChapters, function(obj){
            let ids = _.map(obj.subChapters, "subChapterId");
            relatedSubChapterIds = _.concat(relatedSubChapterIds, ids)
          })
          relatedSubChapterIds = _.uniq(relatedSubChapterIds);
          var relatedSC = mlDBController.find('MlSubChapters', {_id:{$in:relatedSubChapterIds}}).fetch()
          var relatedChapterId = _.map(relatedSC, "chapterId");
          relatedChapterId = _.uniq(relatedChapterId);

          // let mlSubChapterAccessControl = MlSubChapterAccessControl.getAccessControl('SEARCH', context);
          // mlSubChapterAccessControl = mlSubChapterAccessControl || {};
          // mlSubChapterAccessControl.subChapters = mlSubChapterAccessControl.subChapters ? mlSubChapterAccessControl.subChapters : [];
          // if (mlSubChapterAccessControl.isInclusive) {
          // subChapterQuery = { $in: mlSubChapterAccessControl.subChapters };
          // chapterQuery = { $in: mlSubChapterAccessControl.chapters };
          // } else {
          // subChapterQuery = { $nin: mlSubChapterAccessControl.subChapters };
          // chapterQuery = { $nin: mlSubChapterAccessControl.chapters };
          // }
      }
  }


   let mlSubChapterAccessControl = MlSubChapterAccessControl.getAccessControl('SEARCH', context);
          mlSubChapterAccessControl = mlSubChapterAccessControl || {};
          mlSubChapterAccessControl.subChapters = mlSubChapterAccessControl.subChapters ? mlSubChapterAccessControl.subChapters : [];
          if (mlSubChapterAccessControl.isInclusive) {
          subChapterQuery = { $in: mlSubChapterAccessControl.subChapters };
          chapterQuery = { $in: mlSubChapterAccessControl.chapters };
          } else {
          subChapterQuery = { $nin: mlSubChapterAccessControl.subChapters };
          chapterQuery = { $nin: mlSubChapterAccessControl.chapters };
          }

  switch(args.moduleName){
      case "cluster":
          moduleContext=mlDBController.findOne('MlClusters', {_id:args.id}, context).clusterName;
          if(isDefaultSubChapter){
              let sub = mlDBController.find('MlSubChapters', {$or:[{clusterId:args.id, isActive:true, "moolyaSubChapterAccess.externalUser.canSearch":true},{clusterId:args.id, isActive:true, isDefaultSubChapter:true}]}, context).fetch()
              let subIds = _.map(sub, "_id");
              let ids = _.map(sub, "chapterId");
              ids = _.uniq(ids)
              chapterCount = mlDBController.find('MlChapters', {_id:{$in:ids}, clusterId:args.id, isActive:true}, context).count();
              // query={"clusterId":args.id, chapterId:{$in:ids}, subChapterId:{$in:subIds}, isActive:true};
              query={"clusterId":args.id, subChapterId:subChapterQuery, isActive:true};
          }else{
              chapterCount = mlDBController.find('MlChapters', {clusterId:args.id, isActive:true, _id:chapterQuery}, context).count();
              // query={"clusterId":args.id, isActive:true, "chapterId":chapterQuery, "subChapterId":subChapterQuery};
              query={"clusterId":args.id, isActive:true, "subChapterId":subChapterQuery};
          }
          break;
      case "chapter":
          moduleContext=mlDBController.findOne('MlChapters', {_id:args.id}, context).chapterName;
          let chapter = mlDBController.findOne('MlChapters', {_id:args.id}, context);
          if(isDefaultSubChapter){
              let sub = mlDBController.find('MlSubChapters', {$or:[{chapterId:args.id, isActive:true, "moolyaSubChapterAccess.externalUser.canSearch":true},{chapterId:args.id, isActive:true, isDefaultSubChapter:true}]}, context).fetch()
              let ids = _.map(sub, "_id");
              chapterCount = sub.length;
              // query={"chapterId":args.id, "clusterId":chapter.clusterId, "subChapterId":{$in:ids}, isActive:true};
              // query={"chapterId":args.id, "clusterId":chapter.clusterId, isActive:true};
              query={"chapterId":args.id, "clusterId":chapter.clusterId, isActive:true, "$or":[{"subChapterId":subChapterQuery}, {isDefaultSubChapter:true}]};

          }else{
              if(userSubChapter.moolyaSubChapterAccess.externalUser.canView || userSubChapter.moolyaSubChapterAccess.externalUser.canSearch){
                chapterCount = mlDBController.find('MlSubChapters', {chapterId:args.id, isActive:true, _id:subChapterQuery}, context).count()
                              + mlDBController.find('MlSubChapters', {chapterId:args.id, isActive:true, isDefaultSubChapter:true}, context).count();
              }else{
                chapterCount = mlDBController.find('MlSubChapters', {chapterId:args.id, isActive:true, _id:subChapterQuery}, context).count();
              }
              query={"clusterId":chapter.clusterId, "chapterId":args.id, isActive:true, "$or":[{"subChapterId":subChapterQuery}, {isDefaultSubChapter:true}]};
          }

          break;
      case "subChapter":
          moduleContext=mlDBController.findOne('MlSubChapters', {_id:args.id}, context).subChapterName;
          let subChapter = mlDBController.findOne('MlSubChapters', {_id:args.id})
          query={"clusterId":subChapter.clusterId, "chapterId":subChapter.chapterId, "subChapterId":args.id, isActive:true};
          break;
      case "community":
          moduleContext="Users"
          query={"communityDefId":args.id, isActive:true};
          break;
      default:
          query={"noSuchQuery":args.id};
  }
  query.isActive=true;

  let response=[];
  const communityData = mlDBController.find('MlCommunityDefinition', { isActive: true, code: { "$nin": ["OFB", "BRW"] } }, context).fetch();

  _.each(communityData,function (item,value) {
      query.communityDefName = item.name;
      query.isApprove=true;

          var queryObj = query;
          var pipeline=[
            { "$match": {"profile.isSystemDefined":{$exists:false}, "profile.isExternaluser":true, 'profile.isActive':true, 'profile.externalUserProfiles':{$elemMatch:queryObj}} },
            { "$unwind" :"$profile.externalUserProfiles" },
            { "$lookup": { from: "mlPortfolioDetails", localField: "profile.externalUserProfiles.profileId", foreignField: "profileId", as: "portfolio" } },
            { "$unwind": { path: "$portfolio", preserveNullAndEmptyArrays: true } },
            { "$match" : {"portfolio.status":"PORT_LIVE_NOW"}},
          ];

          if(query){
              if(query.clusterId && query.chapterId && query.subChapterId){
                  pipeline.push({$match:{"profile.externalUserProfiles.clusterId":query.clusterId, "profile.externalUserProfiles.chapterId":query.chapterId, "profile.externalUserProfiles.subChapterId":query.subChapterId, "profile.externalUserProfiles.communityDefName":query.communityDefName, "profile.externalUserProfiles.isApprove":true, "profile.externalUserProfiles.isActive":true}})
              }
              else if(query.clusterId && query.chapterId && query.$or && !_underscore.isEmpty(_underscore.filter(query.$or, "subChapterId"))){
                  subChapId = _.find(query.$or, "subChapterId").subChapterId;
                  pipeline.push({$match:{"profile.externalUserProfiles.clusterId":query.clusterId, "profile.externalUserProfiles.chapterId":query.chapterId, "profile.externalUserProfiles.subChapterId":subChapId, "profile.externalUserProfiles.communityDefName":query.communityDefName, "profile.externalUserProfiles.isApprove":true, "profile.externalUserProfiles.isActive":true}})
              }
              else if(query.clusterId && query.chapterId){
                  pipeline.push({$match:{"profile.externalUserProfiles.clusterId":query.clusterId, "profile.externalUserProfiles.chapterId":query.chapterId, "profile.externalUserProfiles.communityDefName":query.communityDefName, "profile.externalUserProfiles.isApprove":true, "profile.externalUserProfiles.isActive":true}})
              }
              else if(query.clusterId){
                  pipeline.push({$match:{"profile.externalUserProfiles.clusterId":query.clusterId, "profile.externalUserProfiles.communityDefName":query.communityDefName, "profile.externalUserProfiles.isApprove":true, "profile.externalUserProfiles.isActive":true}})
              }
          }
          let users=mlDBController.aggregate('users',pipeline,context);
          response.push({
            key: item._id,
            count:users.length,
            icon: item.communityImageLink
          })
  });

  let TU = _.map(response, 'count');
  let totalUsers = _.sum(TU);

  response.push({
    key: 'totalUsers',
    count: totalUsers,
    icon: "ml my-ml-browser_5",
    context:moduleContext
  })

  if(args && args.moduleName!="subChapter" && chapterCount>=0){
    response.push({
      key: args.moduleName?args.moduleName:'321',
      count: chapterCount,
      icon: "ml my-ml-chapter"
    })
  }

  const categoryData = getCategoryData(args.moduleName, args.id, query);
  if (categoryData.length)
    response = response.concat(categoryData[0].userCategory);
  return response;
};


/**
 * @function getCategoryData
 * @param {*["cluster", "chapter"]} type
 * @param {*typeId} id
 * @note expected drill down to be only two level
 * @todo {*Accelerator, Incubator, Co-Working Space} $userCategory.userTypeName
 *       need to find in the lowerCase
 */
const getCategoryData = (type, id, query) => {
  // console.log("................", query.subChapterId);
  // typeQuery = { clusterId: id, isActive: true }
  // typeQuery = { chapterId: id, isActive: true }
  // switch (type) {
  //   case "cluster":
  //   case "chapter":
  //     typeQuery = { _id: query.subChapterId, isActive: true }
  //     break;
  //     // typeQuery = { _id: query.subChapterId, isActive: true }
  //     // break;
  //   default:
  //     return [];
  // }

  let typeQuery = {};

  switch (type) {
    case "cluster":
      typeQuery = { _id: query.subChapterId, isActive: true, clusterId: query.clusterId }
      break;
    case "chapter":
      if (query.$or && query.$or.length>0){
        typeQuery._id = query.$or[0].subChapterId;
      }
      typeQuery.isActive = true;
      typeQuery.chapterId = query.chapterId;
      break;
      // typeQuery = { _id: query.subChapterId, isActive: true }
      // break;
    default:
      return [];
  }


  const pipeline = [
    { $match: typeQuery },
    { $lookup: { from: "mlUserTypes", localField: "userCategoryId", foreignField: "_id", as: "userCategory" } },
    { $unwind: { path: "$userCategory", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        "$and": [
          { "userCategory.isActive": true },
        ]
      }
    },
    {
      "$group": {
        _id: null,
        accelerator: {
          $sum: { $cond: [{ $eq: ["$userCategory.userTypeName", "Accelerator"] }, 1, 0] }
        },
        incubator: {
          $sum: { $cond: [{ $eq: ["$userCategory.userTypeName", "Incubator"] }, 1, 0] }
        },
        co_working: {
          $sum: { $cond: [{ $eq: ["$userCategory.userTypeName", "Co-Working Space"] }, 1, 0] }
        }
      }
    },
    {
      $addFields: {
        userCategory: [
          { key: "accelerator", count: "$accelerator", icon: "ml my-ml-acce" },
          { key: "incubator", count: "$incubator", icon: "ml my-ml-incu" },
          { key: "co_working", count: "$co_working", icon: "ml my-ml-cowor" }]
      }
    },
    { $project: { userCategory: 1 } }
  ];

  const data = mlDBController.aggregate('MlSubChapters', pipeline);
  const emptyCategoryAry = [{
    userCategory: [
      { key: "accelerator", count: 0, icon: "ml my-ml-acce" },
      { key: "incubator", count: 0, icon: "ml my-ml-incu" },
      { key: "co_working", count: 0, icon: "ml my-ml-cowor" }]
  }]
  return data.length ? data : emptyCategoryAry;
}
