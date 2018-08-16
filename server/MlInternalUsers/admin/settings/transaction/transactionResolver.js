import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateTransaction'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.transactionName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Transaction Name is Required", code);
    return response;
  } else {
    // let id = MlTransactionTypes.insert({...args});
    let id = mlDBController.insert('MlTransactionTypes', args, context);
    if (id) {
      let code = 200;
      let result = {transactionId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlMutationResolver['UpdateTransaction'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.transactionName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Transaction Name is Required", code);
    return response;
  } else {
    if (args._id) {
      var id = args._id;
      args = _.omit(args, '_id');
      // let result= MlTransactionTypes.update(id, {$set: args});
      let result = mlDBController.update('MlTransactionTypes', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['FindTransaction'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlTransactionTypes.findOne({"_id": id});
    return response;
  }

}

// This is being used in Request Types
MlResolver.MlQueryResolver['fetchTransaction'] = (obj, args, context, info) => {
  // TODO : Authorization

  let response = MlTransactionTypes.find({isActive: true}).fetch();
  return response;

}


