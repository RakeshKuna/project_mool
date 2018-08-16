import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlQueryResolver['FetchIdentityTypes'] = (obj, args, context, info) => {
  let result=MlIdentityTypes.find({isActive:true}).fetch()||[];
  return result;
}

MlResolver.MlQueryResolver['FetchCommunityBasedIdentity'] = (obj, args, context, info) => {
  let result=MlIdentityTypes.find({"$and": [{communities: args.communityId, isActive: true}]}).fetch()||[];
  return result;
}

MlResolver.MlQueryResolver['FetchCommunityIdentity'] = (obj, args, context, info) => {
  let communities=args.communities
  let identity = [];
  if(communities && communities.length > 0) {
    if(communities.length==1&&communities[0] == "all"){
      let result=MlIdentityTypes.find({isActive: true}).fetch()||[];
      return result;
    }else {
      let identityDetails=[]
      communities.map(function (communityId) {
        let result=MlIdentityTypes.find({"$and": [{communities: communityId, isActive: true}]}).fetch()||[];
        if(result.length>0){
          for(let i=0;i<result.length;i++){
            identityDetails.push(result[i]);
          }
        }
      });
      if(identityDetails.length>0){
        response =_.uniqBy(identityDetails, function (e) {
          return e._id;
        });
        return response
      }

    }
  }

}
