import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let RequestTypeSchema = `
    type Requests
    {
      requestName     : String
      displayName     : String
      requestDesc     : String
      _id             : String
      createdBy       : String
      createdDate     : Date
      updatedBy       : String
      updatedDate     : Date
      isActive        : Boolean
      transactionType : String
      transactionId   : String
    }
   type Mutation 
    {
        CreateRequestType(_id:String,requestName:String, displayName:String, requestDesc:String, isActive:Boolean,transactionType:String,transactionId:String, moduleName:String, actionName:String):response
        UpdateRequestType(_id:String,requestName:String, displayName:String, requestDesc:String, isActive:Boolean,transactionType:String,transactionId:String, moduleName:String, actionName:String):response
    }
    type Query{
        FindRequestType(_id:String): Requests
        FetchRequestType:[Requests]
    }
`;

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],RequestTypeSchema]);
let supportedApi = [
  {api:'CreateRequestType', actionName:'CREATE', moduleName:"REQUESTTYPE"},
  {api:'UpdateRequestType', actionName:'UPDATE', moduleName:"REQUESTTYPE"},
  {api:'FindRequestType', actionName:'READ', moduleName:"REQUESTTYPE", isWhiteList:true},
  {api:'FetchRequestType', actionName:'READ', moduleName:"REQUESTTYPE", isWhiteList:true}
]
MlResolver.MlModuleResolver.push(supportedApi)
