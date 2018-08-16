
/**
 * Created by mohammed.mohasin on 30/04/17.
 */
import _ from 'lodash';
import MlStatusRepo from '../../../commons/mlStatus';
import MlRegistrationPreCondition from "./registrationPreConditions";
class MlRegistrationRepo{

  constructor(){
    if(!MlRegistrationRepo.instance){
      MlRegistrationRepo.instance = this;
    }
      return MlRegistrationRepo.instance;
  }

  updateStatus(request,code,module){
    return MlStatusRepo.updateStatus(request,code,module);
  }

  updateEmailStatus(reg){
    var registration=reg||{};
    var validation=MlRegistrationPreCondition.validateEmailVerification(registration);
    if(validation.isValid){
        this.updateStatus(registration,'REG_EMAIL_P');
    }else{
      this.updateStatus(registration,'REG_EMAIL_V');
    }
    return registration;
  }

/**
 *@param regId
 *This method updates the email/mobile number verification details of external user for the registration.
 *User will have multiple profiles but the primary verification details will be verified only once.
 **/
  updateUserVerificationDetails(regId,type,context){
    var  regDetails= mlDBController.findOne('MlRegistration',regId, context) || {};
    var updatedCount=0;

    if(regDetails){
       var userName=regDetails.registrationInfo.email;
      var  emailVerificationTokens=null;
      var emails=null;
      var emailRec=null;
      var otps=null;
      var otpRec=null;
      var mobileNumber=null;
      switch(type){

        case 'email':
           emailVerificationTokens=regDetails&&regDetails.services&&regDetails.services.email&&regDetails.services.email.verificationTokens?regDetails.services.email.verificationTokens:[];
           emails=regDetails&&regDetails.emails?regDetails.emails:[];
           emailRec = _.find(emails || [], function (e) {
            return e.address==userName;
          });
          /**verify the email of user if its not verified. its one time activity.*/
           updatedCount=mlDBController.update('users', {username:userName,'emails': {$elemMatch: {'address': userName,'verified':false}}},
            {$set: {'emails.$':emailRec},$push:{'services.email.verificationTokens':emailVerificationTokens}},{'blackbox': true}, context);
          break;

        case "mobileNumber":
           otps=regDetails&&regDetails.otps?regDetails.otps:[];
           mobileNumber=regDetails&&regDetails.registrationInfo&&regDetails.registrationInfo.contactNumber?regDetails.registrationInfo.contactNumber:null;
          /**User mobile number verification should be based on email and mobileNumber*/
          /**if user has valid email then check for verified mobileNumber to update the otp
          //Most Important: if user changes the mobileNumber,otps should be cleared.*/
          updatedCount=mlDBController.update('users', {username:userName,'otps': {$elemMatch: {'verified':false}}},
            {$set: {'otps':otps}},{'blackbox': true}, context);
          break;

        case "all":
           emailVerificationTokens=regDetails&&regDetails.services&&regDetails.services.email&&regDetails.services.email.verificationTokens?regDetails.services.email.verificationTokens:[];
           emails=regDetails&&regDetails.emails?regDetails.emails:[];
           mobileNumber=regDetails&&regDetails.registrationInfo&&regDetails.registrationInfo.contactNumber?regDetails.registrationInfo.contactNumber:null;
           otps=regDetails&&regDetails.otps?regDetails.otps:[];
          /**fetch the email of user from emails array*/
           emailRec = _.find(emails || [], function (e) {
            return e.address==userName;
          });

          /**fetch the verified otp of user from otps array*/
          otpRec = _.find(otps || [], function (e) {
            return e.verified==true;
          });

          mlDBController.update('users', {username:userName,'emails': {$elemMatch: {'address': userName,'verified':false}}},
            {$set: {'emails.$':emailRec},$push:{'services.email.verificationTokens':emailVerificationTokens}},{'blackbox': true}, context);

          mlDBController.update('users', {username:userName,'mobileNumbers': {$elemMatch: {'mobileNumber':mobileNumber,'verified':false}}},
            {$set: {'mobileNumbers.$.verified':(otpRec||{}).verified||false}},{'blackbox': true}, context);

          break;

    }
      return updatedCount;

    }

}

  updateExternalProfileInfo(regId,type,context){
    var  regDetails= mlDBController.findOne('MlRegistration',regId, context) || {};
    var  user= mlDBController.findOne('users',{'profile.externalUserProfiles':{$elemMatch: {'registrationId': regId}}}, context) || {};
    let userExternalProfile = user.profile&&user.profile.externalUserProfiles?user.profile.externalUserProfiles:[]
    var exProfile = _.find(userExternalProfile, {'registrationId': regId});
    var updatedCount=0;
    if(regDetails){
     // orderNumberGenService.generateProfileId(regDetails)
      var info = {
        clusterId          : exProfile.clusterId,
        registrationId     : exProfile.registrationId,
        profileId          : exProfile.profileId,
        socialLinksInfo    : regDetails.socialLinksInfo,
        addressInfo        : regDetails.addressInfo,
        emailInfo          : regDetails.emailInfo,
        contactInfo        : regDetails.contactInfo,
        kycDocuments       : regDetails.kycDocuments
      }
      let user = mlDBController.findOne('users', {"profile.externalUserProfiles.registrationId": {"$in": [regId]}}, context);
      let profileInfo = [];
      // if(user.profile.externalUserAdditionalInfo){
      //   let existingRecords = user.profile.externalUserAdditionalInfo
      //   existingRecords.map(function (oldRecord) {
      //     profileInfo.push(oldRecord)
      //   })
      //   profileInfo.push(info)
      // }

      if(user.profile.externalUserAdditionalInfo && user.profile.externalUserAdditionalInfo.length){
        let originalInfo = user.profile.externalUserAdditionalInfo;

        let isNewInfo = 1;
        originalInfo = _.map(originalInfo, function(infoObj){
          if(infoObj && (infoObj.registrationId === info.registrationId)){
            isNewInfo = 0;
            return info;
          }
          else 
            return infoObj;
        });
        profileInfo = _.compact(originalInfo);
        if(isNewInfo){
          profileInfo.push(info)
        }
      }else{
        profileInfo.push(info)
      }

      let resp = mlDBController.update('users', {_id:user._id}, {"profile.isActive":true,"profile.externalUserAdditionalInfo": profileInfo}, {$set:true}, context)
      console.log(resp);
    }
  }
  ApproveExternalProfileInfo(regId,type,context) {
    result = mlDBController.update('users', {'profile.externalUserProfiles':{$elemMatch: {'registrationId': regId}}},
      {"profile.externalUserProfiles.$.isApprove": true}, {$set: true}, context);
  }

