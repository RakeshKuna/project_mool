/**
 * Created by venkatsrinag on 6/5/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import _ from 'lodash'
import mlInteractionService from '../mlInteractionRepoService';
import MlEmailNotification from '../../../mlNotifications/mlEmailNotifications/mlEMailNotification'
import MlAlertNotification from '../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlSubChapterAccessControl from './../../../mlAuthorization/mlSubChapterAccessControl';
import MlNotificationController from '../../../mlNotifications/mlAppNotifications/mlNotificationsController'
/*STATUS
 0 - Pending
 1 - Accepted
 2 - Declined
 3 - Blocked*/
var generateConnectionCode=function(u1,u2){
  var connectionCode=u1+u2;
  if(u1>u2)connectionCode=u2+u1;
  if(u1===u2)connectionCode=null;
  return connectionCode;
}

MlResolver.MlQueryResolver['fetchConnections'] = (obj, args, context, info) => {
  let userConnections = [];
  if (context && context.userId) {
    //todo: pagination based result
    var pipeline=[{$match:{'users':{$elemMatch:{'userId':context.userId}},isAccepted:true}},
      {$unwind :"$users" },
      {$match:{'users.userId':{$ne:context.userId}}},
      {$lookup:{from:'users',localField:'users.userId',foreignField:'_id',as:'userDetails'}},//join with user
      {$unwind:'$userDetails'},{$unwind:'$userDetails.profile.externalUserProfiles'},
      //match the default profile of user //'userDetails.profile.externalUserProfiles.isDefault':true
      //todo:check with business to display multiple profiles for multiple users
      {$match:{'userDetails.profile.isActive':true,'userDetails.profile.externalUserProfiles.isActive':true}},
      {$group : {_id:'$connectionCode',// display first profile of user
        'id':{ $first: '$_id'},//connection Object Id
        'userId':{ $first: "$users.userId"},
        'userName':{ $first: "$users.userName"},
        'firstName':{ $first:'$userDetails.profile.firstName'},
        'lastName':{ $first:'$userDetails.profile.lastName'},
        'displayName':{ $first:'$userDetails.profile.displayName'},
        'profileImage':{ $first:"$userDetails.profile.profileImage"},
        'profileId':{ $first:"$userDetails.profile.profileId"},
        'countryName':{ $first:'$userDetails.profile.externalUserProfiles.countryName'},
        'communityName':{ $first:'$userDetails.profile.externalUserProfiles.communityName'},
        'communityCode':{ $first:'$userDetails.profile.externalUserProfiles.communityDefCode'}
      }}];
    userConnections=mlDBController.aggregate('MlConnections',pipeline,context);
  }

  return userConnections
}

MlResolver.MlQueryResolver['fetchConnectionByTransaction'] = (obj, args, context, info) => {
  try {
    if(!args.transactionId&&!context.userId){
      return null;
    }
    var connectionId=mlInteractionService.fetchConnectionByTransaction(args.transactionId,'connectionRequest')||{};
    var connection = mlDBController.findOne('MlConnections',{'_id':connectionId},context);
    var requestedConnection=mlDBController.findOne('MlConnections',{_id:connection._id,isAccepted:false,isBlocked:false,isDenied:false,requestedFrom:{'$ne':context.userId}},context);
    if(requestedConnection){connection.canAccept=true;connection.canReject=true;}

    return connection;
  } catch (e) {
    return null;
  }
}


