import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['updateDateAndTime'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let updatedResponse= MlGlobalSettings.update(id, {$set: args.dateAndTime});
    let updatedResponse= mlDBController.update('MlGlobalSettings', id, args.dateAndTime, {$set:true}, context)
    return updatedResponse
  }

}
MlResolver.MlQueryResolver['findDateAndTime'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let response= MlGlobalSettings.findOne({"_id":id});
    let response= mlDBController.findOne('MlGlobalSettings', {_id: id}, context)

    return response;
  }

}
MlResolver.MlMutationResolver['createDateAndTime'] = (obj, args, context, info) =>{
  // if(MlGlobalSettings.find({_id:args.dateAndTime._id}).count() > 0){
  if(mlDBController.find('MlGlobalSettings', {_id:args.dateAndTime._id}, context).count() > 0){
    let code = 409;
    return new MlRespPayload().errorPayload("Already Exist", code);
  }
  // let id = MlGlobalSettings.insert(args.dateAndTime);
  let id = mlDBController.insert('MlGlobalSettings', args.dateAndTime, context)
  if(id){
    let code = 200;
    let result = {dateAndTimeId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
// MlResolver.MlQueryResolver['fetchDocumentsType'] = (obj, args, context, info) => {
//   let result=MlDocumentTypes.find({isActive:true}).fetch()||[];
//   return result;
// }

MlResolver.MlQueryResolver['findDateFormat'] = (obj, args, context, info) => {
  // TODO : Authorization
  let response= MlDateFormats.find({}).fetch() || [];
  return response;
}

MlResolver.MlQueryResolver['findTimeFormat'] = (obj, args, context, info) => {
  // TODO : Authorization
  let response= MlTimeFormats.find({}).fetch() || [];
  return response;
}

MlResolver.MlQueryResolver['findWeekDays'] = (obj, args, context, info) => {
  // TODO : Authorization
  let response= MlWeekDays.find({}).fetch() || [];
  return response;
}



