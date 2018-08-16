/**
 * Created by venkatasrinag on 6/4/17.
 */
import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import MlUserContext from "../../../MlExternalUsers/mlUserContext";
import _ from "lodash";
import portfolioValidationRepo from "./portfolioValidation";
import MlEmailNotification from "../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from '../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlSubChapterAccessControl from '../../../mlAuthorization/mlSubChapterAccessControl'
import {getCommunityName} from '../../../commons/utils';
import MlNotificationController from '../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import mlSmsConstants from '../../../mlNotifications/mlSmsNotifications/mlSmsConstants'
import mlRegistrationRepo from "../../admin/registration/mlRegistrationRepo";
import MlSiteMapInsertion from '../../../MlExternalUsers/microSite/microSiteRepo/MlSiteMapInsertion'
import MlSMSNotification from "../../../mlNotifications/mlSmsNotifications/mlSMSNotification"

/**
 * @module [externaluser portfolio Landing]
 * @params [context.userId]
 * */
MlResolver.MlQueryResolver['fetchPortfolioDetailsByUserId'] = (obj, args, context, info) => {
  if (context.userId) {
    let defaultProfile = new MlUserContext(context.userId).userProfileDetails(context.userId)
    if (defaultProfile) {
      var defaultCommunity = defaultProfile.communityDefCode || {};
      var portfolio = MlPortfolioDetails.findOne({$and: [{userId: context.userId}, {communityCode: defaultCommunity}, {profileId: defaultProfile.profileId}]})
      if (portfolio) {
        var data = MlResolver.MlQueryResolver['fetchPortfolioImage'](obj, {portfoliodetailsId: portfolio._id}, context, info);
        portfolio.portfolioImage = data.portfolioImage
        return portfolio;
      }
      else
        console.log("portfolio not found")
    }
  } else {
    console.log("NOt a valid user");
  }
}

/**
 * request for portfolio creation
 * */

