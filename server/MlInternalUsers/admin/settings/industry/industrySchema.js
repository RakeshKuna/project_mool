import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Industry = `        
    type Industry{
      industryName :String
      industryDisplayName :String
      about: String
      _id:String
       createdBy     : String
       createdDate   : Date
       updatedBy     : String
       updatedDate   : Date
       isActive      :Boolean
    }
    type Mutation{
        CreateIndustry(_id:String,industryName:String,industryDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateIndustry(_id:String,industryName:String,industryDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response        
    }
    type Query{
      FindIndustry(_id: String):Industry
      fetchIndustries:[Industry]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],Industry]);
let supportedApi = [
  {api:'FindIndustry', actionName:'READ', moduleName:"INDUSTRY"},
  {api:'fetchIndustries', actionName:'READ', moduleName:"INDUSTRY", isWhiteList:true},
  {api:'CreateIndustry', actionName:'CREATE', moduleName:"INDUSTRY"},
  {api:'UpdateIndustry', actionName:'UPDATE', moduleName:"INDUSTRY"}
]
MlResolver.MlModuleResolver.push(supportedApi)
