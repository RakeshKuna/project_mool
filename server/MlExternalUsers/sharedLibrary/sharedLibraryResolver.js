import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";
import MlUserContext from '../../MlExternalUsers/mlUserContext'
var _ = require('lodash')
import mlInteractionService from '../interactions/mlInteractionRepoService';

MlResolver.MlMutationResolver['createSharedLibrary'] = (obj, args, context, info) => {

  let libraryInput = args.detailsInput;

  if(!libraryInput) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Share data required', code);
    return response;
  }

  if(!libraryInput.files || !libraryInput.files.length ){
    let code = 404;
    let response = new MlRespPayload().errorPayload('Share files data required', code);
    return response;
  }

  if(!libraryInput.users || !libraryInput.users.length ){
    let code = 400;
    let response = new MlRespPayload().errorPayload('Share user data required', code);
    return response;
  }

  let files = libraryInput.files;
  let users = libraryInput.users;

  try {

    let userId = context.userId;
    let profile = new MlUserContext(userId).userProfileDetails(userId);
    let dataToInsert = {
      owner:{
        userId: userId,
        profileId: profile ? profile.profileId : '',
        clusterId: profile ? profile.clusterId : '',
        chapterId: profile ? profile.chapterId : '',
        subChapterId: profile ? profile.subChapterId : '',
        communityId: profile ? profile.communityId : '',
        communityCode: profile ? profile.communityDefCode : ''
      },
      isSignedUrl: false,
      isActive: true,
      isDownloadable: libraryInput.isDownloadable ? libraryInput.isDownloadable : false,
      createdAt: new Date(),
      createdBy: userId
    };

    dataToInsert.sharedId=orderNumberGenService.createShareLibraryId();

    if(libraryInput.sharedStartDate) {
      dataToInsert.sharedStartDate = libraryInput.sharedStartDate;
    }
    if(libraryInput.sharedEndDate) {
      dataToInsert.sharedEndDate = libraryInput.sharedEndDate;
    }

    let isSharedFailed = false;
    users.forEach(function (user) {
      dataToInsert.user = user;
      files.forEach(function (file) {
        dataToInsert.file = file;
        let result = mlDBController.insert('MlSharedLibrary', dataToInsert, context);
        if(typeof result !== "string") {
          isSharedFailed = true;
        }
      });
    });

    // mlInteractionService.createTransactionRequest(toUser._id,'share', args.resourceId, connectionData._id, context.userId, 'user', context );

    if(isSharedFailed){
      let code = 400;
      let response = new MlRespPayload().errorPayload('Error occur while sharing', code);
      return response;
    }

    let code = 200;
    let response = new MlRespPayload().successPayload('Share document successfully', code);
    return response;

  } catch(error){
    let code = 400;
    let response = new MlRespPayload().errorPayload(error, code);
    return response;
  }

  console.log(libraryInput);

}

MlResolver.MlQueryResolver['fetchSharedLibraryDetails'] = (obj, args, context, info) => {

  let sharedId = args.sharedId;

  let pipeline = [
    { "$match": { "sharedId": sharedId } },
    {
      "$group": {
        _id: "$sharedId",
        users: {"$addToSet": "$user"},
        files: {"$addToSet": "$file"},
        userId: { "$first": "$owner.userId" },
        profileId: { "$first": "$owner.profileId" },
        shareStartDate: { "$first": "$sharedStartDate"},
        shareEndDate: { "$first": "$sharedEndDate"},
        isDownloadable: { "$first": "$isDownloadable"},
        createdAt: { "$first": "$createdAt"}
      }
    },
    { "$unwind": "$users" },
    { "$lookup": { from: "users", localField: "users.userId", foreignField: "_id", as: "usersInfo" } },
    { "$unwind": "$usersInfo" },
    { "$project": {
      "_id": 1,
      "files": 1,
      "userId": 1,
      "profileId": 1,
      "shareStartDate": 1,
      "shareEndDate": 1,
      "isDownloadable": 1,
      "createdAt": 1,
      "users": {
        "userId": 1,
        "profileId":1,
        "displayName": "$usersInfo.profile.firstName",
        "profilePic": "$usersInfo.profile.profileImage"
      }
    }
    },
    {
      "$group":{
        _id: "$_id",
        users: {"$addToSet": "$users"},
        files: {"$first": "$files"},
        userId: { "$first": "$userId" },
        profileId: { "$first": "$profileId" },
        sharedStartDate: { "$first": "$shareStartDate"},
        sharedEndDate: { "$first": "$shareEndDate"},
        isDownloadable: { "$first": "$isDownloadable"},
        createdAt: { "$first": "$createdAt"}
      }
    },
    { "$lookup": { from: "users", localField: "userId", foreignField: "_id", as: "contactInfo" } },
    { "$unwind" : "$contactInfo" },
    { "$addFields": { "userProfiles": {"$cond": [{ "$isArray": "$contactInfo.profile.externalUserProfiles" }, "$contactInfo.profile.externalUserProfiles" , [{}] ] } } },
    { "$addFields": {
      "userProfiles": {
        "$filter": {
          input: "$userProfiles",
          as: "userProfile",
          cond: { $eq: [ "$$userProfile.profileId", "$profileId" ] }
        }
      }
    }
    },
    { "$unwind" : "$userProfiles" },
    {
      "$project": {
        _id: 1,
        users: 1,
        files: 1,
        sharedStartDate: 1,
        sharedEndDate: 1,
        isDownloadable: 1,
        createdAt:1,
        ownerInfo: {
          userId: "$userId",
          profileId: "$profileId",
          email : "$contactInfo.profile.email",
          name : "$contactInfo.profile.firstName",
          mobileNumber: "$contactInfo.profile.mobileNumber",
          cluster: "$userProfiles.clusterName",
          chapter: "$userProfiles.chapterName",
          subChapter: "$userProfiles.subChapterName",
          community: "$userProfiles.communityName",
        }
      }
    }
  ];

  let data = mlDBController.aggregate('MlSharedLibrary', pipeline);

  return data && data[0] ? data[0] : {};

}

