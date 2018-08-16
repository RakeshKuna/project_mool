import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let AccountType = `        
    type Account{
      accountName :String
      accountDisplayName :String
      accountDescription: String
      _id:String
      isActive:Boolean
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
    }
    type Mutation{
        CreateAccount(_id:String,accountName:String,accountDisplayName:String,accountDescription:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateAccount(_id:String,accountName:String,accountDisplayName:String,accountDescription:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindAccount(_id: String):Account
      FetchAccount:[Account]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],AccountType]);
let supportedApi = [
    {api:'CreateAccount', actionName:'CREATE', moduleName:"MASTERSETTINGS"},
    {api:'UpdateAccount', actionName:'UPDATE', moduleName:"MASTERSETTINGS"},
    {api:'FindAccount', actionName:'READ', moduleName:"MASTERSETTINGS"},
    {api:'FetchAccount', actionName:'READ', moduleName:"MASTERSETTINGS", isWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)