MlResolver.MlMutationResolver['createPortfolioRequest'] = (obj, args, context, info) => {
  let user;
  let portfolioDetails = args.portfoliodetails
  let ret;
  let updateRecord = {}
  try {
    if (portfolioDetails && portfolioDetails.userId && portfolioDetails.communityCode) {
      /** introducing profile Id based on registration in portfolio from users and creating portfolio based on profileId*/
      let userDetails = mlDBController.findOne('users', {_id: portfolioDetails.userId}, context)
      if (userDetails && userDetails.profile && userDetails.profile.externalUserProfiles) {
        let reqProfile = _.find(userDetails.profile.externalUserProfiles, {registrationId: portfolioDetails.registrationId})
        portfolioDetails['profileId'] = reqProfile.profileId || ''
      }
      user = MlPortfolioDetails.findOne({"$and": [{'userId': portfolioDetails.userId}, {'communityType': portfolioDetails.communityType}, {profileId: portfolioDetails.profileId}]})
      if (!user || portfolioDetails.communityCode == 'IDE') {
        portfolioDetails['createdAt'] = new Date();
        ret = mlDBController.insert('MlPortfolioDetails', portfolioDetails, context)
        if (ret) {
          //changing status to portfolio kickoff
          mlRegistrationRepo.updateStatus(updateRecord, 'REG_PORT_KICKOFF');
          let updatedResponse = mlDBController.update('MlPortfolioDetails', ret, updateRecord, {$set: true}, context)

          switch (portfolioDetails.communityCode) {
            case "IDE": {
              let ideatorInfo = {}
              let fb = "";
              let linkedIn = "";
              let twitter = "";
              let googleplus = "";
              if (args.registrationInfo && args.registrationInfo.socialLinksInfo && args.registrationInfo.socialLinksInfo.length > 0) {
                _.each(args.registrationInfo.socialLinksInfo, function (link) {
                  if (link.socialLinkTypeName.toLowerCase() == "facebook") {
                    fb = link.socialLinkUrl
                  } else if (link.socialLinkTypeName.toLowerCase() == "linkedin") {
                    linkedIn = link.socialLinkUrl
                  }
                  else if (link.socialLinkTypeName.toLowerCase() == "twitter") {
                    twitter = link.socialLinkUrl
                  }
                  else if (link.socialLinkTypeName.toLowerCase() == "googleplus") {
                    googleplus = link.socialLinkUrl
                  }
                })
              }
              if (args.registrationInfo) {
                ideatorInfo = {
                  firstName: args.registrationInfo.firstName ? args.registrationInfo.firstName : "",
                  lastName: args.registrationInfo.lastName ? args.registrationInfo.lastName : "",
                  emailId: args.registrationInfo.userName ? args.registrationInfo.userName : args.registrationInfo.emailId,
                  gender: args.registrationInfo.gender ? args.registrationInfo.gender : "",
                  dateOfBirth: args.registrationInfo.dateOfBirth ? args.registrationInfo.dateOfBirth : "",
                  qualification: args.registrationInfo.qualification ? args.registrationInfo.qualification : "",
                  employmentStatus: args.registrationInfo.employmentStatus ? args.registrationInfo.employmentStatus : "",
                  professionalTag: args.registrationInfo.professionalTag ? args.registrationInfo.professionalTag : "",
                  yearsofExperience: args.registrationInfo.experience ? args.registrationInfo.experience : "",
                  industry: args.registrationInfo.industry ? args.registrationInfo.industry : "",
                  profession: args.registrationInfo.profession ? args.registrationInfo.profession : "",
                  employerName: args.registrationInfo.employerName ? args.registrationInfo.employerName : "",
                  mobileNumber: args.registrationInfo.contactNumber ? args.registrationInfo.contactNumber : "",
                  facebookId: fb,
                  linkedInId: linkedIn,
                  twitterId: twitter,
                  gplusId: googleplus,
                  profilePic: args.registrationInfo.profileImage ? args.registrationInfo.profileImage : ""
                }
              }

              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret,
                portfolioIdeatorDetails: ideatorInfo
              }
              MlResolver.MlMutationResolver['createIdeatorPortfolio'](obj, portfolio, context, info)
            }
              break;

            case "STU":
              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret
              }
              MlResolver.MlMutationResolver['createStartupPortfolio'](obj, portfolio, context, info)
              break;

            case "FUN": {
              let funderInfo = {}
              let fb = "";
              let linkedIn = "";
              let twitter = "";
              let googleplus = "";
              if (args.registrationInfo && args.registrationInfo.socialLinksInfo && args.registrationInfo.socialLinksInfo.length > 0) {
                _.each(args.registrationInfo.socialLinksInfo, function (link) {
                  if (link.socialLinkTypeName.toLowerCase() == "facebook") {
                    fb = link.socialLinkUrl
                  } else if (link.socialLinkTypeName.toLowerCase() == "linkedin") {
                    linkedIn = link.socialLinkUrl
                  }
                  else if (link.socialLinkTypeName.toLowerCase() == "twitter") {
                    twitter = link.socialLinkUrl
                  }
                  else if (link.socialLinkTypeName.toLowerCase() == "googleplus") {
                    googleplus = link.socialLinkUrl
                  }
                })
              }
              if (args.registrationInfo) {
                funderInfo = {
                  firstName: args.registrationInfo.firstName ? args.registrationInfo.firstName : "",
                  lastName: args.registrationInfo.lastName ? args.registrationInfo.lastName : "",
                  emailId: args.registrationInfo.userName ? args.registrationInfo.userName : "",
                  gender: args.registrationInfo.gender ? args.registrationInfo.gender : "",
                  // dateOfBirth: args.registrationInfo.dateOfBirth ? args.registrationInfo.dateOfBirth : "",
                  qualification: args.registrationInfo.qualification ? args.registrationInfo.qualification : "",
                  employmentStatus: args.registrationInfo.employmentStatus ? args.registrationInfo.employmentStatus : "",
                  professionalTag: args.registrationInfo.professionalTag ? args.registrationInfo.professionalTag : "",
                  yearsofExperience: args.registrationInfo.experience ? args.registrationInfo.experience : "",
                  industry: args.registrationInfo.industry ? args.registrationInfo.industry : "",
                  profession: args.registrationInfo.profession ? args.registrationInfo.profession : "",
                  // employerName: args.registrationInfo.employerName ? args.registrationInfo.employerName : "",
                  mobileNumber: args.registrationInfo.contactNumber ? args.registrationInfo.contactNumber : "",
                  investmentFrom: args.registrationInfo.investingFrom ? args.registrationInfo.investingFrom : "",
                  category: args.portfoliodetails.userType ? args.portfoliodetails.userType : "",

                  // facebookId: fb,
                  // linkedInId: linkedIn,
                  // twitterId: twitter,
                  // gplusId: googleplus,
                  facebookUrl: fb,
                  linkedinUrl: linkedIn,
                  profilePic: args.registrationInfo.profileImage ? args.registrationInfo.profileImage : "",
                  logo: {fileUrl: args.registrationInfo.profileImage ? args.registrationInfo.profileImage : ""}
                }
              }
              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret,
                funderAbout: funderInfo
              }
              MlResolver.MlMutationResolver['createFunderPortfolio'](obj, portfolio, context, info)
            }
              break;
            case "SPS": {
              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret
              }
              MlResolver.MlMutationResolver['createServiceProviderPortfolio'](obj, portfolio, context, info)
              console.log("creating service provider")
            }
            case "CMP": {
              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret
              }
              MlResolver.MlMutationResolver['createCompanyPortfolio'](obj, portfolio, context, info)
            }
              break;
            case "INS": {
              let portfolio = {
                userId: portfolioDetails.userId,
                communityType: portfolioDetails.communityType,
                portfolioDetailsId: ret
              }
              MlResolver.MlMutationResolver['createInstitutionPortfolio'](obj, portfolio, context, info)
              console.log("creating Institutions")
            }
              break;
          }
          //triggered on successfull portfolio creation
          //MlEmailNotification.onPortfolioConfirmation(userDetails);

        }

      }
      else {
        ret = user._id;
      }
    }
  }
  catch (e) {
    let code = 409;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }

  let code = 200;
  let response = new MlRespPayload().successPayload(ret, code);
  return response;
}

