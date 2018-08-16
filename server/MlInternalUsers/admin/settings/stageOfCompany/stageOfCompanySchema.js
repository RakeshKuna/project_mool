import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let StageOfCompany = `        
    type StageOfCompany{
      stageOfCompanyName :String
      stageOfCompanyDisplayName :String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
    type Mutation{
        CreateStageOfCompany(_id:String,stageOfCompanyName:String,stageOfCompanyDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateStageOfCompany(_id:String,stageOfCompanyName:String,stageOfCompanyDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindStageOfCompany(_id: String):StageOfCompany
      fetchStageOfCompany:[StageOfCompany]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], StageOfCompany]);

let supportedApi = [
  {api:'FindStageOfCompany', actionName:'READ', moduleName:"STAGEOFCOMPANY"},
  {api:'fetchStageOfCompany', actionName:'READ', moduleName:"STAGEOFCOMPANY", isWhiteList:true},

  {api:'CreateStageOfCompany', actionName:'CREATE', moduleName:"STAGEOFCOMPANY"},
  {api:'UpdateStageOfCompany', actionName:'UPDATE', moduleName:"STAGEOFCOMPANY"}
];
MlResolver.MlModuleResolver.push(supportedApi)
