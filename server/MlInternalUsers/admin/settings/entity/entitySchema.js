import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Entity = `        
    type Entity{
      entityName :String
      entityDisplayName :String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
    type Mutation{
        CreateEntity(_id:String,entityName:String,entityDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateEntity(_id:String,entityName:String,entityDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindEntity(_id: String):Entity
      fetchEntities:[Entity]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], Entity]);

let supportedApi = [
  {api:'FindEntity', actionName:'READ', moduleName:"ENTITY"},
  {api:'fetchEntities', actionName:'READ', moduleName:"ENTITY", isWhiteList:true},

  {api:'CreateEntity', actionName:'CREATE', moduleName:"ENTITY"},
  {api:'UpdateEntity', actionName:'UPDATE', moduleName:"ENTITY"}
];
MlResolver.MlModuleResolver.push(supportedApi)
