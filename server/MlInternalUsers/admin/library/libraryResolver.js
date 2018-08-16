import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import MlLibraryRepo from './libraryRepo'
var _ = require('lodash')


MlResolver.MlQueryResolver['fetchCurrentUserPermissions'] = (obj, args, context, info) => {
  let portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfolioDetailsId}, context)
  if(portfolioDetails && portfolioDetails.userId ) {
    try {
      if (portfolioDetails.userId === context.userId) {
        action = ( context.url.indexOf("view") > 0 ) ? 'view' : 'edit';
        let userInfo = {
          isExploring: false,
          action: action
        }
        return userInfo
      } else {
        action = ( context.url.indexOf("view") > 0 ) ? 'view' : 'edit';
        let userInfo = {
          isExploring: true,
          action: action
        }
        return userInfo
      }
    }
    catch(e) {
      let code = 404;
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Permissions denied", code);
    return response;
  }
}


MlResolver.MlMutationResolver['createLibrary'] = (obj, args, context, info) => {
  var newPortfolioCollection;
  if (args.portfolioDetailsId) {
    newPortfolioCollection = new MlLibraryRepo.portfolioLibraryCreation(args.detailsInput, args.portfolioDetailsId , context)
  } else {
      args.detailsInput.userId = context.userId;
      newPortfolioCollection = mlDBController.insert('MlLibrary', args.detailsInput, context)
      newPortfolioCollection = newPortfolioCollection ? new MlRespPayload().successPayload("File uploaded successfully", 200) : new MlRespPayload().errorPayload("Failed to upload the file", 400);
  }
  return newPortfolioCollection;
}


MlResolver.MlMutationResolver['updateLibrary'] = (obj, args, context, info) => {
  // let currentProfile = context.url.split("/");
  // let dataExists = false;
  let portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: context.url.split("/")[6]}, context)
  // var existingCollection = mlDBController.findOne('MlLibrary', {_id:args.id, 'libraryType':args.files.libraryType}, context)
  // if(existingCollection) {
  //   if(Array.isArray(existingCollection.portfolioReference)) {
  //     existingCollection.portfolioReference.map(function (data) {
  //       if (Array.isArray(args.files.portfolioReference)) {
  //         args.files.portfolioReference.map(function (incoming) {
  //           if (data.portfolioId === incoming.portfolioId) {
  //             dataExists = true;
  //           }
  //         })
  //       }
  //     })
  //   }
  //   if(dataExists){
  //     let code = 20
  //     let response = new MlRespPayload().errorPayload('File already exists', code);
  //     return response
  //   }
  // }
  if(args.files.portfolioReference){
    if(args.files.portfolioReference.portfolioId ===portfolioDetails._id){
      let code = 20
      let response = new MlRespPayload().errorPayload(ret, code);
      return response;
    }else{
      let tempObject = {
        portfolioId:portfolioDetails._id,
        isPrivate: true
      }
      args.files.portfolioReference.push(tempObject)
    }
  }else {
    let tempObject = {
      portfolioId: portfolioDetails && portfolioDetails._id,
      isPrivate: true
    }
    let tempArray = []
    tempArray.push(tempObject)
    if(tempObject && tempObject.portfolioId) args.files.portfolioReference = tempArray;
    else return
  }
    var newCollection = mlDBController.update('MlLibrary', {_id:args.id},args.files,{$set:1}, context)
    newCollection = newCollection ? new MlRespPayload().successPayload("File imported successfully", 200) : new MlRespPayload().errorPayload("Failed to Import file", 400);
    return newCollection;
}

/**
 * @Note: 1) need to remove sever url dependency ["to-do"]
 *        2) case added to take users left nav data accuracy
 * */
MlResolver.MlQueryResolver['fetchLibrary'] = (obj, args, context, info) => {
  if(context.url.indexOf("transactions") > 0) {
    let currentProfile = context.url.split("/")
    let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [7]}, context)
    var libraryData = mlDBController.find('MlLibrary', { isActive: true, 'portfolioReference.portfolioId': portfolio._id, 'portfolioReference.isPrivate': false}, context).fetch();
    return libraryData;
  }
  else if(context.url.indexOf("portfolio") > 0){
    let currentProfile = context.url;
    let splitArray = [];
    if (currentProfile) {
      splitArray = currentProfile.split("/");
    }
    let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: splitArray[6]}, context)
    var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true, 'portfolioReference.portfolioId': splitArray[6]}, context).fetch();
    return libraryData;
  }
  else if (!args.userId) {
    var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true}, context).fetch();
    return libraryData;
  }else {
    var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.userId}, context)
    if (portfolioDetails) {
      let portfolioId ;
      let currentProfile = context.url.split("/")
      if(context.url.split("/")[4] === 'explore'){
        portfolioId = context.url.split("/")[6];
      }else{
        // portfolioId = context.url.split("/")[5];
        portfolioId = args.userId ? args.userId : context.url.split("/")[5];
      }
      args.userId = portfolioDetails.userId;
      var query = {
        userId: args.userId,
        isActive: true,
        'portfolioReference.portfolioId': portfolioId,
        // 'portfolioReference.isPrivate': false
      }
      var libraryDataOthers = mlDBController.find('MlLibrary', query, context).fetch();
      return libraryDataOthers;
    }
  }
}

