/**
 * Created by venkatsrinag on 1/5/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";

let appCommunitySchema = `
    type appCommunities{
        name:String,
        communityName:String,
        displayName:String,
        code:String,
        communityImageLink:String,
        aboutCommunity:String,
        isActive:Boolean
    }
    
    type Query{
        fetchCommunitiesFromDef(isRegisterAs : Boolean):[appCommunities]
    }
`


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], appCommunitySchema]);

let supportedApi = [
  {api: 'fetchCommunitiesFromDef', userAction:"READ", actionName:'READ', resource: "COMMUNITY", isAppWhiteList:true, isWhiteList:true},

]

MlResolver.MlModuleResolver.push(supportedApi)

/**
 * removed dependency
 * */
// fetchAllCommunitiesFromDef: [appCommunities]
// {api: 'fetchAllCommunitiesFromDef', userAction:"READ", actionName:'READ', resource: "COMMUNITY", isAppWhiteList:true},
