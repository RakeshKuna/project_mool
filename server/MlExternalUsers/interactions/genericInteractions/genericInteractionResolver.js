/**
 * Created by  mohammed.mohasin on 19/6/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import _ from 'lodash';
import mlInteractionService from '../mlInteractionRepoService'
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';
import mlInteractionAccessControlRepo from './mlInteractionAccessControlRepo';

var generateConnectionCode=function(u1,u2){
  var connectionCode=u1+u2;
  if(u1>u2)connectionCode=u2+u1;
  if(u1===u2)connectionCode=null;
  return connectionCode;
}
MlResolver.MlQueryResolver['fetchInteractionsCount'] = (obj, args, context, info) => {
  var counterList = [];
  var actionsList=args.actionNames||[];
  var resourceId=args.resourceId;
  var resourceType=args.resourceType;
  var resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(resourceType,resourceId, context);
  if (context && context.userId) {
    _.each(actionsList, function (action) {
      switch(action){
        case 'like':
             let likesCount=MlLikes.find({resourceType:resourceType,resourceId:resourceId,isActive:true}).count();
             counterList.push({'actionName':'like',count:likesCount});
              break;
        case 'connect':
             let connectionCount=MlConnections.find({'isAccepted':true,'users.userId':resourceDetails.resourceOwnerId}).count();
             counterList.push({'actionName':'connect',count:connectionCount});
             break;
        case 'collaborate':
              counterList.push({'actionName':'collaborate',count:0});
              break;
        case 'favourite':
              let favouriteCount=MlConnections.find({'isAccepted':true,'users.userId':resourceDetails.resourceOwnerId,'users':{'$elemMatch':{'userId':{$ne:resourceDetails.resourceOwnerId},'isFavourite':true}}}).count();
              counterList.push({'actionName':'favourite',count:favouriteCount});
              break;
        case 'view':
              let viewCount=MlViews.find({resourceType:resourceType,resourceId:resourceId}).count();
              // let viewCount = mlDBController.find('MlViews', {resourceType: resourceType, resourceId: resourceId}).count();
              counterList.push({'actionName':'view',count:viewCount});
              break;
        case 'partner':
              counterList.push({'actionName':'partner',count:0});
              break;
        case 'enquire':
          let enquireCount=MlInquiries.find({resourceType:resourceType,resourceId:resourceId}).count();
          counterList.push({'actionName':'enquire',count:enquireCount});
          break
        case 'follow':
          let followCount=MlFollowings.find({'followerId':resourceDetails.resourceOwnerId,"isActive" : true}).count();
          counterList.push({'actionName':'follow',count:followCount});
          break
      }
    });
  }
  return counterList;
}

MlResolver.MlQueryResolver['fetchInteractionActionAttributes'] = (obj, args, context, info) => {
  var actionsList = [];
  var actionNames=args.actionNames||[];
  var resourceId=args.resourceId;
  var resourceType=args.resourceType;
  var resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(resourceType,resourceId, context);

  /**
   * Sub chapter access control
   */
  let portfolioDetails =mlDBController.findOne('MlPortfolioDetails',{_id:resourceId}, context);
  let subChapterId = portfolioDetails && portfolioDetails.subChapterId ? portfolioDetails.subChapterId : '';
  let mlSubChapterAccessControl = MlSubChapterAccessControl.getAccessControl('TRANSACT', context, subChapterId);
  let hasAccess = mlSubChapterAccessControl && mlSubChapterAccessControl.hasAccess ?  mlSubChapterAccessControl.hasAccess : false;

  //check for Access Control for Interaction
  var canPerformInteraction=mlInteractionAccessControlRepo.canPerformInteraction(resourceDetails);

  if (context && context.userId &&canPerformInteraction) {
    var connectionCode=generateConnectionCode(context.userId,resourceDetails.resourceOwnerId);
    _.each(actionNames, function (action) {
      switch(action){
        case 'like':
          let likesCount=MlLikes.find({resourceType:resourceType,resourceId:resourceId,isActive:true,userId:context.userId}).count();
          actionsList.push({'actionName':'like',isDisabled:!hasAccess || (likesCount==1 ?true:false),isHidden:false});
          break;
        case 'connect':
          let connectionCount=MlConnections.find({'isAccepted':true,'connectionCode':connectionCode}).count();
          actionsList.push({'actionName':'connect',isDisabled:!hasAccess || (connectionCount==1 ?true:false),isHidden:false});
          break;
        case 'favourite':
          let favouriteCount=MlConnections.find({'isAccepted':true,'connectionCode':connectionCode,'users':{'$elemMatch':{'userId':context.userId,'isFavourite':true}}}).count();
          actionsList.push({'actionName':'favourite',isDisabled:!hasAccess || (favouriteCount==1 ?true:false),isHidden:false});
          break;
        case 'follow':
          let followCount=MlFollowings.find({'isActive':true,'followerId':resourceDetails.resourceOwnerId,'followedBy':context.userId}).count();
          actionsList.push({'actionName':'follow',isDisabled:!hasAccess || (followCount==1 ?true:false),isHidden:false});
          break;
        case 'enquire':
          actionsList.push({'actionName':'enquire',isDisabled:!hasAccess,isHidden:false});
          break;
        case 'review':
          actionsList.push({'actionName':'review',isDisabled:!hasAccess,isHidden:false});
          break;
        case 'comment':
          actionsList.push({'actionName':'comment',isDisabled:!hasAccess,isHidden:false});
          break;
        case 'partner':
          actionsList.push({'actionName':'partner',isDisabled:!hasAccess,isHidden:false});
          break;
        case 'collaborate':
          actionsList.push({'actionName':'collaborate',isDisabled:!hasAccess,isHidden:false});
          break;
      }
    });
  }else{//if resource Owner is viewing his own resource
     actionsList=[{'actionName':'collaborate',isDisabled:true,isHidden:false},{'actionName':'partner',isDisabled:true,isHidden:false},{'actionName':'comment',isDisabled:true,isHidden:false},{'actionName':'review',isDisabled:true,isHidden:false},
      {'actionName':'enquire',isDisabled:true,isHidden:false},{'actionName':'follow',isDisabled:true,isHidden:false},{'actionName':'favourite',isDisabled:true,isHidden:false},{'actionName':'connect',isDisabled:true,isHidden:false},{'actionName':'like',isDisabled:true,isHidden:false}];

  }
  return actionsList;
}
