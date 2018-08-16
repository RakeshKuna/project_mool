import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let CommunityDefinition = `        
    type CommunityDefinition{
      name :String
      displayName :String
      code: String
      communityImageLink : String
      showOnMap :Boolean
      aboutCommunity: String
      isActive:Boolean
      _id:String
    }
    type Mutation{

    }
    type Query{
      fetchCommunityDefinition:[CommunityDefinition]
      fetchCommunityDefinitionForRegistration:[CommunityDefinition]
       fetchCommunityDefinitionForSelect:[CommunityDefinition]
       fetchCommunityDefinitionAPI:[CommunityDefinition]
         fetchCommunityDefinitionForProcessMapping:[CommunityDefinition]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],CommunityDefinition]);
let supportedApi = [
    {api:'fetchCommunityDefinition', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunityDefinitionForRegistration', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunityDefinitionForSelect', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunityDefinitionAPI', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
  {api:'fetchCommunityDefinitionForProcessMapping', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)
