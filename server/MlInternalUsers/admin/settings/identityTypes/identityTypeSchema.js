import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let IdentityTypesSchema = `
    type IdentityTypes
    {
      _id :String
      identityTypeName:String
      identityTypeDisplayName :String
      isActive :Boolean
      communities:[String]
    }
   
    type Query{
        FetchIdentityTypes:[IdentityTypes]
        FetchCommunityBasedIdentity(communityId:String):[IdentityTypes]
        FetchCommunityIdentity(communities:[String]):[IdentityTypes]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],IdentityTypesSchema]);
let supportedApi = [
  {api:'FetchIdentityTypes', actionName:'READ', moduleName:"IDENTITYTYPES", isWhiteList:true},
  {api:'FetchCommunityBasedIdentity', actionName:'READ', moduleName:"IDENTITYTYPES"},
  {api:'FetchCommunityIdentity', actionName:'READ', moduleName:"IDENTITYTYPES"}
]
MlResolver.MlModuleResolver.push(supportedApi)