MlResolver.MlMutationResolver['updatePortfolio'] = (obj, args, context, info) => {
  let response;
  var privateFields = [];
  let updateRecord = {}
  if (args.portfoliodetailsId) {
    let details = MlPortfolioDetails.findOne({"_id": args.portfoliodetailsId});
    if (details && details.privateFields && details.privateFields.length) {
      privateFields = portfolioValidationRepo.updatePrivateKeys(args.privateFields, args.removeKeys, details.privateFields)
    }
    else {
      privateFields = args.privateFields || [];
    }
    // let detailsUpdate = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, {status: 'WIP', transactionUpdatedDate:new Date()}, {$set:true}, context)
    mlRegistrationRepo.updateStatus(updateRecord, 'REG_PORT_PEND');
    updateRecord.transactionUpdatedDate = new Date();
    var detailsUpdate = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, updateRecord, {$set: true}, context)
    if (privateFields) {
      detailsUpdate = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, {privateFields: privateFields}, {$set: true}, context)
    }
    if (details && detailsUpdate) {
      // switch (details.communityType){
      switch (details.communityCode) {
        case 'IDE': {
          response = MlResolver.MlMutationResolver['updateIdeatorPortfolio'](obj, args, context, info)
        }
          break;

        case "STU": {
          response = MlResolver.MlMutationResolver['updateStartupPortfolio'](obj, args, context, info)
        }
          break;

        case "FUN": {
          response = MlResolver.MlMutationResolver['updateFunderPortfolio'](obj, args, context, info)
        }
          break;
        case "SPS": {
          response = MlResolver.MlMutationResolver['updateServiceProviderPortfolio'](obj, args, context, info)
        }
          break;
        case "CMP": {
          response = MlResolver.MlMutationResolver['updateCompanyPortfolio'](obj, args, context, info)
        }
          break;
        case "INS": {
          response = MlResolver.MlMutationResolver['updateInstitutionPortfolio'](obj, args, context, info)
        }
          break;
      }
    }
  }

  if (response && response.success) {

    if (args.portfoliodetailsId) {
      const details = MlPortfolioDetails.findOne({"_id": args.portfoliodetailsId})
      MlSMSNotification.portfolioUpdate(args.portfoliodetailsId);
      MlEmailNotification.onPortfolioUpdate(details);
      MlNotificationController.onPotfolioUpdate(details);
    }

  }

  return response;
}

