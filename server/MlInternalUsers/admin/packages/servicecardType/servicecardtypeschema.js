/**
 * Created by venkatsrinag on 28/7/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../../commons/mlSchemaDef";
import MlResolver from "../../../../commons/mlResolverDef";


let servicecardtype = `
  type ServicecardType{
    _id:String,
    name:String,
    displayName:String,
    code:String,
    isActive:Boolean
  }
  
  input servicecardType{
    name:String,
    displayName:String,
    code:String,
    isActive:Boolean
  }
  
  type Query{
      fetchServicecardTypes:[ServicecardType] 
  }
  
  type Mutation{
      createServiceCardType(servicecardType:servicecardType):response
      updateServicecardType(servicecardType:servicecardType, servicecardId:String):response
  }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], servicecardtype]);

let supportedApi = [
  {api: 'createServiceCardType', actionName:'CREATE', MODULE: "SERVICECARDTYPE"},
  {api: 'updateServicecardType', actionName:'UPDATE', MODULE: "SERVICECARDTYPE"},
  {api: 'fetchServicecardTypes', actionName:'READ', MODULE: "SERVICECARDTYPE", isWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)
