/**
 * Created by mohammed.mohasin on 13/06/17.
 */
import _ from 'lodash';
import MlTransactionsHandler from '../../commons/mlTransactionsLog';
class MlInteractionService{

  constructor(){
    if(! MlInteractionService.instance){
      MlInteractionService.instance = this;
    }
    return MlInteractionService.instance;
  }

  getUserDetails(userId){
    var user =mlDBController.findOne('users',{_id:userId}, {})||{};
    return user;
  }

  fetchContextUserDetails(context){
    var contextUserId=context?context.userId:null;
    var contextUser=this.getUserDetails(contextUserId)||{};
    return {contextUserId:contextUser._id,contextUserName:contextUser.username,contextUser:contextUser};
  }

  validateExternalUser(user){
    let userExternal = user.profile.isExternaluser;
    //check if email is verified.
    let emails=user&&user.emails?user.emails:[];
    var email = _.find(emails || [], function (e) { return (e.verified&&e.address===user.username);});
    if(!email){return false;}
    return userExternal;
  }

  //fetch the resourceOwnerId,resourceOwnerUserName,contextUserId,contextUserName based on resourceType and resourceId
  fetchResourceBasedUserDetails(resourceType,resourceId,context){
        var resourceOwnerId=null;
        var contextUserId=context?context.userId:null;
        switch(resourceType){
          case 'portfolio':
            var resourceData =mlDBController.findOne('MlPortfolioDetails',{_id:resourceId}, context)||null;
            resourceOwnerId=resourceData?resourceData.userId:null;
            break;
        }
        var resourceOwnerUser=this.getUserDetails(resourceOwnerId)||{};
        var contextUser=this.getUserDetails(contextUserId)||{};

        return {resourceId:resourceId,resourceType:resourceType,resourceOwner:resourceOwnerUser,resourceOwnerId:resourceOwnerUser._id,resourceOwnerUserName:resourceOwnerUser.username,
          contextUserId:contextUser._id,contextUserName:contextUser.username,contextUser:contextUser};
    }

  interactionPreConditions(resourceType, resourceId, context) {
    var curUserId = context ? context.userId : null;
    var response = true
    switch (resourceType) {
      case 'portfolio':
        var userDetails = this.getUserDetails(curUserId) || {};
        var isInternalUser = userDetails && userDetails.profile ? userDetails.profile.isInternaluser : false
        if (isInternalUser)
          response = false
        else {
          var resourceData = mlDBController.findOne('MlPortfolioDetails', {_id: resourceId}, context) || {}
          var isOwner = _.isMatch(resourceData, {userId: curUserId})
          if (isOwner)
            response = false
        }
        break;
    }
    return response
  }

    buildAggregationQuery(resourceType, userId){
      switch (resourceType){
        case 'portfolio':
          return [
            { $lookup: {
                from: "mlPortfolioDetails",
                localField: "resourceId",
                foreignField: "_id",
                as: "portfolio"
              }
            },
            {$unwind: "$portfolio"},
            { '$lookup': {
                from: "mlAccountTypes",
                localField: "portfolio.accountType",
                foreignField: "_id",
                as: "accountName"
            }},
            {$unwind: "$accountName"},   
            { '$lookup':{
                from: "users",
                localField: "portfolio.userId",
                foreignField: "_id",
                as: "user"
              }
            },
            {$unwind: "$user"},
            { '$lookup': {
                from: "mlStage",
                localField: "resourceId",
                foreignField: "resourceId",
                as: "stage"
              }
            },
            { $project: {
                user:{
                  name:'$user.profile.displayName'
                },
                profileImage:'$user.profile.profileImage',
                account: '$accountName.accountName',
                stage: {
                  "$filter": {
                    input: "$stage",
                    as: "data",
                    cond: { "$eq": ["$$data.userId", userId] }
                  }
                },
                portfolio:1,
                resourceId:1,
              }
            },
            // { $lookup:
            //   {
            //     from: "mlIdeatorPortfolio",
            //     localField: "resourceId",
            //     foreignField: "portfolioDetailsId",
            //     as: "ideator"
            //   }
            // },
            { $lookup:
                {
                  from: "mlIdeas",
                  localField: "resourceId",
                  foreignField: "portfolioId",
                  as: "idea"
                }
            },
            { $lookup:
              {
                from: "mlStartupPortfolio",
                localField: "resourceId",
                foreignField: "portfolioDetailsId",
                as: "startup"
              }
            },
            { $lookup:
              {
                from: "mlFunderPortfolio",
                localField: "resourceId",
                foreignField: "portfolioDetailsId",
                as: "funder"
              }
            },
          ]
        // To do : When all the communality portfolio done,  Will add remaining portfolio here.
        default:
          return [];
      }
    }

    createTransactionRequest(userId, transType, portfolioId, resourceId, fromUserId, fromUserType, context) {
      try {
        var transactionType = transType;
        switch (transactionType) {
          case 'connectionRequest':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'connection',
              'transactionType': 'connectionRequest',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'connection request',
              'context': context || {},
              'transactionTypeId': "connectionRequest",
              'fromUserType': fromUserType,
              'transactionId':orderNumberGenService.createConnectionInteractionId()
            });
            break;
          case 'like':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'like',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'like portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType,
              'transactionId':orderNumberGenService.createLikeInteractionId()
            });
            break;
          case 'favorite':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'favorite',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'favorite portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType
            });
            break;
          case 'follow':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'follow',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'follow portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType
            });
            break;
          case 'inquire':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'inquire',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'inquire portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType
            });
            break;
          case 'review':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'review',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'review portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType,
              'transactionId':orderNumberGenService.createReviewInteractionId()
            });
            break;
          case 'view':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'view',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'view portfolio',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType
            });
            break;
          case 'share':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'interaction',
              'activity': 'share',
              'transactionType': 'interaction',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': portfolioId,
              'transactionDetails': 'share data',
              'context': context || {},
              'transactionTypeId': "interaction",
              'fromUserType': fromUserType
            });
            break;
        }
      } catch (e) {
        //console
        console.log(e);
      }
    }

  fetchConnectionByTransaction(transactionId,transactionType) {
    try {
      switch (transactionType) {
        case 'connectionRequest':
          let transactionRec=new MlTransactionsHandler().readTransaction(transactionId);
          return transactionRec.activityDocId;
          break;
      }
    } catch (e) {
      //console
      console.log(e);
    }
  }

}
const mlInteractionService = new MlInteractionService();
Object.freeze(mlInteractionService);

export default mlInteractionService;

