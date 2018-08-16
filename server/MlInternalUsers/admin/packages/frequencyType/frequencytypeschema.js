/**
 * Created by venkatsrinag on 28/7/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../../commons/mlSchemaDef";
import MlResolver from "../../../../commons/mlResolverDef";


let servicecardtype = `
  type FrequencyType{
    _id:String,
    name:String,
    displayName:String,
    code:String,
    isActive:Boolean
  }
  
  input frequencyType{
    name:String,
    displayName:String,
    code:String,
    isActive:Boolean
  }
  
  type Query{
      fetchFrequencyTypes:[FrequencyType] 
  }
  
  type Mutation{
      createFrequencyType(frequencyType:frequencyType):response
      updateFrequencyType(frequencyType:frequencyType, frequencyTypeId:String):response
  }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], servicecardtype]);

let supportedApi = [
  {api: 'createFrequencyType', actionName:'CREATE', MODULE: "SERVICECARDTYPE"},
  {api: 'updateFrequencyType', actionName:'UPDATE', MODULE: "SERVICECARDTYPE"},
  {api: 'fetchFrequencyTypes', actionName:'READ', MODULE: "SERVICECARDTYPE", isWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)