/**
 * @params [portfolioId]
 * @usage 1)portfolio approval to go live
 *        2) process-setup if type funder
 * */
MlResolver.MlMutationResolver['approvePortfolio'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let updatedResponse;
    let updateRecord = {lastLiveDate: new Date()}
    let regRecord = mlDBController.findOne('MlPortfolioDetails', {
      _id: args.portfoliodetailsId,
      status: 'PORT_GO_LIVE_PEND',
    }, context) || {}
    if (!_.isEmpty(regRecord)) {
      mlRegistrationRepo.updateStatus(updateRecord, 'PORT_LIVE_NOW');
      let updatedResponse = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, updateRecord, {$set: true}, context)
      //updatedResponse = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, {"status": "PORT_LIVE_NOW", transactionUpdatedDate: new Date()}, {$set: true}, context)
      if (updatedResponse) {
        let user = mlDBController.findOne('users', {_id: regRecord.userId}, context) || {};
        let portfolioObject = _.pick(regRecord, ['userId', 'communityCode', 'clusterId', 'chapterId', 'subChapterId', 'communityId', 'clusterName', 'chapterName', 'subChapterName', 'communityName', 'profileId'])
        let extendObj = {
          "transactionType": "processSetup",
          "dateTime": new Date(),
          "status": "Yet To Start",
          portfolioId: args.portfoliodetailsId,
          "username": regRecord.portfolioUserName,
          "name": (user.profile && user.profile.firstName ? user.profile.firstName : "") + " " + (user.profile && user.profile.lastName ? user.profile.lastName : ""),
          mobileNumber: regRecord.contactNumber,
        }
        let portfolioDetails = _.extend(portfolioObject, extendObj)
        // orderNumberGenService.assignPortfolioId(portfolioDetails)

        /**if community is funder create process transaction by getting portfolio details*/
        if (_.isMatch(regRecord, {communityCode: 'FUN'})) {
          MlResolver.MlMutationResolver['createProcessTransaction'](obj, {
            'portfoliodetails': portfolioDetails,
          }, context, info);
        }

        let code = 200;
        let result = {portfoliodetailsId: updatedResponse}
        let response = new MlRespPayload().successPayload(result, code);
        if (response) {
          const urlFormationObject = {
            clusterName: regRecord.clusterName.replace(/ /g, "-"),
            chapterName: regRecord.chapterName.replace(/ /g, "-"),
            subChapterName: regRecord.subChapterName.replace(/ /g, "-"),
            communityName: regRecord.communityName.replace(/ /g, "-")
          }
          const firstNameUser = user.profile.firstName ? user.profile.firstName : "";
          const lastNameUser = user.profile && user.profile.lastName ? user.profile.lastName : "";
          let uniqueSeoName = firstNameUser + '-' + lastNameUser;
          uniqueSeoName = uniqueSeoName.replace(/ /g, "-");
          let date = new Date();
          let siteMapDetails = {
            userId: regRecord.userId,
            portFolioId: args.portfoliodetailsId,
            priority: 1,
            changeFreq: 'daily',
            uniqueSeoName: uniqueSeoName,
            lastmodISO: date.toISOString()
          }

          MlSiteMapInsertion.mlCreateSEOUrl(siteMapDetails, urlFormationObject);
          MlEmailNotification.portfolioSuccessfullGoLive(user);
          MlNotificationController.onGoLiveRequestApproval(user);
          MlSMSNotification.portfolioGoLiveRequest(args.portfoliodetailsId)
          // if(response && response.success){
          if (response && response.success) {
            var defaultProfile = new MlUserContext().userProfileDetails(portfolioDetails.userId)
            var msg = "Your Go-Live request for " + defaultProfile.communityDefName + " has been approved on" + new Date() + "." + "Login to moolya for next steps."
            // portfolioValidationRepo.sendSMSforPortfolio(args.portfoliodetailsId, msg);
          }
        }
        return response
      } else {
        let code = 401;
        let response = new MlRespPayload().errorPayload("Please validate the user details", code);
        return response;
      }
    } else {
      let code = 401;
      let response = new MlRespPayload().errorPayload("Portfolio not requested for 'go live'", code);
      return response;
    }
  }
}

