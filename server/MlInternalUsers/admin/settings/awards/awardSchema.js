import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Award = `        
    type Award{
      awardName :String
      awardDisplayName :String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
    type Mutation{
        CreateAward(_id:String,awardName:String,awardDisplayName:String,about:String,isActive:Boolean,createdBy:String, moduleName:String, actionName:String):response
        UpdateAward(_id:String,awardName:String,awardDisplayName:String,about:String,isActive:Boolean,updatedBy:String,moduleName:String, actionName:String):response        
    }
    type Query{
      FindAward(_id: String):Award
      fetchActiveAwards:[Award]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],Award]);
let supportedApi = [
  {api:'CreateAward', actionName:'CREATE', moduleName:"AWARDS"},
  {api:'UpdateAward', actionName:'UPDATE', moduleName:"AWARDS"},

  {api:'FindAward', actionName:'READ', moduleName:"AWARDS"},
  {api:'fetchActiveAwards', actionName:'READ', moduleName:"AWARDS", isWhiteList:true}
]
MlResolver.MlModuleResolver.push(supportedApi)