MlResolver.MlQueryResolver['fetchLibraryBasedOnPortfolioId'] = (obj, args, context, info) => {
  let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfolioId}, context)
  let userId = portfolio && portfolio.userId  ? portfolio.userId : ""
  if(userId === context.userId) {
    let libraryDetails = mlDBController.find('MlLibrary', {'portfolioReference.portfolioId': args.portfolioId,userId:context.userId, isActive: true}, context).fetch();
    if(libraryDetails) {
      libraryDetails.map(function(data){
        if(_.isArray(data.portfolioReference)) {
          data.portfolioReference.map(function(info) {
            data.isPrivate = info.isPrivate;
          })
        }
      })
      return libraryDetails
    }
  } else {
    let libraryDetails = mlDBController.find('MlLibrary', {'portfolioReference.portfolioId': args.portfolioId,'portfolioReference.isPrivate':false,isActive: true}, context).fetch();
    return libraryDetails;
  }
}


MlResolver.MlQueryResolver['fetchDataFromCentralLibrary'] = (obj, args, context, info) => {
  var libraryData = mlDBController.find('MlLibrary', {userId: context.userId, isActive: true, inCentralLibrary: true}, context).fetch();
  return libraryData;
}

MlResolver.MlMutationResolver['updatePrivacyDetails'] = (obj, args, context, info) => {
  let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: args.privateInput.portfolioId}, context)
  if(portfolio) {
    var libraryData = mlDBController.findOne('MlLibrary', {_id: args.privateInput.id,libraryData, 'portfolioReference.portfolioId': args.privateInput.portfolioId}, context);
    libraryData.portfolioReference.map(function(data){
      if(data.portfolioId === args.privateInput.portfolioId){
        data.isPrivate = args.privateInput.privacyState
      }
    })
    var updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: args.privateInput.id},libraryData, {$set: 1}, context)
    return updateTemplateCollection1;
  }
}

MlResolver.MlMutationResolver['updateLibraryData'] = (obj, args, context, info) => {
  if(context.url.indexOf("transactions") > 0) {
    let currentProfile = context.url.split("/")
    let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [7]}, context)
    var libraryData = mlDBController.find('MlLibrary', { isActive: true,userId:portfolio.userId, 'portfolioReference.portfolioId': portfolio._id, libraryType:args.files.libraryType}, context).fetch();
    if(libraryData[args.files.index]){
      libraryData[args.files.index].portfolioReference.map(function(data, id){
        if(data.portfolioId === currentProfile[7]){
          libraryData[args.files.index].portfolioReference.splice(id,1)
        }
      })
      var updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id},libraryData[args.files.index], {$set: 1}, context)
      return updateTemplateCollection1
    }
  }else if(context.url.indexOf("library") > 0) {
    let libraryData = mlDBController.find('MlLibrary', {userId: context.userId, inCentralLibrary:true, libraryType:args.files.libraryType}, context).fetch()
    if (libraryData[args.files.index]) {
      libraryData[args.files.index].inCentralLibrary = false
      var updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id}, libraryData[args.files.index], {$set: 1}, context)
      return updateTemplateCollection1
    }
  }else{
    let currentProfile = context.url.split("/")
    let portfolio = mlDBController.findOne('MlPortfolioDetails', {_id: currentProfile [6]}, context)
    let libraryData = mlDBController.find('MlLibrary', { isActive: true,userId:portfolio.userId, 'portfolioReference.portfolioId': portfolio._id, libraryType:args.files.libraryType}, context).fetch();
    if(libraryData[args.files.index]){
      libraryData[args.files.index].portfolioReference.map(function(data, id){
        if(data.portfolioId === currentProfile[6]){
          libraryData[args.files.index].portfolioReference.splice(id,1)
        }
      })
      let updateTemplateCollection1 = mlDBController.update('MlLibrary', {_id: libraryData[args.files.index]._id},libraryData[args.files.index], {$set: 1}, context)
      return updateTemplateCollection1
    }
  }
}

MlResolver.MlMutationResolver['putDataIntoTheLibrary'] = (obj, args, context, info) => {
  let response;
  if(context.url.indexOf("transactions") > 0) {
    var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfoliodetailsId}, context)
    if (portfolioDetails) {
      let tempObject = {
        portfolioId: portfolioDetails._id,
        isPrivate: true
      }
      let tempArray = []
      tempArray.push(tempObject)
      args.files.portfolioReference = tempArray;
      args.files.inCentralLibrary = true
      args.files.userId = portfolioDetails.userId;
      var libraryDataAdmin = mlDBController.insert('MlLibrary', args.files,  context);
      if (libraryDataAdmin) {
        let code = 200;
        response = new MlRespPayload().successPayload('File moved to your library', code);
      } else {
        let code = 404;
        response = new MlRespPayload().errorPayload('Error in uploading file', code);
      }
      return response;
    }
  } else {
    var portfolioDetails = mlDBController.findOne('MlPortfolioDetails', {_id: args.portfoliodetailsId}, context)
    if (portfolioDetails) {
      let tempObject = {
        portfolioId: portfolioDetails._id,
        isPrivate: true
      }
      var fileExistCheck = mlDBController.find('MlLibrary', {'portfolioReference.portfolioId': args.portfoliodetailsId}, context).fetch();
      let check =fileExistCheck.map(function(fileName) {
        if(fileName.fileName === args.files.fileName){
          return 0;
        } else {
          return 1;
        }
      })
      let tempArray = []
      if(!check.includes(0)){
        tempArray.push(tempObject)
        args.files.inCentralLibrary = true
        args.files.portfolioReference = tempArray;
        args.files.userId = context.userId;
        if (args.portfoliodetailsId) {
          response = mlDBController.insert('MlLibrary', args.files, context)
          let code = 200;
          response = new MlRespPayload().successPayload('File moved to your library', code);
        }
      } else {
        let code = 404;
        response = new MlRespPayload().errorPayload('Image with the same file name already exists in the library', code);
      }
      return response;
    }
  }
}
