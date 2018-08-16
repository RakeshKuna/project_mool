import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let LookingForSchema = `
    type LookingFor
    {
      lookingForName :String
      lookingForDisplayName :String
      communityCode: String
      communityName: String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
   type Mutation 
    {
        CreateLookingFor(_id:String,lookingForName:String, lookingForDisplayName:String, communityCode:String,communityName:String,about:String, isActive:Boolean, moduleName:String, actionName:String):response
        UpdateLookingFor(_id:String,lookingForName:String, lookingForDisplayName:String, communityCode:String,communityName:String,about:String, isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
        FindLookingFor(_id:String): LookingFor
        fetchLookingFor(communityCode:String):[LookingFor]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],LookingForSchema]);

let supportedApi = [
  {api:'FindLookingFor', actionName:'READ', moduleName:"LOOKINGFOR"},
  {api:'fetchLookingFor', actionName:'READ', moduleName:"LOOKINGFOR", isWhiteList:true},

  {api:'CreateLookingFor', actionName:'CREATE', moduleName:"LOOKINGFOR"},
  {api:'UpdateLookingFor', actionName:'UPDATE', moduleName:"LOOKINGFOR"}
];
MlResolver.MlModuleResolver.push(supportedApi)
