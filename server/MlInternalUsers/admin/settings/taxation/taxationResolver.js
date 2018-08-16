import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['createTaxation'] = (obj, args, context, info) => {
  // TODO : Authorization
  // let id = MlTaxation.insert({...args.taxation});
  let id = mlDBController.insert('MlTaxation', args.taxation, context)
  if (id) {
    let code = 200;
    let result = {taxationId: id}
    let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
    return response
  }
}

MlResolver.MlMutationResolver['updateTaxation'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    args=_.omit(args,'_id');
    // let updatedResponse = MlTaxation.update(id, {$set: args.taxation});
    let updatedResponse = mlDBController.update('MlTaxation', id, args.taxation, {$set:true}, context)
    return updatedResponse
  }
}

MlResolver.MlQueryResolver['fetchTaxation'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    // let response = MlTaxation.findOne({"_id":id});
    let response = mlDBController.findOne('MlTaxation', {_id: id}, context)
    return response;
  }
}


