import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let ProfessionSchema = `
    type Profession
    {
      professionName :String
      professionDisplayName :String
      industryId: String
      industryName: String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
   type Mutation 
    {
        CreateProfession(_id:String,professionName:String, professionDisplayName:String, industryId:String,industryName:String,about:String, isActive:Boolean, moduleName:String, actionName:String):response
        UpdateProfession(_id:String,professionName:String, professionDisplayName:String, industryId:String,industryName:String,about:String, isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
        FindProfession(_id:String): Profession
        fetchProfessions:[Profession]
        FetchProfessionIndustry(industry:[String]):[Profession]
        fetchIndustryBasedProfession(industryId:String):[Profession]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],ProfessionSchema]);
let supportedApi = [
  {api:'FindProfession', actionName:'READ', moduleName:"PROFESSION"},
  {api:'fetchProfessions', actionName:'READ', moduleName:"PROFESSION"},
  {api:'FetchProfessionIndustry', actionName:'READ', moduleName:"PROFESSION"},
  {api:'fetchIndustryBasedProfession', actionName:'READ', moduleName:"PROFESSION", isWhiteList:true},
  {api:'CreateProfession', actionName:'CREATE', moduleName:"PROFESSION"},
  {api:'UpdateProfession', actionName:'UPDATE', moduleName:"PROFESSION"}
]
MlResolver.MlModuleResolver.push(supportedApi)