MlResolver.MlMutationResolver['rejectPortfolio'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let updatedResponse = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, {"status": "Rejected"}, {$set: true}, context)
    if (updatedResponse) {
      let regRecord = mlDBController.findOne('MlPortfolioDetails', {
        _id: args.portfoliodetailsId,
      }, context) || {}
      let user = mlDBController.findOne('users', {_id: regRecord.userId}, context) || {};
      //MlEmailNotification.portfolioGoLiveDecline(user);
      MlNotificationController.onGoLiveRequestDecline(user);
      if (response && response.success) {
        var defaultProfile = new MlUserContext().userProfileDetails(portfolioDetails.userId)
        var msg = "Your Go-Live request for " + defaultProfile.communityDefName + " has been declined on" + new Date() + "." + "Login to moolya for next steps."
        // portfolioValidationRepo.sendSMSforPortfolio(args.portfoliodetailsId, msg);
      }
    }
    return updatedResponse;
  }
}

MlResolver.MlMutationResolver["requestForGoLive"] = (obj, args, context, info) => {
  let details = MlPortfolioDetails.findOne({"_id": args.portfoliodetailsId});
  let updateRecord = {}
  if (details && details.userId == context.userId) {
    try {
      //let status = "Go Live";
      //let ret = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, {status:status}, {$set: true}, context)
      mlRegistrationRepo.updateStatus(updateRecord, 'PORT_GO_LIVE_PEND');
      let ret = mlDBController.update('MlPortfolioDetails', args.portfoliodetailsId, updateRecord, {$set: true}, context)
      if (ret) {
        let code = 200;
        let alert = MlAlertNotification.onGoLiveRequestAdmin()
        MlNotificationController.onGoLiveRequest(details);
        let response = new MlRespPayload().successPayload(alert, code);
        return response;
      }
    } catch (e) {
      let code = 409
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
  }

  let code = 400
  let response = new MlRespPayload().errorPayload("Not Found", code);
  return response;
}


MlResolver.MlMutationResolver['updatePortfolioProfilePic'] = (obj, args, context, info) => {
  if (args.portfolioId && args.communityType) {
    if (args.communityType == "IDE") {
      let updatedResponse = mlDBController.update('MlIdeatorPortfolio', {portfolioDetailsId: args.portfolioId,}, {'portfolioIdeatorDetails.profilePic': args.docUrl}, {$set: true}, context)
      return updatedResponse;
    } else if (args.communityType == "FUN") {
      let updatedResponse = mlDBController.update('MlFunderPortfolio', {portfolioDetailsId: args.portfolioId,}, {'portfolioIdeatorDetails.profilePic': args.docUrl}, {$set: true}, context)
      return updatedResponse;
    } else if (args.communityType == "STU") {
      let updatedResponse = mlDBController.update('MlStartupPortfolio', {portfolioDetailsId: args.portfolioId,}, {'portfolioIdeatorDetails.profilePic': args.docUrl}, {$set: true}, context)
      return updatedResponse;
    }

  }
}

MlResolver.MlMutationResolver['removeIdetaorProfilePic'] = (obj, args, context, info) => {
  let response;
  if (args.portfoliodetailsId) {
    response = MlIdeatorPortfolio.update({portfolioDetailsId: args.portfoliodetailsId}, {$unset: {"portfolioIdeatorDetails.profilePic": ""}}, context)
  }

  return response;
}

/**
 * @moduleUsers left nav
 * @params registrationId
 * @return portfolio details
 * */

MlResolver.MlQueryResolver['fetchPortfolioByReg'] = (obj, args, context, info) => {
  var response = {}
  if (args.registrationId) {
    response = mlDBController.findOne('MlPortfolioDetails', {registrationId: args.registrationId}, context) || {}
    var subChapterId = response ? response.subChapterId : ''
    if (!subChapterId) {
      var registrationDetails = mlDBController.findOne('MlRegistration', {_id: args.registrationId}, context) || {}
      subChapterId = registrationDetails && registrationDetails.registrationInfo && registrationDetails.registrationInfo.subChapterId ? registrationDetails && registrationDetails.registrationInfo && registrationDetails.registrationInfo.subChapterId : ''
    }
    var dataContext = MlSubChapterAccessControl.getAccessControl('VIEW', context, subChapterId, false)
    response.canAccess = dataContext.hasAccess
  }
  return response
}

/**
 * @params portfolioId
 * @moduleUsage[PORTFOLIO && principleTeam in funder portfolio]
 * */
MlResolver.MlQueryResolver['findPortfolioDetails'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlPortfolioDetails.findOne({"_id": args.portfoliodetailsId}) || {}
    var subChapterId = portfolio ? portfolio.subChapterId : ''
    var dataContext = MlSubChapterAccessControl.getAccessControl('VIEW', context, subChapterId, false)
    portfolio.canAccess = dataContext.hasAccess
    return portfolio;
  }
}

