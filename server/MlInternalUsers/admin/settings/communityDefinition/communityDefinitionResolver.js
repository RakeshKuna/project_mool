import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import MlAdminUserContext from "../../../../mlAuthorization/mlAdminUserContext";
var _ = require('lodash')

//todo:// query are been duplicated check and remove the un-used onces
MlResolver.MlQueryResolver['fetchCommunityDefinition'] = (obj, args, context, info) => {
  let result=MlCommunityDefinition.find({isActive:true}).fetch()||[];
  return result;
}
MlResolver.MlQueryResolver['fetchCommunityDefinitionForRegistration'] = (obj, args, context, info) => {
  var loggedInUser = new MlAdminUserContext().userProfileDetails(context.userId);
  var result = []
  if(loggedInUser.roleName == "communityadmin"){
    let communities = _.map(loggedInUser.defaultCommunities, "communityCode");
    result=MlCommunityDefinition.find({isActive:true, code:{$in:communities}}).fetch()||[];
  }else{
    result=MlCommunityDefinition.find({isActive:true}).fetch()||[];
  }
  return result;
}

MlResolver.MlQueryResolver['fetchCommunityDefinitionForSelect'] = (obj, args, context, info) => {
  let result=MlCommunityDefinition.find({isActive:true}).fetch()||[];
  result.push({"name" : "All","code" : "all"});
  return result;
}

MlResolver.MlQueryResolver['fetchCommunityDefinitionAPI'] = (obj, args, context, info) => {
  let result=MlCommunityDefinition.find({isActive:true}).fetch()||[];
  return result;
}

MlResolver.MlQueryResolver['fetchCommunityDefinitionForProcessMapping'] = (obj, args, context, info) => {
  let result=MlCommunityDefinition.find({isActive:true}).fetch()||[];
  result.map(function(data, index){if(data.name === "Browsers") result.splice(index, 1);})
  result.push({"name" : "All","code" : "all"});
  return result;
}
