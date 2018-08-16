/**
 * Created by vishwadeep on 6/6/17.
 */

import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import moment from 'moment'
import _ from 'lodash'

MlResolver.MlMutationResolver['createOfficeTransaction'] = (obj, args, context, info) => {
  var ret = "";
  try {
    if (args.officeTransaction) {
      let officeTransaction = args.officeTransaction;
      officeTransaction['userId'] = context.userId;
      officeTransaction['dateTime']= new Date()
      orderNumberGenService.assignOfficeTransaction(args.officeTransaction)
      ret = mlDBController.insert('MlOfficeTransaction', officeTransaction, context)
      if (!ret) {
        let code = 400;
        let response = new MlRespPayload().successPayload("Failed To Create Office Transaction", code);
        return response;
      }
    }
  }
  catch (e) {
    let code = 400;
    let response = new MlRespPayload().successPayload(e.message, code);
    return response;
  }

  let code = 200;
  let response = new MlRespPayload().successPayload(ret, code);
  return response;
}

MlResolver.MlMutationResolver['updateOfficeTransactionOrderSubscriptionDetail'] = (obj, args, context, info) => {
  if(!args.id){
    let code = 400;
    let response = new MlRespPayload().successPayload("Office transaction id is required", code);
    return response;
  }
  if(!args.orderSubscriptionDetail){
    let code = 400;
    let response = new MlRespPayload().successPayload("Office subscription detail id is required", code);
    return response;
  }
  let dataToUpdate = {
    orderSubscriptionDetails: args.orderSubscriptionDetail
  };
  if(args.orderSubscriptionDetail.cost){
    dataToUpdate.status = "Payment Generated";
  }
  let result = mlDBController.update('MlOfficeTransaction', args.id, dataToUpdate, {$set:true}, context)
  if(result){
    let paymentLink = "";
    let code = 200;
    let response = new MlRespPayload().successPayload('Payment link generated successfully', code);
    return response;
  } else {
    let code = 400;
    let response = new MlRespPayload().successPayload(result, code);
    return response;
  }

}

MlResolver.MlQueryResolver['findOfficeTransaction'] = (obj, args, context, info) => {
  if(!args.officeTransactionId){
    let code = 400;
    let response = new MlRespPayload().successPayload("Office transaction id is required", code);
    return response;
  }
  // let pipeline = [
  //   {'$match':{_id:args.officeTransactionId}},
  //   {'$project' : { trans: '$$ROOT'}},
  //   {'$lookup':{ from: 'users', localField: 'trans.userId', foreignField: '_id', as: 'user'}},
  //   {'$unwind':'$user'},
  //   {'$project':{ trans:1, user: { createdAt : "$user.createdAt", name : '$user.profile.displayName', email : '$user.username', mobile : '$user.profile.mobileNumber' } }},
  //   {'$lookup':{ from: 'mlOffice', localField: 'trans.officeId', foreignField: '_id', as: 'office'}},
  //   {'$unwind':'$office'}
  // ];

  //Commented code for the the new changes

  // let pipeline = [
  //   {'$match':{_id:args.officeTransactionId}},
  //   {'$project' : { trans: '$$ROOT'}},
  //   {'$lookup':{ from: 'users', localField: 'trans.userId', foreignField: '_id', as: 'user'}},
  //   {'$unwind':'$user'},
  //   {'$project':{ trans:1, user: { createdAt : "$trans.dateTime", name : '$user.profile.displayName', email : '$user.username', mobile : '$user.profile.mobileNumber', profileId:'$user.profile.externalUserProfiles.profileId'}}},
  //   {'$lookup':{ from: 'mlOffice', localField: 'trans.officeId', foreignField: '_id', as: 'office'}},
  //   {'$unwind':'$office'},
  //   {'$lookup':{ from: 'mlOfficeSC', localField: 'trans.officeId', foreignField: 'officeId', as: 'officeSC'}},
  //   {'$unwind':'$officeSC'},
  //   {'$lookup':{ from: 'mlOfficeSCDef', localField: 'officeSC.scDefId', foreignField: '_id', as: 'officeSCDef'}},
  //   {'$unwind':'$officeSCDef'}
  // ];
  // let _result = mlDBController.aggregate('MlOfficeTransaction', pipeline);
  // let result = Object.assign({},_result);
  // if(result && result.length>0){
  //   result.map((obj)=>{
  //     if(obj.office && obj.office.country){
  //       let clusterData = mlDBController.findOne('MlClusters', {_id:obj.office.country});
  //       obj.office.country='';
  //       if(clusterData && clusterData.countryName){
  //         obj.office.country = clusterData.countryName;
  //       }
  //     }
  //   });
  // }

  let pipeline = [
    {'$match':{_id:args.officeTransactionId}},
    {'$project' : { trans: '$$ROOT'}},
    {'$lookup':{ from: 'users', localField: 'trans.userId', foreignField: '_id', as: 'user'}},
    {'$unwind':'$user'},
    {'$project':{ trans:1, user: { createdAt : "$trans.dateTime", name : '$user.profile.displayName', email : '$user.username', mobile : '$user.profile.mobileNumber', profileId:'$user.profile.externalUserProfiles.profileId'}}},
    {'$lookup':{ from: 'mlOffice', localField: 'trans.officeId', foreignField: '_id', as: 'office'}},
    {'$unwind':'$office'},
    {'$lookup':{ from: 'mlOfficeSC', localField: 'trans.officeId', foreignField: 'officeId', as: 'officeSC'}},
    {'$unwind':'$officeSC'},
    {'$lookup':{ from: 'mlOfficeSCDef', localField: 'officeSC.scDefId', foreignField: '_id', as: 'officeSCDef'}},
    {'$unwind':'$officeSCDef'},
    {"$lookup":{from: "mlClusters", localField:"office.country", foreignField:"_id", as:"countryName"}},
    {"$unwind":"$countryName"},
  ];

  let _result = mlDBController.aggregate('MlOfficeTransaction', pipeline);
  if(_result){
    _result.map((obj)=>{
      if(obj.countryName && obj.countryName.countryName){
        obj.office.country = obj.countryName.countryName;
      }
    });
  }
  let code = 200;
  let response = new MlRespPayload().successPayload(_result, code);
  return response;
}

