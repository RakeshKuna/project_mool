import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['updateNumericalFormat'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    // let updatedResponse= MlGlobalSettings.update(id, {$set: args.numericalFormat});
    let updatedResponse = mlDBController.update('MlGlobalSettings', id, args.numericalFormat, {$set: 1}, context);
    return updatedResponse
  }

}
MlResolver.MlQueryResolver['findNumericalFormat'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlGlobalSettings.findOne({"_id": id});
    return response;
  }

}
MlResolver.MlMutationResolver['createNumericalFormat'] = (obj, args, context, info) => {
  if (MlGlobalSettings.find({_id: args.numericalFormat._id}).count() > 0) {
    let code = 409;
    return new MlRespPayload().errorPayload("'Numerical format' already exists!", code);
  }
  // let id = MlGlobalSettings.insert({...args.numericalFormat});
  let id = mlDBController.insert('MlGlobalSettings', args.numericalFormat, context);
  if (id) {
    let code = 200;
    let result = {languageId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
// MlResolver.MlQueryResolver['fetchDocumentsType'] = (obj, args, context, info) => {
//   let result=MlDocumentTypes.find({isActive:true}).fetch()||[];
//   return result;
// }


