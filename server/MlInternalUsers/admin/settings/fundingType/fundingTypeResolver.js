/**
 * Created by rajatshekhar on 27/4/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['createFundingType'] = (obj, args, context, info) => {
  var firstName='';var lastName='';
  // let id = MlDepartments.insert({...args.department});
  if(Meteor.users.findOne({_id : context.userId}))
  {
    let user = Meteor.users.findOne({_id: context.userId}) || {}
    if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

      firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
      lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
    }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName=(user.profile || {}).firstName||'';
      lastName =(user.profile || {}).lastName||'';
    }
  }
  let createdBy = firstName +' '+lastName
  args.fundingType.createdBy = createdBy;
  args.fundingType.createdDate = new Date();
  if(args && args.fundingType){
    try{
      // let ret = MlFundingTypes.insert({...args.fundingType});
      let ret = mlDBController.insert('MlFundingTypes', args.fundingType, context);
      if(ret){
        let response = new MlRespPayload().successPayload("'Funding Type' added successfully", 200);
        return response;
      }
      else{
        let response = new MlRespPayload().errorPayload("Funding Type could not be added", 400);
        return response;
      }
    }
    catch (e){
      let response = new  MlRespPayload().errorPayload(e.message, 400);
      return response;
    }

  }
}

MlResolver.MlMutationResolver['updateFundingType'] = (obj, args, context, info) => {
  var firstName='';var lastName='';
  // let id = MlDepartments.insert({...args.department});
  if(Meteor.users.findOne({_id : context.userId}))
  {
    let user = Meteor.users.findOne({_id: context.userId}) || {}
    if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

      firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
      lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
    }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName=(user.profile || {}).firstName||'';
      lastName =(user.profile || {}).lastName||'';
    }
  }
  let createdBy = firstName +' '+lastName
  args.fundingType.updatedBy = createdBy;
  args.fundingType.updatedDate = new Date();

  if(args && args.fundingTypeId && args.fundingType){
    try{
      // let resp = MlFundingTypes.update({_id: args.fundingTypeId}, {$set: args.fundingType}, {upsert: true});
      let resp = mlDBController.update('MlFundingTypes', args.fundingTypeId, args.fundingType, {
        $set: 1,
        upsert: true
      }, context);
      if(resp){
        let response = new MlRespPayload().successPayload("'Funding Type' updated successfully", 200);
        return response;
      }
      else{
        let response = new MlRespPayload().errorPayload("Funding Type could not be updated", 400);
        return response;
      }
    }
    catch (e){
      let response = new MlRespPayload().errorPayload(e.message, 400);
      return response;
    }
  }
}

MlResolver.MlQueryResolver['fetchFundingType'] = (obj, args, context, info) => {
  if(args && args.fundingTypeId){
    return MlFundingTypes.findOne({"_id":args.fundingTypeId})
  }
}


MlResolver.MlQueryResolver['fetchFundingTypes'] = (obj, args, context, info) => {
  return MlFundingTypes.find({isActive : true}).fetch();
}