  /**
   * creating the registration for moolya in case of
   * 1) non-moolya subchapter
   * 2) transact with moolya enabled
   * 13-09-2017 ( Discussed with Suresh)
   *      1) Auto Approve the hard-registration for default subchapter and clone the registration/portfolio
   *      2) This is triggered once the non-moolya registration and portfolio is approved
   * */
  createRegistrationProxy(registrationId, context) {
    //check the condition if canTransact is enabled in moolya then only follow the steps
    var registrationDetails = mlDBController.findOne('MlRegistration', {_id: registrationId}) || {}
    registrationDetails = _.omit(registrationDetails, '_id')
    var subChapterId = registrationDetails.registrationInfo && registrationDetails.registrationInfo.subChapterId ? registrationDetails.registrationInfo.subChapterId : ''
    var subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: subChapterId}) || {}
    var resp = null
    if (subChapterDetails && !subChapterDetails.isDefaultSubChapter) {
      var defaultSubChapter = mlDBController.findOne('MlSubChapters', {
        clusterId: subChapterDetails.clusterId,
        chapterId: subChapterDetails.chapterId,
        isDefaultSubChapter: true
      })
      registrationDetails.status = "Yet To Start"
      let regInfo = registrationDetails.registrationInfo
      var isRegister = mlDBController.findOne('MlRegistration', {
        "registrationInfo.clusterId": regInfo.clusterId,
        "registrationInfo.chapterId": regInfo.chapterId,
        "registrationInfo.subChapterId": defaultSubChapter._id,
        "registrationInfo.userId": regInfo.userId
      })
      if (!isRegister && regInfo.userId) {
        regInfo.registrationDate = new Date()
        regInfo.subChapterId = defaultSubChapter._id
        regInfo.subChapterName = defaultSubChapter.subChapterName
        orderNumberGenService.assignRegistrationId(regInfo)
        registrationDetails.transactionId = regInfo.registrationId
        registrationDetails.registrationInfo = regInfo
        resp = mlDBController.insert('MlRegistration', registrationDetails, context)
        return resp
      }
    }
  }

  /**
   * @func createPayloadForPortfolio()
   * @desc creating the payload for portfolio
   *       1) if the communityCode is {*INS} removing the {*null} values 
   *          under the condition of subdomain as we can not save the null value under subDomain
   * @param {*object} regRecord 
   * @return {*object}
   */
  createPayloadForPortfolio(regRecord) {   //communityCode
    let portfolioPayload = {
      "transactionType": "portfolio",
      "communityType": regRecord.registrationInfo.communityDefName,
      "communityCode": regRecord.registrationInfo.communityDefCode,
      "clusterId": regRecord.registrationInfo.clusterId,
      "chapterId": regRecord.registrationInfo.chapterId,
      "subChapterId": regRecord.registrationInfo.subChapterId,
      "communityId": regRecord.registrationInfo.communityId,
      "createdAt": new Date(),
      "source": "self",
      "createdBy": "admin",
      "status": "REG_PORT_KICKOFF",
      "isPublic": false,
      "isGoLive": false,
      "isActive": false,
      "portfolioUserName": regRecord.registrationInfo.userName,
      "userId": regRecord.registrationInfo.userId,
      "userType": regRecord.registrationInfo.userType,
      contactNumber: regRecord.registrationInfo.contactNumber,
      accountType: regRecord.registrationInfo.accountType,
      registrationId: regRecord._id,
      clusterName: regRecord.registrationInfo.clusterName,
      chapterName: regRecord.registrationInfo.chapterName,
      subChapterName: regRecord.registrationInfo.subChapterName,
      communityName: regRecord.registrationInfo.communityName,
      identityType: regRecord.registrationInfo.identityType,
      industryId: regRecord.registrationInfo.industry,
      subDomainId: regRecord && regRecord.registrationDetails && regRecord.registrationDetails.subDomain ? regRecord.registrationDetails.subDomain : null,
      professionId: regRecord.registrationInfo.profession,
      gender: regRecord.registrationDetails.gender,
      employmentStatus: regRecord.registrationDetails.employmentStatus,
      businessType: regRecord && regRecord.registrationDetails && regRecord.registrationDetails.businessType ? regRecord.registrationDetails.businessType : null,
      stageOfCompany: regRecord && regRecord.registrationDetails && regRecord.registrationDetails.stageOfCompany ? regRecord.registrationDetails.stageOfCompany : null,
      transactionCreatedDate: new Date()
    }
    if (portfolioPayload.communityCode === 'INS')
      Object.keys(portfolioPayload).forEach((key) => (portfolioPayload[key] == null) && delete portfolioPayload[key]);
    return portfolioPayload;
  }
}
const mlRegistrationRepo = new MlRegistrationRepo();
Object.freeze(mlRegistrationRepo);

export default mlRegistrationRepo;

