/**
 * Created by venkatsrinag on 6/6/17.
 */
import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import MlEmailNotification from "../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlSMSNotification from "../../../mlNotifications/mlSmsNotifications/mlSMSNotification"
import {userAgent} from '../../../commons/utils'

MlResolver.MlQueryResolver['fetchProcessTransactions'] = (obj, args, context, info) =>{
}

MlResolver.MlQueryResolver['fetchProcessStages'] = (obj, args, context, info) =>{
    let processStage = mlDBController.find('MlProcessStages', {isActive:true}, context).fetch()
    if(processStage){
      return processStage
    }
  return {};
}

MlResolver.MlQueryResolver['fetchProcessActions'] = (obj, args, context, info) =>{
  let result = mlDBController.find('MlActions', {isActive: true,'isProcessAction':true}).fetch() || []
  return result
}

MlResolver.MlQueryResolver['fetchProcessTransactionCustomerDetails'] = (obj, args, context, info) =>{
}

MlResolver.MlQueryResolver['fetchProcessSetup'] = (obj, args, context, info) =>{
  if(args.processTransactionId){
    let processSetup = mlDBController.findOne('MlProcessSetup', {processTransactionId:args.processTransactionId}, context)
    if(processSetup){
        return processSetup
    }
  }
  return {};
}

MlResolver.MlQueryResolver['fetchUserProcessSetup'] = (obj, args, context, info) => {
  if (context.userId) {
    let Actions = mlDBController.find('MlActions', {}, context).fetch();
    let processSetup = mlDBController.findOne('MlProcessSetup', {userId: context.userId}, context)
    if (processSetup) {
      processSetup.processSteps.map(function (steps, index) {
        if (processSetup.processSteps[index]) {
          let stageData = MlProcessStages.findOne({"_id": steps.stageId}) || {};
          processSetup.processSteps[index].stageName = stageData.displayName || "";
          processSetup.processSteps[index].stage = stageData.name || "";

          if(processSetup.processSteps[index].stageActions && processSetup.processSteps[index].stageActions.length ){
            processSetup.processSteps[index].stageActions = processSetup.processSteps[index].stageActions.map(function (action) {
              let isFind = Actions.find(function (mlAction) {
                 return mlAction._id == action.actionId
              });
              if(isFind){
                action.actionName = isFind.name;
              }

              return action;

            });
          }
        }
      })
      return processSetup
    }
  }
  return {};
}

MlResolver.MlMutationResolver['createProcessTransaction'] = (obj, args, context, info) => {
  if (args.portfoliodetails) {
    let ret;
    try {
      var trans = mlDBController.findOne('MlProcessTransactions', {
        portfolioId: args.portfoliodetails.portfolioId
      }, context)
      if (!trans) {
        let machineInfo = userAgent(context.browser);
        var deviceInfo = {
          deviceName: machineInfo.osName,
          deviceId: machineInfo.osVersion,
          ipAddress: context.ip
        }
        args.portfoliodetails["deviceDetails"] =  deviceInfo;
        orderNumberGenService.assignProcessSetupTransaction(args.portfoliodetails)
        ret = mlDBController.insert('MlProcessTransactions', args.portfoliodetails, context)
      }else{
        let code = 400;
        let response = new MlRespPayload().errorPayload('Process setup already exists', code);
        return response;
      }
    } catch (e) {
      let code = 409;
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
    let code = 200;
    let response = new MlRespPayload().successPayload(ret, code);
    return response;
  }
}

MlResolver.MlMutationResolver['updateProcessSetup'] = (obj, args, context, info) =>{
  if(args.processTransactionId){
    let ret;
    let processSetup = mlDBController.findOne('MlProcessSetup', {processTransactionId:args.processTransactionId}, context)
    let machineInfo = userAgent(context.browser);
    var deviceInfo = {
      deviceName: machineInfo.osName,
      deviceId: machineInfo.osVersion,
      ipAddress: context.ip
    }
    args.processSetup["deviceDetails"] =  deviceInfo;
    if(processSetup){
      processSetup["deviceDetails"] =  deviceInfo;
        try{
          ret = mlDBController.update('MlProcessSetup', {processTransactionId:args.processTransactionId}, args.processSetup, {$set:true}, context)
        }catch(e){
          let code = 409;
          let response = new MlRespPayload().errorPayload(e.message, code);
          return response;
        }
    }else{
        try{
          var process = mlDBController.findOne('MlProcessTransactions', {_id:args.processTransactionId}, context)
          var users = mlDBController.findOne('users', {_id:process.userId}, context)
          if(users)
          args.processSetup.username = users.username;

          ret = mlDBController.insert('MlProcessSetup', args.processSetup, context)
        }catch(e){
          let code = 409;
          let response = new MlRespPayload().errorPayload(e.message, code);
          return response;
        }
    }

     if(ret){
      let userId = processSetup&&processSetup.userId?processSetup.userId:""
       var userDetails = mlDBController.findOne('users', {_id:userId}, context)
       MlEmailNotification.processSetupCompletedByAdmin(userDetails)
       MlSMSNotification.processSetupCompleted(userId)
     }

    let code = 200;
    let response = new MlRespPayload().successPayload(ret, code);
    return response;

  }
}

MlResolver.MlMutationResolver['updateProcessTransaction'] = (obj, args, context, info) =>{
  var ret='';
  try{
    if(!args.processTransactions){
      let code = 400;
      let response = new MlRespPayload().successPayload("Invalid Request", code);
      return response;
    }
    let deviceDetails = {
      ipAddress : context.ip,
      deviceName : context.browser
    }
    args.processTransactions.deviceDetails = deviceDetails;
    ret = mlDBController.update('MlProcessTransactions', {_id:args.processTransactionId}, args.processTransactions, {$set:true}, context)
    if(!ret) {
      let code = 200;
      let response = new MlRespPayload().errorPayload('Error', code);
      return response;
    }
  }catch(e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  /*if(ret){
    MlEmailNotification.officePaymentLink()
  }*/
  let code = 200;
  let response = new MlRespPayload().successPayload('Payment link generated successfully'+ret, code);
  return response;
}