MlResolver.MlQueryResolver['getMySharedConnections'] = (obj, args, context, info) => {
  let userId = context.userId;
  let pipeline = [
    {"$match": { "user.userId": userId ,"sharedEndDate":{ "$gte" : new Date()} }},
    {"$group": { _id: "$owner.userId" } },
    {"$lookup": { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    {"$unwind": "$user"},
    {"$replaceRoot": {newRoot:"$user"} },
    {"$project": {
      userId: "$_id",
      profilePic: "$profile.profileImage",
      displayName: "$profile.firstName"
    } }
  ];
  let data = mlDBController.aggregate('MlSharedLibrary', pipeline);
  return data;
}

MlResolver.MlMutationResolver['updateSharedLibrary'] = (obj, args, context, info) => {
}

MlResolver.MlQueryResolver['fetchSharedLibrary'] = (obj, args, context, info) => {
  let userId =  args.userId ? args.userId : context.userId ;
  let libraryData = [];
  let data = mlDBController.find('MlSharedLibrary',{ 'owner.userId':userId, 'user.userId':context.userId}, context).fetch();
  data.map((info)=>{
    // new Date(info.sharedStartDate) - new Date(info.sharedEndDate);
    let expiryDate = Math.floor((Date.UTC(info.sharedEndDate.getFullYear(), info.sharedEndDate.getMonth(), info.sharedEndDate.getDate()) - Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ) /(1000 * 60 * 60 * 24));
      info.daysToExpire = expiryDate;
      if(expiryDate < 0 || expiryDate === 0) {
         info.isExpired = true;
       let updatedValue =  mlDBController.update('MlSharedLibrary',{'_id':info._id}, info , {$set:1}, context);
      }
      let status = ((!info.isExpired) || new Date(info.sharedStartDate) === new Date())
    let yetToBeShared = new Date(info.sharedStartDate).setHours(0,0,0,0) > new Date()
    if(!info.isExpired && status && (!yetToBeShared)) {//&& (info && info.sharedStartDate ? new Date(info.sharedStartDate) === new Date() : true )) { // && (info && info.sharedStartDate ? info.sharedStartDate === new Date() : true )
        libraryData.push(info)
      }
  })
  return libraryData;
}

MlResolver.MlQueryResolver['fetchShareMembersInfo'] = (obj, args, context, info) => {
  let userId = context.userId ;
  let data = mlDBController.find('MlSharedLibrary',{ 'owner.userId':userId }, context).fetch();
  let responseData = []
  data.map((info)=> {
    let expiryDate = Math.floor((Date.UTC(info.sharedEndDate.getFullYear(), info.sharedEndDate.getMonth(), info.sharedEndDate.getDate()) - Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ) /(1000 * 60 * 60 * 24));
    let otherUserId = info.user.userId;
    let userInfo = mlDBController.findOne('users',{ '_id':otherUserId}, context);
    let userName = userInfo.profile.firstName;
    let userObject = {
      userName: userName,
      profileImage: userInfo.profile.profileImage,
      daysRemaining: expiryDate,
      fileUrl: info.file.url,
      fileType: info.file.fileType
    }
    responseData.push(userObject)

  })

    return responseData;
}

