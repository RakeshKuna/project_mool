import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let KycCategoriesSchema = `
    type KycCategories
    {
      docCategoryName :String
      docCategoryDisplayName :String
      about :String
      _id :String
      createdBy     :  String
      createdDate   :  Date
      updatedBy     :  String
      updatedDate   :  Date
      isActive :Boolean
    }
    input kycCategoryObject{
        docCategoryName :String,
        docCategoryDisplayName :String,
        about :String,
        _id :String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive      : Boolean
    }
    
    type processOutput{
        _id         : String,
        isActive    : Boolean
    }
    
    
   type Mutation 
    {
        updateKycCategory(_id:String, docCategoryName:String, docCategoryDisplayName:String, about:String, isActive:Boolean , moduleName:String, actionName:String):response
        createKycCategory(kycCategory:kycCategoryObject, moduleName:String, actionName:String):response
    }
    type Query{
        findKycCategory(_id:String): KycCategories
        fetchKYCCategories:[KycCategories]
        findCategoryProcessDocuments(_id:String) : [processOutput]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],KycCategoriesSchema]);
let supportedApi = [
  {api:'findKycCategory', actionName:'READ', moduleName:"DOCUMENTS"},
  {api:'fetchKYCCategories', actionName:'READ', moduleName:"DOCUMENTS",isWhiteList: true}, //made whitelist as per srinag word
  {api:'createKycCategory', actionName:'CREATE', moduleName:"DOCUMENTS"},
  {api:'updateKycCategory', actionName:'UPDATE', moduleName:"DOCUMENTS"},
  {api:'findCategoryProcessDocuments', actionName:'READ', moduleName:"DOCUMENTS",isWhiteList: true},
]
MlResolver.MlModuleResolver.push(supportedApi)

