import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'

MlResolver.MlMutationResolver['createContactType'] = (obj, args, context, info) =>{
  if(MlGlobalSettings.find({_id:args.contactType._id}).count() > 0){
    let code = 409;
    return new MlRespPayload().errorPayload("Already Exist", code);
  }
  // let id = MlGlobalSettings.insert({...args.contactType});
  let id = mlDBController.insert('MlGlobalSettings', args.contactType, context);
  if(id){
    let code = 200;
    let result = {addressTypeId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}

MlResolver.MlMutationResolver['updateContactType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let updatedResponse= MlGlobalSettings.update(id, {$set: args.contactType});
    let updatedResponse = mlDBController.update('MlGlobalSettings', id, args.contactType, {$set: 1}, context);
    return updatedResponse
  }

}
MlResolver.MlQueryResolver['findContactType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    let response= MlGlobalSettings.findOne({"_id":id});
    return response;
  }

}
MlResolver.MlQueryResolver['fetchContactTypes'] = (obj, args, context, info) => {
  // TODO : Authorization

    let response= MlGlobalSettings.find({"isActive":true}).fetch();
    return response;
}
