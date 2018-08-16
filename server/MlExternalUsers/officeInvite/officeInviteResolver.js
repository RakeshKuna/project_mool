/**
 * Created by vishwadeep on 8/6/17.
 */
import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";

MlResolver.MlMutationResolver['createOfficeInvite'] = (obj, args, context, info) => {
  var ret=''
  try{
    if(args.officeInvite){
      ret = mlDBController.insert('MlOfficeInvite', args.officeInvite, context)
    }else {
      let code = 400;
      let response = new MlRespPayload().errorPayload("office Field required", code);
      return response;
    }
  }catch (e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  let code = 200;
  let response = new MlRespPayload().successPayload(ret, code);
  return response;
}

MlResolver.MlQueryResolver['fetchAllOfficeInvite'] = (obj, args, context, info) => {
  var result=[]
  try{
    result = mlDBController.find('MlOfficeInvite', {}, context).fetch()
  }catch (e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  return result
}

MlResolver.MlQueryResolver['fetchUserOfficeInvite'] = (obj, args, context, info) => {
  var result=[]
  try{
    result = mlDBController.find('MlOfficeInvite', {officeId:args.officeId}, context).fetch()
  }catch (e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }
  return result
}

MlResolver.MlMutationResolver['updateOfficeInvite'] = (obj, args, context, info) => {
  var resp = '';
  try{
    let invite = mlDBController.findOne('MlOfficeInvite', {_id: args.inviteId}, context)
    if(invite){
      for(key in args.officeInvite){
        invite[key] = args.officeInvite[key]
      }
      resp = mlDBController.update('MlOfficeInvite', args.inviteId, invite, {$set:true}, context)
      if(!resp){
        let code = 400;
        let response = new MlRespPayload().errorPayload('Update failed', code);
        return response
      }else {
        let code = 200;
        let result = {invite: resp}
        let response = new MlRespPayload().successPayload(result, code);
        return response
      }
    }else {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Invite was not found', code);
      return response
    }
  }catch(e){
    let code = 400;
    let response = new MlRespPayload().errorPayload(e.message, code);
    return response;
  }

}

//create mutation
  // mutation ($officeInvite: officeInvite) {
  //   createOfficeInvite(officeInvite: $officeInvite) {
  //     success
  //     code
  //     result
  //   }
  // }

//updateOfficeInvite
  // mutation ($officeInvite: officeInvite, $inviteId: String) {
  //   updateOfficeInvite(officeInvite: $officeInvite, inviteId: $inviteId) {
  //     success
  //     code
  //     result
  //   }
  // }
