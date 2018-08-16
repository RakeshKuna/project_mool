/**
 * Created by venkatsrinag on 1/5/17.
 */
import MlResolver from '../../commons/mlResolverDef'
import {remove} from 'lodash'

MlResolver.MlQueryResolver['fetchCommunitiesFromDef'] = (obj, args, context, info) => {
  var appCommunities = mlDBController.find('MlCommunityDefinition', {isActive: true}, context).fetch();
  if (args && args.isRegisterAs){
    remove(appCommunities, {code: 'OFB'})
    remove(appCommunities, {code: 'BRW'})
  }
  return appCommunities;
}

/**
 * removed this code dependency
 * */
// MlResolver.MlQueryResolver['fetchAllCommunitiesFromDef'] = (obj, args, context, info) =>{
//   let appCommunities = mlDBController.find('MlCommunityDefinition', {}, context).fetch();
//   return appCommunities;
// }
