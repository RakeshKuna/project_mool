import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'

MlResolver.MlMutationResolver['createRegional'] = (obj, args, context, info) => {
  if (MlGlobalSettings.find({"regionalCurrencyName": args.regional.regionalCurrencyName}).count() > 0) {
    let code = 409;
    return new MlRespPayload().errorPayload("Already Exist", code);
  }
  // let id = MlGlobalSettings.insert({...args.regional});
  let id = mlDBController.insert('MlGlobalSettings', args.regional, context);
  if (id) {
    let code = 200;
    let result = {regionalId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
//
MlResolver.MlMutationResolver['updateRegional'] = (obj, args, context, info) => {
  let regional = MlGlobalSettings.findOne({_id: args._id});
  if (regional) {
    /* for(key in args.department){
     cluster[key] = args.department[key]
     }*/
    // let resp = MlGlobalSettings.update({_id:args._id}, {$set:args.regional}, {upsert:true});
    let resp = mlDBController.update('MlGlobalSettings', args._id, args.regional, {
      $set: 1,
      upsert: true
    }, context);
    if (resp) {
      let code = 200;
      let result = {regional: resp}
      let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
      return response
    }
  }

}
//
// MlResolver.MlQueryResolver['fetchDepartments'] = (obj, args, context, info) => {
//   let result=MlDepartments.find({isActive:true}).fetch()||[];
//   return result;
// }
//
MlResolver.MlQueryResolver['fetchRegional'] = (obj, args, context, info) => {
  let resp = MlGlobalSettings.findOne({_id: args._id});
  return resp;
  if (resp) {
    let code = 200;
    let result = {regional: resp}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