/*
* This method returns creates the connection request.
* @param resourceType and resourceId containing resource details
* returns result if connection request is successuful
*/
MlResolver.MlMutationResolver['connectionRequest'] = (obj, args, context, info) => {
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

    var users = [];
    var connection = {};
    var resp=null;
    var resourceDetails = mlInteractionService.fetchResourceBasedUserDetails(args.resourceType, args.resourceId, context);
    var fromuser = resourceDetails.contextUser;
    var toUser = resourceDetails.resourceOwner;
    if (!toUser._id || !fromuser._id || fromuser._id===toUser._id) {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Invalid User', code);
      return response;
    }
    let isValidFromUser = mlInteractionService.validateExternalUser(fromuser);
    let isValidToUser = mlInteractionService.validateExternalUser(toUser);
    if (!isValidToUser || !isValidFromUser) {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Invalid User', code);
      return response;
    }
    var connectionCode=generateConnectionCode(fromuser._id,toUser._id);
    //todo: index the connectionCode
    let isAlreadyExist = mlDBController.findOne('MlConnections',{'connectionCode':connectionCode},context);
    //if connection request does not exist
    if (!isAlreadyExist) {
      users.push({userId: fromuser._id,userName: fromuser.username,isFavourite: false});
      users.push({userId:toUser._id,userName: toUser.username,isFavourite: false});
      connection = {
        users: users,
        requestedFrom: context.userId,
        connectionCode:connectionCode,
        actionUserId:context.userId,
        createdBy:fromuser.username,createdAt:new Date(),
        isAccepted: false,isDenied: false,
        isBlocked:false,resendCount: 0,status:0};

      resp = mlDBController.insert('MlConnections',connection,context);
      //create the transaction record and log
      if(resp){
        let fromUserType = 'user';
        mlInteractionService.createTransactionRequest(toUser._id,'connectionRequest', args.resourceId, resp, fromuser._id, fromUserType , context);
          if(toUser._id&&fromuser._id){
            MlEmailNotification.endUserPortfolioConnect(fromuser._id,toUser._id);
            MlEmailNotification.portfolioConnectRequestReceived(fromuser._id,toUser._id);
            MlNotificationController.onConnectionRequestSent(fromuser._id,toUser._id);
            MlNotificationController.onConnectionRequestReceived(fromuser._id,toUser._id);
          }
      }
      let connectRequest = MlAlertNotification.onConnectionRequestSent(toUser._id);
      return  new MlRespPayload().successPayload(connectRequest, 200);
    }
    /*other conditions for connection request
    /*connection request is re-send only if
     1- user rejects the connection request.same user can only send the request.
     2- Note: if connection is blocked. then requestedFrom should be reset(or connection object should be deleted)
     3-$0r condition 1)isDenied:false only if the connection is reset and requestedFrom is empty
                     2)isDenied:true and requestFrom is not current user*/
    resp=mlDBController.update('MlConnections',{connectionCode:connectionCode,isBlocked:false,isAccepted:false,$or:[{isDenied:false,requestedFrom:{'$type': 10}},{isDenied:true,requestedFrom:{$ne:fromuser._id}}]},
                                         {updatedBy:fromuser.username,updatedAt:new Date(),actionUserId:fromuser._id,isDenied:false,requestedFrom:fromuser._id,status:0},
                                         {$set:true},context);
    if(resp===1){
      ////create the transaction record and log
      let fromUserType = 'user';
      let connectionRec=mlDBController.findOne('MlConnections',{connectionCode:connectionCode},context)||{};
      //mlInteractionService.createTransactionRequest(toUser._id,'connectionRequest',connectionRec._id);
      mlInteractionService.createTransactionRequest(toUser._id,'connectionRequest', args.resourceId,connectionRec._id, fromuser._id, fromUserType , context);
      return new MlRespPayload().successPayload(resp,200)
    };



  } catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  let code = 200;
  let response = new MlRespPayload().errorPayload('connection request failed', code);
  return response;
}

/*
 * This method returns success of accept connection request.
 * @param connectionId containing connection details
 * returns result if connection accepted
 */
MlResolver.MlMutationResolver['acceptConnection'] = (obj,args, context, info) => {
  try {
    let users
    var connectionId = args.connectionId;
    var connection = mlDBController.findOne('MlConnections',{'_id':connectionId,"users.userId": context.userId},context)||{};
    var contextUser =  mlInteractionService.getUserDetails(context.userId);

    var result=mlDBController.update('MlConnections',
      //condition - accept the connection if requestFrom is from another user
      {_id:connection._id,isAccepted:false,isBlocked:false,isDenied:false,requestedFrom:{'$ne':contextUser._id}},
      {isAccepted:true,isBlocked:false,isDenied:false,updatedBy:contextUser.username,updatedAt:new Date(),actionUserId:contextUser._id,status:1},//update doc
      {$set:true},context);

    if(result===0){ return new MlRespPayload().errorPayload('Failed to accept the connection request', 400);}
    if(result){
      let fromUser = connection&&connection.users&&connection.users.length>0&&connection.users[0]&&connection.users[0].userId?connection.users[0].userId:""
      users =  MlAlertNotification.onConnectionSenderAccept(fromUser);
    }
    return new MlRespPayload().successPayload(users, 200);
  } catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
}

