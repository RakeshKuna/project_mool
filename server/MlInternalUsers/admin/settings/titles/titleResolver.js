import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateTitle'] = (obj, args, context, info) => {
  // TODO : Authorization
  // let id = MlGlobalSettings.insert(args);
  let id = mlDBController.insert('MlGlobalSettings', args, context);
  if (id) {
    let code = 200;
    let result = {titleId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
MlResolver.MlMutationResolver['UpdateTitle'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    args = _.omit(args, '_id');
    // let updatedResponse= MlGlobalSettings.update(id, {$set: args});
    let updatedResponse = mlDBController.update('MlGlobalSettings', id, args, {$set: 1}, context);
    return updatedResponse
  }

}
MlResolver.MlQueryResolver['FindTitle'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlGlobalSettings.findOne({"_id": id});
    return response;
  }

}


