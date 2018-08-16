/**
 * Created by  mohammed.mohasin on 6/5/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import _ from 'lodash';
import mlInteractionService from '../mlInteractionRepoService'
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';
import MlAlertNotification from '../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
MlResolver.MlMutationResolver['followUser'] = (obj, args, context, info) =>{
  let followRequest;
    if(args && context && context.userId){
      var resp=null;
      //follow flag checks for true/false. if its true:
      var follow=args.follow===true?args.follow:(args.follow===false?false:true);
        try {

          /**
           * Sub chapter access control
           */
          let portfolioDetails =mlDBController.findOne('MlPortfolioDetails',{_id:args.resourceId}, context);
          let subChapterId = portfolioDetails && portfolioDetails.subChapterId ? portfolioDetails.subChapterId : '';
          let mlSubChapterAccessControl = MlSubChapterAccessControl.getAccessControl('TRANSACT', context, subChapterId);
          if(!mlSubChapterAccessControl.hasAccess){
            let code = 400;
            let response = new MlRespPayload().errorPayload('You do not have access to transact', code);
            return response;
          }

          var resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(args.resourceType, args.resourceId, context);
          var fromuser = resourceDetails.contextUser;
          var toUser = resourceDetails.resourceOwner;
          if (!toUser._id || !fromuser._id || fromuser._id===toUser._id) {
            let code = 400;
            let response = new MlRespPayload().errorPayload('Invalid user', code);
            return response;
          }
          let isValidFromUser = mlInteractionService.validateExternalUser(fromuser);
          let isValidToUser = mlInteractionService.validateExternalUser(toUser);
          if (!isValidToUser || !isValidFromUser) {
            let code = 400;
            let response = new MlRespPayload().errorPayload('Invalid user', code);
            return response;
          }

          let followUser={isActive:follow,followerId:toUser._id,followerEmail:toUser.username,followedBy:fromuser._id,
            followedByEmail:fromuser.username,updatedOn:new Date(),updatedBy:fromuser.username};

          resp = mlDBController.update('MlFollowings',{followedBy:fromuser._id,followerId:toUser._id},followUser,{$set: true,upsert: true},context);

          if(resp===0){
            //todo: create a repo for like
            //transaction Log
            return new MlRespPayload().errorPayload(resp, 400);
          }

          let followData = mlDBController.findOne('MlFollowings',{followedBy:fromuser._id,followerId:toUser._id}, context);
          let fromUserType = 'user';
          mlInteractionService.createTransactionRequest(toUser._id,'follow', args.resourceId, followData._id, fromuser._id, fromUserType , context);
           followRequest = MlAlertNotification.onFollowRequestMsg(toUser&&toUser._id?toUser._id:"");
        }catch (e){
            let code = 400;
            let response = new MlRespPayload().errorPayload(e.message, code);
            return response;
        }
        let code = 200;
        let response = new MlRespPayload().successPayload(followRequest, code);
        return response;
    }
}

/*
* followerId-context.userId
**/
MlResolver.MlQueryResolver['followersList'] = (obj, args, context, info) => {
  var followersList = [];
  if (context && context.userId) {
    //todo: pagination based result
    var pipeline=[
      {$match:{'followerId':context.userId,isActive:true}},
      {$lookup:{from:'users',localField:'followedBy',foreignField:'_id',as:'userDetails'}},
      {$unwind:'$userDetails'},{$unwind:'$userDetails.profile.externalUserProfiles'},
      {$match:{'userDetails.profile.isActive':true,'userDetails.profile.externalUserProfiles.isActive':true}},
      {$group : {_id:'$followedBy',
        'userId':{ $first: "$userDetails._id"},
        'userName':{ $first: "$userDetails.username"},
        'firstName':{ $first:'$userDetails.profile.firstName'},
        'lastName':{ $first:'$userDetails.profile.lastName'},
        'displayName':{ $first:'$userDetails.profile.displayName'},
        'profileImage':{ $first:"$userDetails.profile.profileImage"},
        'profileId':{ $first:"$userDetails.profile.profileId"},
        'countryName':{ $first:'$userDetails.profile.externalUserProfiles.countryName'},
        'communityName':{ $first:'$userDetails.profile.externalUserProfiles.communityName'},
        'communityCode':{ $first:'$userDetails.profile.externalUserProfiles.communityDefCode'}
      }}
    ]
    followersList=mlDBController.aggregate('MlFollowings',pipeline,context);
  }
  return followersList;
}
/*
* followedBy-context.userId
* */
MlResolver.MlQueryResolver['followingsList'] = (obj, args, context, info) => {
  var followingsList = [];
  if (context && context.userId) {
    var pipeline=[
      {$match:{'followedBy':context.userId,isActive:true}},
      {$lookup:{from:'users',localField:'followerId',foreignField:'_id',as:'userDetails'}},
      {$unwind:'$userDetails'},{$unwind:'$userDetails.profile.externalUserProfiles'},
      {$match:{'userDetails.profile.isActive':true,'userDetails.profile.externalUserProfiles.isActive':true}},
      {$group : {_id:'$followerId',
        'id':{$first:"$_id"}, //follow Object Id
        'userId':{ $first: "$userDetails._id"},
        'userName':{ $first: "$userDetails.username"},
        'firstName':{ $first:'$userDetails.profile.firstName'},
        'lastName':{ $first:'$userDetails.profile.lastName'},
        'displayName':{ $first:'$userDetails.profile.displayName'},
        'profileImage':{ $first:"$userDetails.profile.profileImage"},
        'profileId':{ $first:"$userDetails.profile.profileId"},
        'countryName':{ $first:'$userDetails.profile.externalUserProfiles.countryName'},
        'communityName':{ $first:'$userDetails.profile.externalUserProfiles.communityName'},
        'communityCode':{ $first:'$userDetails.profile.externalUserProfiles.communityDefCode'}
      }}
    ]

    //todo: pagination based result
    followingsList=mlDBController.aggregate('MlFollowings',pipeline,context);
  }
  return followingsList;
}
