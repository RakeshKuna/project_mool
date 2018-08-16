/**
 * Created by venkatsrinag on 21/6/17.
 */
import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import MlUserContext from '../../../MlExternalUsers/mlUserContext'



MlResolver.MlQueryResolver['fetchInteractionSC'] = (obj, args, context, info) => {
  try {
    let records = MlInteractionSCDef.find().fetch();
    return records;
  }catch (e){
    throw new Error(e.message);
  }
}

MlResolver.MlQueryResolver['fetchInteractionSCDef'] = (obj, args, context, info) => {

}

MlResolver.MlMutationResolver['createInteractionSCDef'] = (obj, args, context, info) => {
  if(!args.scDefObject){
    let code = 400;
    let response = new MlRespPayload().errorPayload("Error in Creating Definition", code);
    return response
  }
  try{
    let actionList = args.scDefObject.actionList
    let scDef = {
      actionList:actionList,
      isCarryForward:args.scDefObject.isCarryForward,
      carryForwardActions:args.scDefObject.carryForwardActions,
      carryForwardExpirationLimit:args.scDefObject.carryForwardExpirationLimit,
      isActive:args.scDefObject.isActive,
      createdOn:new Date()
    }
    orderNumberGenService.createInteractionSCcode(scDef)
    let ret = MlInteractionSCDef.insert(scDef)
  }catch (e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response
  }
  let code = 200;
  let response = new MlRespPayload().successPayload("Successfully Created", code);
  return response
}

MlResolver.MlMutationResolver['updateInteractionSCDef'] = (obj, args, context, info) => {
}
