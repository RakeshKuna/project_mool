/**
 * Created by venkatasrinag on 3/4/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import MlUserContext from "../../../../MlExternalUsers/mlUserContext";
import MlAdminUserContext from "../../../../mlAuthorization/mlAdminUserContext";
import portfolioValidationRepo from '../portfolioValidation'
import MlEmailNotification from "../../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from '../../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlNotificationController from '../../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import mlRegistrationRepo from "../../registration/mlRegistrationRepo";
var _ = require('lodash')

MlResolver.MlMutationResolver['createIdeatorPortfolio'] = (obj, args, context, info) => {
      try {
          if (args && args.userId && args.communityType) {
              // user = MlIdeatorPortfolio.findOne({"$and": [{'userId': args.userId}, {'communityId': args.communityType}]})
            var user = mlDBController.findOne('MlIdeatorPortfolio', {"$and": [{'userId': args.userId}, {'communityId': args.communityType}]}, context)
              if (!user) {
                  // MlIdeatorPortfolio.insert({
                  //   userId: args.userId,
                  //   communityType: args.communityType,
                  //   portfolioDetailsId: args.portfolioDetailsId,
                  //   portfolioIdeatorDetails:args.portfolioIdeatorDetails
                  // })
                mlDBController.insert('MlIdeatorPortfolio', {
                  userId: args.userId,
                  communityType: args.communityType,
                  portfolioDetailsId: args.portfolioDetailsId,
                  portfolioIdeatorDetails: args.portfolioIdeatorDetails
                }, context)
              }
          }
      }catch(e) {

      }
}

MlResolver.MlMutationResolver['updateIdeatorPortfolio'] = (obj, args, context, info) =>
{
    if(args.portfoliodetailsId){
        try {
            let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
            let updateFor = args.portfolio.ideatorPortfolio;
            if (ideatorPortfolio) {
                for (key in updateFor) {
                    if (ideatorPortfolio.hasOwnProperty(key)) {
                      _.mergeWith(ideatorPortfolio[key], updateFor[key], function (objValue, srcValue) {
                        if (_.isArray(objValue)) {
                          return objValue.concat(srcValue);
                        }
                      });
                    }
                    else {
                      ideatorPortfolio[key] = updateFor[key];
                    }
                }

                // let ret = MlIdeatorPortfolio.update({"portfolioDetailsId": args.portfoliodetailsId}, {$set: ideatorPortfolio})
              let ret = mlDBController.update('MlIdeatorPortfolio', {"portfolioDetailsId": args.portfoliodetailsId}, ideatorPortfolio, {$set: true}, context)
              if (ret) {
                      // let details = MlPortfolioDetails.findOne({"_id":args.portfoliodetailsId})
                      // MlEmailNotification.onPortfolioUpdate(details);
                      // MlNotificationController.onPotfolioUpdate(details);
                      let ideatoralert =  MlAlertNotification.onPortfolioUpdates()
                      let code = 200;
                      let response = new MlRespPayload().successPayload(ideatoralert, code);
                      return response;
              }
            }
        }
        catch (e){
            let code = 400;
            let response = new MlRespPayload().errorPayload(e.message, code);
            return response;
        }
    }
}

MlResolver.MlMutationResolver['createAnnotation'] = (obj, args, context, info) => {
    try {
      let userDetails = Meteor.users.findOne({_id:context.userId});
        if(args.portfoliodetailsId && args.docId && args.quote && context.userId){
          let annotator = {
            portfolioId:args.portfoliodetailsId,
            referenceDocId:args.docId,
            quote:args.quote,
            userId:context.userId,
            userName:userDetails.username,
            isResolved:false,
            isReopened:false,
            createdAt: new Date()
          }
          MlAnnotator.insert({...annotator})
        }
        else{
            let code = 400;
            let response = new MlRespPayload().errorPayload("Invalid 'Portfolio ID'", code);
            return response;
        }
    }catch (e){
        let code = 400;
        let response = new MlRespPayload().errorPayload(e.message, code);
        return response;
    }

    let code = 200;
    let response = new MlRespPayload().successPayload("Annotator created successfully", code);
    return response;
}

MlResolver.MlMutationResolver['updateAnnotation'] = (obj, args, context, info) => {
}

MlResolver.MlMutationResolver['createComment'] = (obj, args, context, info) => {
    let userDetails = Meteor.users.findOne({_id:context.userId});
    try {
        if(args.portfolioId && args.annotatorId && args.comment && context.userId){
          var isInternal=userDetails.profile.isInternaluser
          if(isInternal){
            var intFirstName=userDetails.profile.InternalUprofile.moolyaProfile.firstName?userDetails.profile.InternalUprofile.moolyaProfile.firstName:''
            var intLastName=userDetails.profile.InternalUprofile.moolyaProfile.lastName?userDetails.profile.InternalUprofile.moolyaProfile.lastName:''
          }
            let comment = {
                              annotatorId:args.annotatorId,
                              portfolioId:args.portfolioId,
                              comment:args.comment,
                              quote:args.quote,
                              userId:context.userId,
                              userName:userDetails.username,
                              // isResolved:false,
                              // isReopened:false,
                              firstName:userDetails.profile.firstName?userDetails.profile.firstName:intFirstName,
                              lastName:userDetails.profile.lastName?userDetails.profile.lastName:intLastName,
                              createdAt: new Date()
                          }
            MlAnnotatorComments.insert({...comment})
        }
        else{
           let code = 400;
           let response = new MlRespPayload().errorPayload("Invalid 'Portfolio ID'", code);
           return response;
        }
    }catch (e){
        let code = 400;
        let response = new MlRespPayload().errorPayload(e.message, code);
        return response;
    }

    let code = 200;
    let response = new MlRespPayload().successPayload("Annotator created successfully", code);
    return response;
}

MlResolver.MlMutationResolver['resolveComment'] = (obj, args, context, info) => {
  if (args.commentId) {
    let id = MlAnnotator.update(args.commentId, {$set:  {isResolved:true}});
    if(id){
      let code = 200;
      let response = new MlRespPayload().successPayload("Comment Resolved", code);
      return response;
    }
  }
}

MlResolver.MlMutationResolver['reopenComment'] = (obj, args, context, info) => {
  if (args.commentId) {
    let id = MlAnnotator.update(args.commentId, {$set:  {isReopened:true}});
    if(id){
      let code = 200;
      let response = new MlRespPayload().successPayload("Comment Re-Opened", code);
      return response;
    }
  }
}

MlResolver.MlQueryResolver['fetchAnnotations'] = (obj, args, context, info) => {
    let annotators = [];
    try {
        if(args.portfoliodetailsId && args.docId){
            let annotatorObj = MlAnnotator.find({"$and":[{"portfolioId":args.portfoliodetailsId, "referenceDocId":args.docId}]}).fetch()
            var firstName='';var lastName='';var profileImage = ''
            if(annotatorObj.length > 0){
                _.each(annotatorObj, function (value) {
                      let quote = JSON.parse(value['quote'])
                      //var user = Meteor.users.findOne({_id:value.userId});
                      var user = mlDBController.findOne('users', {_id: value.userId})
                      if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {
                        firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
                        lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
                        profileImage=user.profile&&user.profile.profileImage?user.profile.profileImage:''
                      }else if(user&&user.profile&&user.profile.isExternaluser){
                        firstName=(user.profile || {}).firstName||'';
                        lastName =(user.profile || {}).lastName||'';
                        profileImage=user.profile&&user.profile.profileImage?user.profile.profileImage:''
                      }
                    let details = new MlAdminUserContext().userProfileDetails(value.userId)||{};
                      annotators.push({annotatorId:value._id, quote:quote,userName: firstName +' '+ lastName,createdAt:value.createdAt,roleName:details.roleName,profileImage:profileImage})
                })
            }
        }
        else{
          let code = 400;
          let response = new MlRespPayload().errorPayload("Invalid 'Portfolio ID'", code);
          return response;
        }
      }catch (e){
        let code = 400;
        let response = new MlRespPayload().errorPayload(e.message, code);
        return response;
    }

    let code = 200;
    let response = new MlRespPayload().successPayload(annotators, code);
    return response;
}

MlResolver.MlQueryResolver['fetchComments'] = (obj, args, context, info) => {
  let comments = [];
  try {
    if (args.annotationId) {
      let response = MlAnnotatorComments.find({"annotatorId": args.annotationId}).fetch()
      _.each(response, function (say, value) {
        say.profileImage = Meteor.users.findOne({_id: say.userId}).profile ? Meteor.users.findOne({_id: say.userId}).profile.profileImage : ''
      })
      return response
    }
    else {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Invalid 'Portfolio ID'", code);
      return response;
    }
  } catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }

  let code = 200;
  let response = new MlRespPayload().successPayload(comments, code);
  return response;
}

MlResolver.MlQueryResolver['fetchIdeatorPortfolioDetails'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('portfolioIdeatorDetails')) {
      let details = ideatorPortfolio.portfolioIdeatorDetails
      let extendData = MlProfessions.findOne({_id: details.profession, industryId: details.industry})|| {};
      details.industry = extendData.industryName || details.industry;
      details.profession = extendData.professionName ||  details.profession;
     // let userPersonal = MlMasterSettings.findOne({_id:details.gender}) || {}
    //  details.gender = userPersonal.genderInfo ? userPersonal.genderInfo.genderName : ''
      let userEmp = MlMasterSettings.findOne({_id:details.employmentStatus}) || {}
      details.employmentStatus = userEmp.employmentTypeInfo ? userEmp.employmentTypeInfo.employmentName :  details.employmentStatus

      var object = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, details, context, "portfolioIdeatorDetails");

      //for view action
      MlResolver.MlMutationResolver['createView'](obj,{resourceId:args.portfoliodetailsId,resourceType:'portfolio'}, context, info);
      return object;
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchIdeatorPortfolioIdeas'] = (obj, args, context, info) => {
  if(args.ideaId){
    let idea = MlIdeas.findOne({"_id": args.ideaId})
    if(!idea)
      return {};
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(idea.portfolioId, idea, context, "ideas");
    return filteredObject;
  }

  return {};
}
MlResolver.MlQueryResolver['fetchIdeatorPortfolioProblemsAndSolutions'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('problemSolution')) {
      var problemSoultion = ideatorPortfolio['problemSolution'];
      if(ideatorPortfolio['problemSolution'].isProblemPrivate){
        problemSoultion = _.omit(ideatorPortfolio['problemSolution'], "problemStatement");
      }
      return problemSoultion;
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchIdeatorPortfolioAudience'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('audience')) {
      return ideatorPortfolio['audience'];
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchIdeatorPortfolioLibrary'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('library')) {
      return ideatorPortfolio['library'];
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchIdeatorPortfolioStrategyAndPlanning'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('strategyAndPlanning')) {
      return ideatorPortfolio['strategyAndPlanning'];
    }
  }

  return {};
}
// MlResolver.MlQueryResolver['fetchIdeatorPortfolioLookingFor'] = (obj, args, context, info) => {
//   if(args.portfoliodetailsId){
//     let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
//     if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('lookingFor')) {
//       return ideatorPortfolio['lookingFor'];
//     }
//   }
//
//   return {};
// }

MlResolver.MlQueryResolver['fetchIdeatorPortfolioIntellectualPlanning'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    let ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty('intellectualPlanning')) {
      return ideatorPortfolio['intellectualPlanning'];
    }
  }

  return {};
}


MlResolver.MlQueryResolver['fetchIdeatorPortfolioRequests'] = (obj, args, context, info) => {

}

MlResolver.MlQueryResolver['fetchPortfolioMenu'] = (obj, args, context, info) => {
    return MlPortfolioMenu.findOne({"$and":[{communityType:args.communityType}, {templateName:args.templateName}]});
}



MlResolver.MlMutationResolver['createIdea'] = (obj, args, context, info) => {
    let portfolioId = ""
    let  user = {}
    let updateRecord = {}
    if(args && args.idea){
        try{
            let idea = args.idea;
            let isCreatePortfolioRequest = true;
            if(!context.userId){
                let code = 400;
                let response = new MlRespPayload().errorPayload("Invalid user", code);
                return response;
            }

            let profile = new MlUserContext(context.userId).userProfileDetails(context.userId)
            if(!profile){
                let code = 400;
                let response = new MlRespPayload().errorPayload("No profile found", code);
                return response;
            }

            let pfDetails = MlPortfolioDetails.find({"$and": [{'userId': context.userId}, {'communityType': profile.communityDefName}, {'clusterId':profile.clusterId}]}).fetch();
            if(pfDetails.length == 1){
                portfolioId = pfDetails[0]._id;
                let ideas = MlIdeas.findOne({"portfolioId":portfolioId})
                if(!ideas){
                  idea.portfolioId = portfolioId;
                  isCreatePortfolioRequest = false
                }
            }
            if(isCreatePortfolioRequest) {
                let regRecord = mlDBController.findOne('MlRegistration', {_id: profile.registrationId, status: "REG_USER_APR"}, context) //|| {"registrationInfo": {}};
                let createdName
                if(Meteor.users.findOne({_id : context.userId}))
                {
                  createdName = Meteor.users.findOne({_id: context.userId}).username
                }
                if(regRecord){
                  let portfolioDetails={
                    "transactionType" : "portfolio",
                    "communityType" : regRecord.registrationInfo.communityDefName,
                    "communityCode" :regRecord.registrationInfo.communityDefCode,
                    "clusterId" :regRecord.registrationInfo.clusterId,
                    "chapterId" : regRecord.registrationInfo.chapterId,
                    "subChapterId" :regRecord.registrationInfo.subChapterId,
                    "source" : "self",
                    "createdBy" : createdName,
                    "status" : "REG_PORT_KICKOFF",
                    "isPublic": false,
                    "isGoLive" : false,
                    "isActive" : false,
                    "portfolioUserName" : regRecord.registrationInfo.userName,
                    "userId" :context.userId,
                    "userType":regRecord.registrationInfo.userType,
                    contactNumber : regRecord.registrationInfo.contactNumber,
                    accountType   : regRecord.registrationInfo.accountType,
                    registrationId: regRecord._id,
                    clusterName   : regRecord.registrationInfo.clusterName,
                    chapterName   : regRecord.registrationInfo.chapterName,
                    subChapterName: regRecord.registrationInfo.subChapterName,
                    communityName : regRecord.registrationInfo.communityName,
                    identityType  : regRecord.registrationInfo.identityType,
                    industryId    : regRecord.registrationInfo.industry,
                    professionId  : regRecord.registrationInfo.profession,
                  }
                  orderNumberGenService.assignPortfolioId(portfolioDetails)
                  let registrationData = regRecord.registrationDetails;
                  registrationData.contactNumber = regRecord.registrationInfo.contactNumber;
                  registrationData.emailId = regRecord.registrationInfo.userName;
                  registrationData.industry = regRecord.registrationInfo.industry;
                  registrationData.profession = regRecord.registrationInfo.profession;
                  registrationData.profileImage = regRecord.registrationInfo.profileImage;
                  let resp = MlResolver.MlMutationResolver['createPortfolioRequest'] (obj,{'portfoliodetails':portfolioDetails, 'registrationInfo':registrationData},context, info);
                  if(!resp.success){
                    return resp;
                  }
                  idea.portfolioId = resp.result;
                  if(resp&&resp.result){
                    mlRegistrationRepo.updateStatus(updateRecord,'REG_PORT_KICKOFF');
                    let updatedResponse = mlDBController.update('MlPortfolioDetails',resp.result,updateRecord, {$set: true}, context)
                  }
                }else {
                  let code = 400;
                  let response = new MlRespPayload().errorPayload('User is not been approved in hard registration', code);
                  return response;
                }
            }

            idea.userId = context.userId;
            let id = mlDBController.insert('MlIdeas', idea, context)
            if(!id){
                let code = 400;
                let response = new MlRespPayload().errorPayload(e.message, code);
                return response;
            }
        }
        catch (e){
            let code = 400;
            let response = new MlRespPayload().errorPayload(e.message, code);
            return response;
        }

        let code = 200;
        let response = new MlRespPayload().successPayload('Idea created successfully', code);
        return response;
    }
}

// MlResolver.MlMutationResolver['createLibrary'] = (obj, args, context, info) => {
//
//   if (context.url.indexOf("transactions") > 0) {
//     var portfolioDetailsTransactions = mlDBController.findOne('MlPortfolioDetails', {_id: args.detailsInput.userId}, context)
//     if (portfolioDetailsTransactions) {
//       args.detailsInput.userId = portfolioDetailsTransactions.userId;
//       let tempObject = {
//         portfolioId:portfolioDetailsTransactions._id,
//         isPrivate: false
//       }
//       let tempArray= []
//       tempArray.push(tempObject)
//       args.detailsInput.portfolioReference = tempArray;
//       let newPortfolio = mlDBController.insert('MlLibrary', args.detailsInput, context)
//       return newPortfolio
//     }
//   }else if(context.url.indexOf("library") > 0) {
//       args.detailsInput.userId = context.userId;
//       var newPortfolioCollection = mlDBController.insert('MlLibrary', args.detailsInput, context)
//       return newPortfolioCollection
//   }else{
//     let currentProfile = context.url.split("/")
//     let portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile[6]}, context)
//     let tempObject = {
//       portfolioId:portfolioDetails._id,
//       isPrivate: false,
//     }
//     let tempArray= []
//     tempArray.push(tempObject)
//     args.detailsInput.portfolioReference = tempArray;
//     args.detailsInput.userId = context.userId;
//     let newPortfolio = mlDBController.insert('MlLibrary', args.detailsInput, context)
//     return newPortfolio
//   }
//   }
//
//
// MlResolver.MlMutationResolver['updateLibrary'] = (obj, args, context, info) => {
//   let currentProfile = context.url.split("/");
//   let dataExists = false;
//   let portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: context.url.split("/")[6]}, context)
//   var existingCollection = mlDBController.findOne('MlLibrary', {_id:args.id}, context)
//   if(existingCollection) {
//     if(Array.isArray(existingCollection.portfolioReference)) {
//       existingCollection.portfolioReference.map(function (data) {
//         if (Array.isArray(args.files.portfolioReference)) {
//           args.files.portfolioReference.map(function (incoming) {
//             if (data.portfolioId === incoming.portfolioId) {
//               dataExists = true;
//             }
//           })
//         }
//       })
//     }
//     if(dataExists){
//       let code = 20
//       let response = new MlRespPayload().errorPayload('File already exists', code);
//       return response
//     }
//   }
//   if(args.files.portfolioReference){
//     if(args.files.portfolioReference.portfolioId ===portfolioDetails._id){
//       let code = 20
//       let response = new MlRespPayload().errorPayload(ret, code);
//       return response;
//     }else{
//       let tempObject = {
//         portfolioId:portfolioDetails._id,
//         isPrivate: false
//       }
//       args.files.portfolioReference.push(tempObject)
//     }
//   }else {
//     let tempObject = {
//       portfolioId: portfolioDetails._id,
//       isPrivate: false
//     }
//     let tempArray = []
//     tempArray.push(tempObject)
//     args.files.portfolioReference = tempArray;
//   }
//   // var existingCollection = mlDBController.findOne('MlLibrary', {_id:args.id}, context)
//   // if(existingCollection){
//   //   existingCollection.portfolioReference.map(function(data){
//   //     if(data.portfolioId){
//   //
//   //     }
//   //   })
//     if(!dataExists){
//       var newCollection = mlDBController.update('MlLibrary', {_id:args.id},args.files,{$set:1}, context)
//       return newCollection
//     }
// }
//
//
// MlResolver.MlQueryResolver['fetchLibrary'] = (obj, args, context, info) => {
//   if(context.url.indexOf("transactions") > 0) {
//     let currentProfile = context.url.split("/")
//     let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [7]}, context)
//     var libraryData = mlDBController.find('MlLibrary', { isActive: true, 'portfolioReference.portfolioId': portfolio._id}, context).fetch();
//     return libraryData;
//     }
//   else if(context.url.indexOf("portfolio") > 0){
//     let currentProfile = context.url;
//     let splitArray = [];
//     if (currentProfile) {
//       splitArray = currentProfile.split("/");
//     }
//     let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: splitArray[6]}, context)
//     var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true, 'portfolioReference.portfolioId': splitArray[6]}, context).fetch();
//     return libraryData;
//   }
//   else if (!args.userId) {
//     var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true}, context).fetch();
//     return libraryData;
//   }else {
//         var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.userId}, context)
//         if (portfolioDetails) {
//           let portfolioId ;
//           let currentProfile = context.url.split("/")
//           if(context.url.split("/")[4] === 'explore'){
//             portfolioId = context.url.split("/")[6];
//           }else{
//             portfolioId = context.url.split("/")[5];
//           }
//           args.userId = portfolioDetails.userId;
//           var query = {
//             userId: args.userId,
//             isActive: true,
//             'portfolioReference.portfolioId': portfolioId,
//             'portfolioReference.isPrivate': false
//           }
//           var libraryDataOthers = mlDBController.find('MlLibrary', query, context).fetch();
//           return libraryDataOthers;
//         }
//       }
//   }
//
//
//   MlResolver.MlQueryResolver['fetchDataFromCentralLibrary'] = (obj, args, context, info) => {
//     var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true, inCentralLibrary: true}, context).fetch();
//   return libraryData;
//   }
//
//
//   MlResolver.MlMutationResolver['updateLibraryData'] = (obj, args, context, info) => {
//   if(context.url.indexOf("transactions") > 0) {
//     let currentProfile = context.url.split("/")
//     let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [7]}, context)
//     var libraryData = mlDBController.find('MlLibrary', { isActive: true,userId:portfolio.userId, 'portfolioReference.portfolioId': portfolio._id, libraryType:args.files.libraryType}, context).fetch();
//     if(libraryData[args.files.index]){
//       libraryData[args.files.index].portfolioReference.map(function(data, id){
//         if(data.portfolioId === currentProfile[7]){
//           libraryData[args.files.index].portfolioReference.splice(id,1)
//         }
//       })
//       var updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id},libraryData[args.files.index], {$set: 1}, context)
//       return updateTemplateCollection1
//     }
//   }else if(context.url.indexOf("library") > 0) {
//     let libraryData = mlDBController.find('MlLibrary', {userId: context.userId, inCentralLibrary:true, libraryType:args.files.libraryType}, context).fetch()
//     if (libraryData[args.files.index]) {
//       libraryData[args.files.index].inCentralLibrary = false
//       var updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id}, libraryData[args.files.index], {$set: 1}, context)
//       return updateTemplateCollection1
//     }
//   }else{
//     let currentProfile = context.url.split("/")
//     let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [6]}, context)
//     let libraryData = mlDBController.find('MlLibrary', { isActive: true,userId:portfolio.userId, 'portfolioReference.portfolioId': portfolio._id, libraryType:args.files.libraryType}, context).fetch();
//     if(libraryData[args.files.index]){
//       libraryData[args.files.index].portfolioReference.map(function(data, id){
//         if(data.portfolioId === currentProfile[6]){
//           libraryData[args.files.index].portfolioReference.splice(id,1)
//         }
//       })
//       let updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id},libraryData[args.files.index], {$set: 1}, context)
//       return updateTemplateCollection1
//     }
//   }
// }
//
// MlResolver.MlMutationResolver['putDataIntoTheLibrary'] = (obj, args, context, info) => {
//   let response;
//   if(context.url.indexOf("transactions") > 0) {
//     var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfoliodetailsId}, context)
//     if (portfolioDetails) {
//       let tempObject = {
//         portfolioId: portfolioDetails._id,
//         isPrivate: false
//       }
//       let tempArray = []
//       tempArray.push(tempObject)
//       args.files.portfolioReference = tempArray;
//       args.files.inCentralLibrary = true
//       args.files.userId = portfolioDetails.userId;
//       var libraryDataAdmin = mlDBController.insert('MlLibrary', args.files,  context);
//       return libraryDataAdmin;
//     }
//   } else {
//     let currentProfile = context.url.split("/")
//     var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile[6]}, context)
//     if (portfolioDetails) {
//       let tempObject = {
//         portfolioId: portfolioDetails._id,
//         isPrivate: false
//       }
//       let tempArray = []
//       tempArray.push(tempObject)
//       args.files.inCentralLibrary = true
//       args.files.portfolioReference = tempArray;
//       args.files.userId = context.userId;
//       if (args.portfoliodetailsId) {
//         response = mlDBController.insert('MlLibrary', args.files, context)
//       }
//       return response;
//     }
//   }
// }


MlResolver.MlMutationResolver['updateIdea'] = (obj, args, context, info) => {
  if(args.idea) {
    var idea = mlDBController.findOne('MlIdeas', {_id: args.ideaId}, context)
    var updatedIdea = args.idea;
    if(idea){
      let ret = mlDBController.update('MlIdeas', args.ideaId, updatedIdea, {$set:true}, context)
      if (ret) {
        let ideatoralert = MlAlertNotification.onPortfolioUpdates()
        let code = 200;
        let response = new MlRespPayload().successPayload(ideatoralert, code);
        return response;
      }
    }
  }
}

MlResolver.MlQueryResolver['fetchIdeas'] = (obj, args, context, info) => {
  let ideas = [];
  let userId;
  var mongoQuery = {}
  if (args.portfolioId) {
    var portfolio = MlPortfolioDetails.findOne({_id: args.portfolioId}) || {}
    userId = portfolio.userId
    mongoQuery = {"$and": [{"userId": userId}, {"communityCode": "IDE"}]}
  } else if (context.userId) {
    userId = context.userId
    var defaultProfile = new MlUserContext(userId).userProfileDetails(userId)
    mongoQuery = {userId: userId, communityCode: "IDE", profileId: defaultProfile.profileId}
    if (!defaultProfile)
      return ideas;
  }
  if (!context.userId) {
    return ideas;
  }

  // let defaultProfile = new MlUserContext(context.userId).userProfileDetails(context.userId)
  // if(!defaultProfile)
  //     return ideas;

  // let portfolios = MlPortfolioDetails.find({"$and":[{"userId":userId}, {"clusterId":defaultProfile.clusterId}, {"communityType":"Ideators"}]}).fetch()
  // let portfolios = MlPortfolioDetails.find({"$and": [{"userId": userId}, {"communityType": "Ideators"}]}).fetch()
  let portfolios = MlPortfolioDetails.find(mongoQuery).fetch()
  if (!portfolios)
    return ideas;

  _.each(portfolios, function (portfolio) {
    let idea = MlIdeas.findOne({"portfolioId": portfolio._id})
    if (idea) {
      idea = portfolioValidationRepo.omitPrivateDetails(idea.portfolioId, idea, context, "ideas");
      idea.createdAt = portfolio ? portfolio.createdAt : null;
      idea.updatedAt = portfolio ? portfolio.lastLiveDate : null;
      ideas.push(idea);
    }
  })

  //for view action
  MlResolver.MlMutationResolver['createView'](obj, {
    resourceId: args.portfolioId,
    resourceType: 'portfolio'
  }, context, info);

  return ideas;
}

MlResolver.MlQueryResolver['fetchIdeatorDetails'] = (obj, args, context, info) => {
  if(_.isEmpty(args))
      return;
  var key = args.key;
  var ideatorPortfolio = MlIdeatorPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
  if (ideatorPortfolio && ideatorPortfolio.hasOwnProperty(key)) {
    var object = ideatorPortfolio[key];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, key);
    ideatorPortfolio[key] = filteredObject
    return ideatorPortfolio;
  }

}

MlResolver.MlQueryResolver['validateUserForAnnotation'] = (obj, args, context, info) => {
  if(args.portfoliodetailsId){
    var portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfoliodetailsId}, context);
    var user = mlDBController.findOne('users', {_id: context.userId}, context);
    if(portfolio && portfolio.userId){
        if(portfolio.userId == context.userId){
          return true;
        }
        if(user && user.profile &&user.profile.isInternaluser){
          return true;
        }
        return false;
    }
  }

}