MlResolver.MlMutationResolver['officeTransactionPayment'] = (obj, args, context, info) => {
  var ret;
  try {
    let userId = context.userId;
    let curDate = new Date()
    if (args.officeId) {
      var obj = {
        status: 'Payment Received',
        'deviceDetails.ipAddress': context.ip,
        'deviceDetails.deviceName': context.browser,
        paymentDetails: {
          datetime: curDate,
          transactionId: args.transactionId,
          totalAmountPaid: args.amount,
          paymentMode: 'online',
          paymentStatus: 'done',
          isPaid: true
        }
      }
      ret = mlDBController.update('MlOfficeTransaction', {
        officeId: args.officeId,
        userId: userId
      }, obj, {$set: true}, context)
      if (!ret) {
        let code = 400;
        let response = new MlRespPayload().errorPayload('office not updated', code);
        return response;
      }
      let updatedOffice = mlDBController.findOne('MlOfficeTransaction', { officeId: args.officeId, userId: userId}, context) || {}
      let subscriptionObj = {
        userId :userId,
        resId: updatedOffice._id,
        resType : 'office',
        transactionId : args.transactionId,
        subscriptionDate : curDate,
        subscriptionEndDate : moment(curDate).add(365, 'day')._d
      }

      //mlDBController.insert('MlUserSubscriptions', subscriptionObj, context)
    }
  } catch (e) {
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  let code = 200;
  let response = new MlRespPayload().successPayload('office transaction updated' + ret, code);
  return response;
}

// MlResolver.MlQueryResolver['findAllTransaction'] = (obj, args, context, info) => {  //using code in resolver.js
//   let response = []
//   let pipeline = [{
//     '$match': {_id: context.userId}},
//     {'$lookup': {from: 'mlRegistration',localField: '_id',foreignField: 'registrationInfo.userId',as: 'registration'}},
//     {'$lookup':{from:'mlPortfolioDetails',localField:'_id',foreignField:'userId', as:'portfolio'}},
//     {'$lookup':{from:'mlOfficeTransaction',localField:'_id',foreignField:'userId', as:'office'}},
//     {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'userId', as:'transactionLog'}},
//     {'$project':{"R":{
//       '$map':
//       { "input":"$registration", "as":"reg", 'in':
//       { "createdAt" :"$$reg.registrationInfo.registrationDate", "transactionId":"$$reg._id" ,"transactionType":"regisration",username:'$username', firstName:'$profile.firstName', lastName:'$profile.lastName', userId:'$_id'}
//       }
//     },
//       "P":{
//         '$map':
//         { "input":"$portfolio", "as":"port", 'in':
//         { "createdAt" :"$$port.timeStamp", "transactionId":"$$port._id" ,"transactionType":"portfolio", username:'$username', firstName:'$profile.firstName', lastName:'$profile.lastName', userId:'$_id'}
//         }
//       },
//       "O":{
//         '$map':
//         { "input":"$office", "as":"off", 'in':
//         { "createdAt" :"$$off.dateTime", "transactionId":"$$off._id" ,"transactionType":"office", username:'$username', firstName:'$profile.firstName', lastName:'$profile.lastName' , userId:'$_id'}
//         }
//       },
//       "T":{
//         '$map':
//         { "input":"$transactionLog", "as":"trans", 'in':
//         { "createdAt" :"$$trans.createdAt", "transactionId":"$$trans._id" ,"transactionType":"transaction", username:'$username', firstName:'$profile.firstName', lastName:'$profile.lastName', userId:'$_id'}
//         }
//       }
//     }}
//   ]
//   response = mlDBController.aggregate('users', pipeline);
//   let res = _.concat(response[0].R, response[0].P, response[0].O, response[0].T)
//   return res
// }
