/**
 * Created by venkatsrinag on 21/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'


let TechnologiesSchema = `
    type Technologies
    {
        _id:String,
        technologyName:String,
        displayName :String,
        about: String,
        icon:String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive:Boolean
    }
    
    input technologyMasterData
    {
        technologyName :String,
        displayName :String,
        about: String,
        icon:String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive:Boolean
    }
    
    type Mutation 
    {
        createTechnology(technologyMasterData:technologyMasterData, moduleName:String, actionName:String):response
        updateSelectedTechnology(technologyId:String, technologyMasterData:technologyMasterData):response
    }
    type Query{
        findTechnology(technologyId:String): Technologies
        fetchTechnologies:[Technologies]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], TechnologiesSchema]);

let supportedApi = [
  {api:'createTechnology', actionName:'CREATE', moduleName:"TECHNOLOGIES"},
  {api:'updateSelectedTechnology', actionName:'UPDATE', moduleName:"TECHNOLOGIES"},

  {api:'findTechnology', actionName:'READ', moduleName:"TECHNOLOGIES"},
  {api:'fetchTechnologies', actionName:'READ', moduleName:"TECHNOLOGIES",isWhiteList:true}
]
MlResolver.MlModuleResolver.push(supportedApi)