MlResolver.MlQueryResolver['fetchPortfolioImage'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    var portfolioImage = ""
    var response = ""
    let portfolio = MlPortfolioDetails.findOne({_id: args.portfoliodetailsId}) || {}
    var defaultProfile = new MlUserContext().userProfileDetails(portfolio.userId)
    switch (portfolio.communityCode) {
      case 'IDE': {
        response = MlResolver.MlQueryResolver['fetchIdeatorPortfolioDetails'](obj, args, context, info) || {}
        portfolioImage = response.profilePic
      }
        break;
      case "STU": {
        args.key = "aboutUs"
        response = MlResolver.MlQueryResolver['fetchStartupDetails'](obj, args, context, info) || {}
        portfolioImage = response && response.aboutUs && response.aboutUs.logo && response.aboutUs.logo.length ? response && response.aboutUs && response.aboutUs.logo[0].fileUrl : ''
      }
        break;
      case "FUN": {
        args.key = "funderAbout"
        response = MlResolver.MlQueryResolver['fetchFunderDetails'](obj, args, context, info) || {}
        portfolioImage = response && response.funderAbout && response.funderAbout.profilePic ? response.funderAbout.profilePic : ''
      }
        break;
      case "SPS": {
        args.key = "about"
        response = MlResolver.MlQueryResolver['fetchServiceProviderDetails'](obj, args, context, info) || {}
        portfolioImage = response && response.about && response.about.aboutImages && response.about.aboutImages.length ? response.about.aboutImages[0].fileUrl : ''
      }
        break;
      case "CMP": {
        args.key = "aboutUs"
        response = MlResolver.MlQueryResolver['fetchCompanyDetails'](obj, args, context, info) || {}
        portfolioImage = response && response.aboutUs && response.aboutUs.logo && response.aboutUs.logo.length ? response.aboutUs.logo[0].fileUrl : ''
      }
        break;
      case "INS": {
        args.key = "aboutUs"
        response = MlResolver.MlQueryResolver['fetchInstitutionDetails'](obj, args, context, info) || {}
        portfolioImage = response && response.aboutUs && response.aboutUs.logo && response.aboutUs.logo.length ? response.aboutUs.logo[0].fileUrl : ''
      }
        break;
    }
    portfolio.portfolioImage = portfolioImage
    portfolio.portfolioUserName = defaultProfile.firstName + ' ' + defaultProfile.lastName
    /**attached first and last name to portfolioUserName*/
    portfolio.communityType = getCommunityName(portfolio.communityCode)
    return portfolio;
  }
}

