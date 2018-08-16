import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let BusinessType = `        
    type BusinessType{
      businessTypeName :String
      businessTypeDisplayName :String
      about: String
      _id:String
       createdBy     : String
       createdDate   : Date
       updatedBy     : String
       updatedDate   : Date
      isActive:Boolean
    }
        
    type Mutation{
        CreateBusinessType(_id:String,businessTypeName:String,businessTypeDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateBusinessType(_id:String,businessTypeName:String,businessTypeDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindBusinessType(_id: String):BusinessType
      fetchBusinessTypes:[BusinessType]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], BusinessType]);
let supportedApi = [
  {api:'FindBusinessType', actionName:'READ', moduleName:"BUSINESSTYPE"},
  {api:'fetchBusinessTypes', actionName:'READ', moduleName:"BUSINESSTYPE", isWhiteList:true},

  {api:'CreateBusinessType', actionName:'CREATE', moduleName:"BUSINESSTYPE"},
  {api:'UpdateBusinessType', actionName:'UPDATE', moduleName:"BUSINESSTYPE"}
];
MlResolver.MlModuleResolver.push(supportedApi)

