/**
 * Created by pankaj on 17/6/17.
 */
import MlResolver from '../../commons/mlResolverDef'
import MlRespPayload from '../../commons/mlPayload'
import MlUserContext from '../../MlExternalUsers/mlUserContext'
var extendify = require('extendify');
import mlOnBoard from '../onBoard/mlOnBoardRepo'
var _ = require('lodash')

MlResolver.MlQueryResolver['fetchStage'] = (obj, args, context, info) => {
  let query = {
    userId:context.userId
  };
  let result = mlDBController.find('MlStage', query , context).fetch()
  return result;
};

MlResolver.MlQueryResolver['fetchStage'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlStage', {_id:args.StageId} , context)
};

MlResolver.MlMutationResolver['createStage'] = (obj, args, context, info) => {
  let userId = context.userId;
  let profile = new MlUserContext(userId).userProfileDetails(userId);
  let stage = args.stage;
  stage.userId = userId;
  stage.profileId = profile.profileId;
  stage.createdAt = new Date();
  if(args.stage.resourceStage!== 'onboard') {
    result = mlDBController.insert('MlStage' ,stage, context);
  } else {
    let response = new MlRespPayload().errorPayload('Investment to be done prior to On-Boarding', 400);
    return response;
  }
  //if onboard create trancaation record;
  if(true || result) {
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
};

MlResolver.MlMutationResolver['updateStage'] = (obj, args, context, info) => {
  let stageDetails = mlDBController.findOne('MlStage', {_id:args.stageId} , context);
  let onBoardRequested = false;
  if(stageDetails) {
    if(args.stage.resourceStage === 'onboard') {
      if (stageDetails && stageDetails.hasInvested) {
        if(stageDetails.onBoardRequest){
          let response = new MlRespPayload().errorPayload('Onboard request is already pending', 400);
          return response
        }
        args.stage.onBoardRequest = true;
        onBoardRequested = true;
        result = mlDBController.update('MlStage', {_id:args.stageId} , {onBoardRequest: true}, {$set:true}, context);
      let user = mlDBController.findOne('MlPortfolioDetails', {_id: args.stage.resourceId}, context);
        var transactionId=orderNumberGenService.createOnBoardTransactionId();
        new mlOnBoard.createTransactionRequest(user.userId, 'investments', args.stage.resourceId, args.stageId, context.userId, 'user', context,transactionId);
      } else {
        let response = new MlRespPayload().errorPayload('Investment to be done prior to On-Boarding', 200);
        return response
      }
    } else {
      result = mlDBController.update('MlStage', {_id:args.stageId} ,args.stage, {$set:true}, context);
    }
    if(result){
      let code = 200;
      let response = new MlRespPayload().successPayload(onBoardRequested ? "Onboard request to sent to user" :result, code);
      return response
    }
  } else {
    if (result) {
      let code = 400;
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }
  }
};

MlResolver.MlMutationResolver['updateOnBoardStage'] = (obj, args, context, info) => {
  let transactionLogDetails = mlDBController.findOne('MlTransactionsLog', {_id: args.transactionLogId}, context);
  let stageDetails = mlDBController.findOne('MlStage', {_id: transactionLogDetails.activityDocId} , context);
  if(stageDetails) {
      if (stageDetails && stageDetails.hasInvested &&  stageDetails.onBoardRequest) {
        stageDetails.onBoardStatus = args.status ;
        let transactionLogStatus = {
          transactionId: transactionLogDetails._id,
          status: args.status
        }
        if(stageDetails.onBoardStatus == "accept"){
          stageDetails.resourceStage = 'onboard';
        }
        stageDetails.onBoardRequest = false;
        stageDetails.transactionLogStatus = stageDetails.transactionLogStatus ? stageDetails.transactionLogStatus : [];
        stageDetails.transactionLogStatus.push(transactionLogStatus);
        result = mlDBController.update('MlStage', {_id:transactionLogDetails.activityDocId} , stageDetails, {$set:true}, context);
        // let user = mlDBController.findOne('MlPortfolioDetails', {_id: transactionLogDetails.docId}, context);
        // new mlOnBoard.createTransactionRequest(user.userId, 'investments', args.stage.resourceId, args.stageId, context.userId, 'user', context)
      } else {
        let response = new MlRespPayload().errorPayload('Investment to be done prior to On-Boarding', 200);
        return response
      }

    if(result){
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    if (result) {
      let code = 400;
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }
  }
};



MlResolver.MlMutationResolver['fetchOnBoardByTransaction'] = (obj, args, context, info) => {
  let transactionId = args.transactionId;
  let userId = context.userId;
  if(transactionId){
    let transactionLogDetails = mlDBController.findOne('MlTransactionsLog', {_id: transactionId }, context);
    let stageDetails = mlDBController.findOne('MlStage', {_id: transactionLogDetails.activityDocId} , context);
    let result = {};
    if( stageDetails.resourceStage == 'onboard' ){
      result.canAccept = false;
      result.canReject = false;
    } else if ( userId == transactionLogDetails.userId ) {
      result.canAccept = true;
      result.canReject = true;
    } else {
      result.canAccept = false;
      result.canReject = false;
    }
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response;
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload('TransactionId is missing', code);
    return response
  }
};