//todo: // need to merge all conditions of one community in one part only
MlResolver.MlMutationResolver['removePortfolioFileUrl'] = (obj, args, context, info) => {
  let response
  let portfolio = MlPortfolioDetails.findOne({_id: args.portfoliodetailsId}) || {}
  if (args.portfoliodetailsId) {
    switch (portfolio.communityCode) {
      case "STU": {
        if (args.tabName === "data") {
          let startupPortfolioData = MlStartupPortfolio.findOne({portfolioDetailsId: args.portfoliodetailsId}) || {};
          if (startupPortfolioData && startupPortfolioData.data) {
            _.remove(startupPortfolioData.data[args.typeOfData], {fileUrl: args.fileUrl})
            response = mlDBController.update('MlStartupPortfolio', {portfolioDetailsId: args.portfoliodetailsId}, {data: startupPortfolioData.data}, {$set: true}, context)
            return response
          }
        }
      }
        break;
      case "CMP": {
        if (args.tabName === "data") {
          let companyPortfolioData = MlCompanyPortfolio.findOne({portfolioDetailsId: args.portfoliodetailsId}) || {};
          if (companyPortfolioData && companyPortfolioData.data) {
            _.remove(companyPortfolioData.data[args.typeOfData], {fileUrl: args.fileUrl})
            response = mlDBController.update('MlCompanyPortfolio', {portfolioDetailsId: args.portfoliodetailsId}, {data: companyPortfolioData.data}, {$set: true}, context)
            return response
          }
        }
      }
        break;
      case "INS": {
        if (args.tabName === "data") {
          let institutionPortfolioData = MlInstitutionPortfolio.findOne({portfolioDetailsId: args.portfoliodetailsId}) || {};
          if (institutionPortfolioData && institutionPortfolioData.data) {
            _.remove(institutionPortfolioData.data[args.typeOfData], {fileUrl: args.fileUrl})
            response = mlDBController.update('MlInstitutionPortfolio', {portfolioDetailsId: args.portfoliodetailsId}, {data: institutionPortfolioData.data}, {$set: true}, context)
            return response
          }
        }
      }
        break;
      case 'IDE': {
        let ideatorPortfolioData = MlIdeatorPortfolio.findOne({portfolioDetailsId: args.portfoliodetailsId}) || {};
        if (ideatorPortfolioData && ideatorPortfolioData[args.tabName]) {
          _.remove(ideatorPortfolioData[args.tabName][args.typeOfData], {fileUrl: args.fileUrl})
          response = mlDBController.update('MlIdeatorPortfolio', {portfolioDetailsId: args.portfoliodetailsId}, {[args.tabName]: ideatorPortfolioData[args.tabName]}, {$set: true}, context)
          return response
        }
      }
        break;
      default:
        break;
    }
  }
}
