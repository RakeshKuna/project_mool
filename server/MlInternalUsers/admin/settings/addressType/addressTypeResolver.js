import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['updateAddressType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let updatedResponse= MlGlobalSettings.update(id, {$set: args.addressType});
    let updatedResponse= mlDBController.update('MlGlobalSettings', id, args.addressType, {$set:true}, context)
    return updatedResponse
  }

}
MlResolver.MlQueryResolver['findAddressType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let response= MlGlobalSettings.findOne({"_id":id});
    let response= mlDBController.findOne('MlGlobalSettings', {_id: id}, context)
    return response;
  }

}
MlResolver.MlMutationResolver['createAddressType'] = (obj, args, context, info) =>{
  // if(MlGlobalSettings.find({_id:args.addressType._id}).count() > 0){
  if(mlDBController.find('MlGlobalSettings', {_id:args.addressType._id}, context).count() > 0){
    let code = 409;
    return new MlRespPayload().errorPayload("'Address type' already exists", code);
  }
  // let id = MlGlobalSettings.insert({...args.addressType});
  let id = mlDBController.insert('MlGlobalSettings', args.addressType, context)
  if(id){
    let code = 200;
    let result = {addressTypeId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}
MlResolver.MlQueryResolver['fetchAddressTypes'] = (obj, args, context, info) => {

  let result=MlMasterSettings.find({type:"ADDRESSTYPE"}).fetch()||[];
  let temp1 = [];
  result.map(function(address){
    if(address.addressTypeInfo){
       var temp =  {_id:address._id};
       address.addressTypeInfo._id = address._id;
       temp1.push(address.addressTypeInfo);
      return address;
    }
  })
  return temp1;

}


