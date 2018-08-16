import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let DocumentFormatsSchema = `
    type DocumentFormats
    {
      docFormatName :String
      docFormatDisplayName :String
      about :String
      _id :String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive      :Boolean
    }
    input documentFormatObject{
        docFormatName :String,
        docFormatDisplayName :String,
        about :String,
        _id :String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive      :Boolean
    }
    
   type Mutation 
    {
        updateDocumentFormat(_id:String, docFormatName:String, docFormatDisplayName:String, about:String, isActive:Boolean , moduleName:String, actionName:String):response
        createDocumentFormat(documentFormat:documentFormatObject, moduleName:String, actionName:String):response
    }
    type Query{
        findDocumentFormat(_id:String): DocumentFormats
        fetchDocumentsFormat:[DocumentFormats]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],DocumentFormatsSchema]);
let supportedApi = [
    {api:'createDocumentFormat', actionName:'CREATE', moduleName:"DOCUMENTFORMAT"},
    {api:'updateDocumentFormat', actionName:'UPDATE', moduleName:"DOCUMENTFORMAT"},
    {api:'findDocumentFormat', actionName:'READ', moduleName:"DOCUMENTFORMAT"},
    {api:'fetchDocumentsFormat', actionName:'READ', moduleName:"DOCUMENTFORMAT"},
]

MlResolver.MlModuleResolver.push(supportedApi)
