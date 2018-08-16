import MlRespPayload from "../../../commons/mlPayload";
export default MlRegistrationPreCondition = class MlRegistrationPreCondition{

  static  validateCommunity(regDetails,regId) {
    let isActiveCommunity=true;
    let response=null;
    let subChapterId=null,registrationType=null,clusterId=null,chapterId=null;
    //if its step1 and changes are for the regDetails
    if(regDetails){
      subChapterId=regDetails.subChapterId;
      clusterId=regDetails.clusterId;
      chapterId=regDetails.chapterId;
      registrationType=regDetails.registrationType;
    }else{
      let regRecord = mlDBController.findOne('MlRegistration', {_id: regId}, {})||{};
      registrationType=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.registrationType:null;
      subChapterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.subChapterId:null;
      clusterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.clusterId:null;
      chapterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.chapterId:null;
    }

    /**validating true if community is BROWSER or OFFICE BEARER*/
    if(!registrationType||registrationType&&(registrationType==="BRW" || registrationType==="OFB")){
      return {'isValid':true};
    }

    //check community access is active at platform
    var platformCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":4, "communityDefCode":registrationType,isActive:true}, {});
      if(!platformCommunity){
        let code = 401;
        response = new MlRespPayload().errorPayload("Community is not active", code);
        return {'isValid':false,'validationResponse':response};
      }

    //check community access is active at cluster
    if(isActiveCommunity&&clusterId){
      var clusterCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":3,"clusterId":clusterId, "communityDefCode":registrationType,isActive:true}, {});
      if(!clusterCommunity){
        let code = 401;
        response = new MlRespPayload().errorPayload("Community not available for cluster", code);
        return {'isValid':false,'validationResponse':response};
      }
    }
    //check community access is active at chapter
    if(isActiveCommunity&&chapterId){
      var communityDetails = mlDBController.findOne('MlCommunityAccess', {"$and":[{chapterId: chapterId, communityDefCode:registrationType, "isActive":true}]}, {});
      if(!communityDetails){
        let code = 401;
        response = new MlRespPayload().errorPayload("Community not available for chapter", code);
        return {'isValid':false,'validationResponse':response};
      }
    }

    //check community access is active at subChapter
    if(isActiveCommunity&&chapterId&&subChapterId){
      var communityDetails = mlDBController.findOne('MlCommunityAccess', {"$and":[{subChapterId: subChapterId, communityDefCode:registrationType, "isActive":true}]}, {});
      if(!communityDetails){
        let code = 401;
        response = new MlRespPayload().errorPayload("Community not available for subchapter", code);
        return {'isValid':false,'validationResponse':response};
      }
    }

    return {'isValid':true};
  }

  static validateOFBCommunity(regDetails){
    var registrationType=(regDetails||{}).registrationType;
    if(registrationType&&registrationType==='OFB'){
      let code = 401;
      response = new MlRespPayload().errorPayload("Community not available for registration", code);
      return {'isValid':false,'validationResponse':response};
    }
    return {'isValid':true};
  }

  static  validateActiveCommunity(regId,regDetails) {
    let isActiveCommunity=true;
    let response=null;
    let subChapterId=null,registrationType=null,clusterId=null,chapterId=null;
    //if its step1 and changes are for the regDetails
    if(regDetails){
      subChapterId=regDetails.subChapterId;
      clusterId=regDetails.clusterId;
      chapterId=regDetails.chapterId;
      registrationType=regDetails.registrationType;
    }else{
         let regRecord = mlDBController.findOne('MlRegistration', {_id: regId}, {})||{};
         registrationType=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.registrationType:null;
         subChapterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.subChapterId:null;
         clusterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.clusterId:null;
         chapterId=regRecord&&regRecord.registrationInfo?regRecord.registrationInfo.chapterId:null;
    }

    if(!registrationType||registrationType&&registrationType==="BRW"){
      return {'isValid':true};
    }

    //check community access is active at platform
    var platformCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":4, "communityDefCode":registrationType,isActive:true}, {});
    if(!platformCommunity)isActiveCommunity=false;

    //check community access is active at cluster
    if(isActiveCommunity&&clusterId){
      var clusterCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":3,"clusterId":clusterId, "communityDefCode":registrationType,isActive:true}, {});
      if(!clusterCommunity)isActiveCommunity=false;
    }

    //check community access is active at subChapter
    if(isActiveCommunity&&chapterId&&subChapterId){
    var communityDetails = mlDBController.findOne('MlCommunityAccess', {"$and":[{subChapterId: subChapterId, communityDefCode:registrationType, "isActive":true}]}, {});
    if(!communityDetails)isActiveCommunity=false;
    }

    if(!isActiveCommunity){
      let code = 401;
      response = new MlRespPayload().errorPayload("Community not available for cluster", code);
      return {'isValid':false,'validationResponse':response};
     }
    return {'isValid':true};
  }

/**
 * @function used in the case of [RegisterAs]
 * @param {*payload} registration 
 */
  static validateEmailClusterCommunity(registration) {
   // let clusterInfo=MlClusters.findOne({countryId:args.registration.countryId})
    // var validate = MlRegistration.findOne({"$and":[{"registrationInfo.email":registration.email},{"registrationInfo.clusterId":registration.clusterId},{"registrationInfo.registrationType":registration.registrationType}]})
    var validate = MlRegistration.findOne({
      "registrationInfo.email": registration.email,
      "registrationInfo.clusterId": registration.clusterId,
      "registrationInfo.registrationType": registration.registrationType,
      status: { $nin: ['REG_USER_REJ', 'REG_ADM_REJ'] }
    })
    if(validate){
      let code = 409;
      let message ="Registration Exist"
      let errResp = new MlRespPayload().errorPayload(message, code);
      return {'isValid':false,'validationResponse':errResp};
    }
    return {'isValid':true};
  }

  static  validateEmail(registration) {
    // let clusterInfo=MlClusters.findOne({countryId:args.registration.countryId})
    var validate = MlRegistration.findOne({"registrationInfo.email":registration.email,status: { $nin: [ 'REG_USER_REJ','REG_ADM_REJ' ] }})
    if(validate){
      /* var validate = MlRegistration.findOne({"$and":[{"registrationInfo.email":registration.email},{"registrationInfo.countryId":registration.countryId},{"registrationInfo.registrationType":registration.registrationType}]})
       if(validate){*/
      let code = 409;
      let message ="Registration exists with the Email-Id"
      let errResp = new MlRespPayload().errorPayload(message, code);
      return {'isValid':false,'validationResponse':errResp};
    }
    return {'isValid':true};
  }
  static  validateMobile(registration) {
    var validate = MlRegistration.findOne({"registrationInfo.contactNumber":registration.contactNumber,"status": {$nin: ['REG_ADM_REJ','REG_USER_REJ']}})
    if(validate){
      let code = 409;
      let message ="Registration exists with the mobile number"
      let errResp = new MlRespPayload().errorPayload(message, code);
      return {'isValid':false,'validationResponse':errResp};
    }
    return {'isValid':true};
  }
  static  validateBackEndUserExist(registration) {

    var userExist = mlDBController.findOne('users', {"profile.email":registration.email}, {}) || {};
    if(userExist._id){
      let code = 409;
      let message ="Backend user registered with the same email"
      let errResp = new MlRespPayload().errorPayload(message, code);
      return {'isValid':false,'validationResponse':errResp};
    }
    return {'isValid':true};
  }
  static  validateRegisterAsActiveCommunity(regDetails) {
    let isActiveCommunity=true;
    let response=null;
    let registrationType=null,clusterId=null,countryId=null,countryClusterId=null;

    if(regDetails){
      clusterId=regDetails.clusterId;
      registrationType=regDetails.registrationType;
      countryId=regDetails.countryId;
      let clusterObject = mlDBController.findOne('MlClusters', {"countryId":countryId,isActive:true}, {});
      countryClusterId = clusterObject&&clusterObject._id?clusterObject._id:""
    }

    //check community access is active at platform
    var platformCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":4, "communityDefCode":registrationType,isActive:true}, {});
    if(!platformCommunity)isActiveCommunity=false;

    //check community access is active at cluster
    if(isActiveCommunity&&clusterId){
      var clusterCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":3,"clusterId":clusterId, "communityDefCode":registrationType,isActive:true}, {});
      if(!clusterCommunity)isActiveCommunity=false;
    }

    //check comunity access is active at country
    if(isActiveCommunity&&countryClusterId){
      var countryCommunity = mlDBController.findOne('MlCommunityAccess', {"hierarchyLevel":3,"clusterId":countryClusterId, "communityDefCode":registrationType,isActive:true}, {});
      if(!countryCommunity)isActiveCommunity=false;
    }

    if(!isActiveCommunity){
      let code = 401;
      response = new MlRespPayload().errorPayload("Community not available for cluster", code);
      return {'isValid':false,'validationResponse':response};
    }
    return {'isValid':true};
  }

  /**
   * Method :: validateEmailVerification
   * Desc   :: checks if email is verified
   * @param registerDetails :: Object ::Registration Object
   * @returns  {Object}
   */
  static validateEmailVerification(registerDetails) {
    if (registerDetails && registerDetails.emails && registerDetails.emails.length > 0) {
      let email = registerDetails.emails;
      let emailVerified = _.find(email, function (mail) {
        return mail.verified == true
      });

      if(emailVerified){
            return {'isValid':true};
      }
      let response = new MlRespPayload().errorPayload("User has not yet verified his/her email-Id", 556);
      return {'isValid':false,'validationResponse':response};
    }else{/** if email does not exist,return response*/
    let response = new MlRespPayload().errorPayload("Atleast one email-Id is required for registration",556);
      return {'isValid':false,'validationResponse':response};
    }
  }
  /**
   * @params registration object from client
   * @return isValid
   * */
  static checkDuplicateContactNumber(regDetails) {
    var checkNumber = mlDBController.findOne('MlRegistration', {
      "registrationInfo.userName": {$ne: regDetails.userName},
      "registrationInfo.contactNumber": regDetails.contactNumber,
       "status": {$nin: ['REG_ADM_REJ', 'REG_USER_REJ', 'REG_USER_APR']}
    })
    if (checkNumber) {
      var response = new MlRespPayload().errorPayload("This contact number has already been used for a registration", 409);
      return {isValid: false, validationResponse: response}
    } else
      return {isValid: true};
  }

  static checkActiveOfficeBearer(regData) {
    var response = false
    var isOFB = mlDBController.findOne('MlRegistration', {
      "registrationInfo.email": regData.registration.email,
      'registrationInfo.communityDefCode': 'OFB'
    })
    var isOFBMember = mlDBController.findOne('MlOfficeMembers', {
      "emailId": regData.registration.email,
      "communityType": "OFB",
      isActive: true
    })
    if (isOFB && isOFBMember)
      response = true
    return response
  }

  static isUserCanUpdate(regDetails, context) {
    var user = mlDBController.findOne('users', {_id: context.userId})
    if (user && user.profile && !user.profile.isInternaluser) {
      if (regDetails.status === "REG_USER_APR" || regDetails.status ==="REG_ADM_REJ" || regDetails.status ==="REG_USER_REJ") {
        var response = new MlRespPayload().errorPayload("Registration details could not be updated. Please contact your moolya admin.", 409);
        return {isValid: false, validationResponse: response}
      } else {
        return {isValid: true};
      }
    } else
      return {isValid: true};
  }
}
