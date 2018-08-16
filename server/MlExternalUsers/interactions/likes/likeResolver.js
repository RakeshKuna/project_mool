/**
 * Created by  mohammed.mohasin on 6/5/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import _ from 'lodash';
import MlEmailNotification from '../../../mlNotifications/mlEmailNotifications/mlEMailNotification'
import mlInteractionService from '../mlInteractionRepoService';
import MlAlertNotification from '../../../mlNotifications/mlAlertNotifications/mlAlertNotification';
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';

MlResolver.MlMutationResolver['likeRequest'] = (obj, args, context, info) =>{
    if(args && context && context.userId){
      var resp=null;
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

            let user =mlDBController.findOne('users',{_id:context.userId}, context);
            let resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(args.resourceType, args.resourceId, context);
            let fromuser = resourceDetails.contextUser;
            let toUser = resourceDetails.resourceOwner;
            //let isValid = validateExternalUser(fromuser)
            /*if(!isValid){let code = 400;let response = new MlRespPayload().errorPayload('Invalid User', code);
             return response;}*/
          let likeRequest={resourceId:args.resourceId,resourceType:args.resourceType,isActive:true,userId:user._id,
                       userEmail:user.username,createdOn:new Date()};

          resp = mlDBController.update('MlLikes',{'resourceId':args.resourceId,userId:user._id},likeRequest,{$set: true,upsert: true},context);

          if(resp){
            let fromUserType = 'user';
            mlInteractionService.createTransactionRequest(toUser._id,'like', args.resourceId, resp, fromuser._id, fromUserType , context);
            //todo: create a repo for like
            //transaction Log
          }

        }catch (e){
            let code = 400;
            let response = new MlRespPayload().errorPayload(e.message, code);
            return response;
        }
        let code = 200;
        let likeRequest = MlAlertNotification.onLikeRequest()
        let response = new MlRespPayload().successPayload(likeRequest, code);
        return response;
    }
}

MlResolver.MlQueryResolver['fetchLikes'] = (obj, args, context, info) =>{
  if(args && args.resourceType &&context && context.userId){
    var resp=null;
    try {
      let pileLine = [
        { '$match': {
            userId: context.userId,
            resourceType: args.resourceType
          }
        }
      ]
      let pipeRes = mlInteractionService.buildAggregationQuery(args.resourceType, context.userId);
      if(pipeRes.length){
        pileLine = pileLine.concat(pipeRes);
      }
      let resp = mlDBController.aggregate('MlLikes', pileLine, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(resp, code);
      return response;
    }catch (e){
      let code = 400;
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
    let code = 200;
    let response = new MlRespPayload().successPayload(resp, code);
    return response;
  }
}

validateExternalUser=(user)=>{
    let userExternal = user.profile.isExternaluser;
    //check if email is verified.
    let emails=user&&user.emails?user.emails:[];
    var email = _.find(emails || [], function (e) { return (e.verified&&e.address===user.username);});
    if(!email){return false;}
    return userExternal
}
