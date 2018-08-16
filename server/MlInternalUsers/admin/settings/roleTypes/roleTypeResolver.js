import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['UpdateRoleType'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (args._id) {
    var id = args._id;
    args = _.omit(args, '_id');
    // let result= MlRoleTypes.update(id, {$set: args});
    let result = mlDBController.update('MlRoleTypes', id, args, {$set: 1}, context);
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
};

MlResolver.MlQueryResolver['FindRoleType'] = (obj, args, context, info) => {
  if (args._id) {
    var id = args._id;
    let response = MlRoleTypes.findOne({"_id": id});
    return response;
  }
}


