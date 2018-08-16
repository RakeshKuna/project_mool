/**
 * Created by  mohammed.mohasin on 6/5/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import _ from 'lodash';
import mlInteractionService from '../mlInteractionRepoService';
import MlEmailNotification from '../../../mlNotifications/mlEmailNotifications/mlEMailNotification'
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';
import MlNotificationController from '../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import mlSmsController from '../../../mlNotifications/mlSmsNotifications/mlSmsController'
import MlUserContext from "../../../MlExternalUsers/mlUserContext";
import MlSMSNotification from '../../../mlNotifications/mlSmsNotifications/mlSMSNotification'
MlResolver.MlMutationResolver['createReview'] = (obj, args, context, info) => {
  if (args && context && context.userId) {
    var resp = null;
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

      let user = mlDBController.findOne('users', {_id: context.userId}, context);
      var resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(args.resourceType, args.resourceId, context);
      var fromuser = resourceDetails.contextUser;
      var toUser = resourceDetails.resourceOwner;
      if (!toUser._id || !fromuser._id || fromuser._id === toUser._id) {
        let code = 400;
        let response = new MlRespPayload().errorPayload('Invalid User', code);
        return response;
      }

      //fix for Issue: MOOLYA-2508
      var updateCount = mlDBController.update('MlReviews',{resourceId: args.resourceId,resourceType: args.resourceType,userId: fromuser._id},{resourceId: args.resourceId},{$set:true,upsert:false}, context);
      if(updateCount==1){
        let response = new MlRespPayload().errorPayload('Limit exceeded for adding review', 401);
        return response;
      }

      //todo:set Active through admin

      let review = {
        resourceId: args.resourceId,
        resourceType: args.resourceType,
        message: args.message,
        userId: fromuser._id,
        userEmail: fromuser.username,
        createdOn: new Date(),
        rating: args.rating || 0,
        isActive: true
      };

      resp = mlDBController.insert('MlReviews', review, context);

      if (resp) {
        //create transaction and transaction Log
        let fromUserType = 'user';
        mlInteractionService.createTransactionRequest(toUser._id,'review', args.resourceId, resp, fromuser._id, fromUserType , context);
        MlEmailNotification.reviewRecieved(fromuser,toUser)
        MlNotificationController.onReviewReceived(fromuser,toUser);
        MlSMSNotification.sendSMSForReviewRecvd(fromuser, args.resourceId, context)
      }

    } catch (e) {
      let code = 400;
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
    let code = 200;
    let response = new MlRespPayload().successPayload(resp, code);
    return response;
  }

}



  MlResolver.MlQueryResolver['fetchReviews'] = (obj, args, context, info) => {
    try {
      if(!context.userId){
        return null;
      }
      //todo: pagination based result
      var pipeline=[{$match:{'resourceId':args.resourceId,'resourceType':args.resourceType,isActive:true}},
        {$lookup:{from:'users',localField:'userId',foreignField:'_id',as:'userDetails'}},//join with user
        {$unwind:"$userDetails"},
        {$project: {reviewId:'$_id',resourceId: '$resourceId',resourceType: '$resourceType',rating: '$rating',
            message: '$message',userId: '$userId',userEmail: '$userEmail',createdOn: '$createdOn',
            userName: '$userDetails.profile.displayName',
            userProfileImage: '$userDetails.profile.profileImage',
        }
        }
       ];
      var reviews=mlDBController.aggregate('MlReviews',pipeline,context);

      return reviews;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