MlResolver.MlMutationResolver['rejectConnection'] = (obj,args, context, info) => {
  try {
    let userdata;
    var connectionId = args.connectionId;
    var connection = mlDBController.findOne('MlConnections',{'_id':connectionId,"users.userId": context.userId},context)||{};
    var contextUser =  mlInteractionService.getUserDetails(context.userId);

    var result=mlDBController.update('MlConnections',
      //condition - reject of the connection happens only if requestFrom is from another user
      {_id:connection._id,isAccepted:false,isBlocked:false,isDenied:false,requestedFrom:{'$ne':contextUser._id}},
      {isAccepted:false,isBlocked:false,isDenied:true,updatedBy:contextUser.username,updatedAt:new Date(),actionUserId:contextUser._id,status:2},//update doc
      {$set:true},context);
    if(result===0){ return new MlRespPayload().errorPayload('Failed to reject the connection request', 400);}
    if(result){
      let fromUser = connection&&connection.users&&connection.users.length>0&&connection.users[0]&&connection.users[0].userId?connection.users[0].userId:""
      let toUser = connection&&connection.users&&connection.users.length>0&&connection.users[1]&&connection.users[1].userId?connection.users[1].userId:""
      MlEmailNotification.portfolioConnectRequestDecline(fromUser,toUser);
      userdata =  MlAlertNotification.onConnectionSenderDeclined(fromUser);
    }
    return new MlRespPayload().successPayload(userdata, 200);
  }catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
}

MlResolver.MlQueryResolver['fetchConnectionsByReg'] = (obj, args, context, info) => {
  var response = []
  if (args && args.registrationId && args.communityCode) {
    var query = [
      {$match:{_id:args.registrationId}},
      {$lookup:{from:'mlConnections',localField:'registrationInfo.userId', foreignField:'users.userId',as:'connections'}},
      {$unwind :"$connections"},
      {$unwind :"$connections.users"},
      {$project : { isEqual:  { "$cmp": [ "$connections.users.userId", "$registrationInfo.userId" ] },
        "connections":1, userId:1 }},
      {$match: {'isEqual': 1 } },
      {$replaceRoot:{newRoot:"$connections"}},
      {$lookup:{from:'users',localField:'users.userId',foreignField:'_id',as:'userDetails'}},
      {$unwind:'$userDetails'},{$unwind:'$userDetails.profile.externalUserProfiles'},
      {$match:{'userDetails.profile.isActive':true,
        'userDetails.profile.externalUserProfiles.isActive':true,
        'userDetails.profile.externalUserProfiles.communityDefCode':args.communityCode}},
         {$group : {_id:'$connectionCode',
        'id':{ $first: '$_id'},
        'userId':{ $first: "$users.userId"},
        'userName':{ $first: "$users.userName"},
        'firstName':{ $first:'$userDetails.profile.firstName'},
        'lastName':{ $first:'$userDetails.profile.lastName'},
        'displayName':{ $first:'$userDetails.profile.displayName'},
        'profileImage':{ $first:"$userDetails.profile.profileImage"},
        'profileId':{ $first:"$userDetails.profile.profileId"},
        'countryName':{ $first:'$userDetails.profile.externalUserProfiles.countryName'},
        'chapterName':{ $first:'$userDetails.profile.externalUserProfiles.chapterName'},
      }}
    ]
    response = mlDBController.aggregate('MlRegistration', query, context);
  }
  return response
}

MlResolver.MlQueryResolver['fetchConnectionByUser'] = (obj, args, context, info) => {
  var response = [];
  var query = [
    {$match:{'isAccepted': true}},
    {$match:{'users.userId': context.userId}},
    {$unwind :"$users"},
    {$match:{'users.userId': {$ne: context.userId}}},
    {$lookup:{from: 'users', localField: 'users.userId', foreignField: '_id', as:'users'}},
    {$unwind :"$users"},
    {$unwind :"$users.profile.externalUserProfiles"},
    { $project:
      {
        _id: 0,
        name:
          { $concat: [ "$users.profile.displayName", "-", "$users.profile.externalUserProfiles.clusterName", "-", "$users.profile.externalUserProfiles.communityDefName" ]},
        profileId: "$users.profile.externalUserProfiles.profileId",
        userId: "$users._id",
        profileImage: "$users.profile.profileImage",
      }

    }
  ];
  response = mlDBController.aggregate('MlConnections', query, context);
  return response;
}
