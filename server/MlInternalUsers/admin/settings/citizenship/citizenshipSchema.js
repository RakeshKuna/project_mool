import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Citizenship = `        
    type Citizenship{
      citizenshipTypeName :String
      citizenshipTypeDisplayName :String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
    type Mutation{
        CreateCitizenship(_id:String,citizenshipTypeName:String,citizenshipTypeDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateCitizenship(_id:String,citizenshipTypeName:String,citizenshipTypeDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindCitizenship(_id: String):Citizenship
      FetchCitizenship:[Citizenship]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], Citizenship]);

let supportedApi = [
  {api:'CreateCitizenship', actionName:'CREATE', moduleName:"GLOBALSETTINGS"},
  {api:'UpdateCitizenship', actionName:'CREATE', moduleName:"GLOBALSETTINGS"},
  {api:'FindCitizenship', actionName:'READ', moduleName:"GLOBALSETTINGS", isWhiteList:true},
  {api:'FetchCitizenship', actionName:'READ', moduleName:"GLOBALSETTINGS", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)
