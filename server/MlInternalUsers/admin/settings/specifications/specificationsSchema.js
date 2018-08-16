import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Specification = `        
    type Specification{
      specificationName :String
      specificationDisplayName :String
      about: String
      _id:String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive:Boolean
    }
    type Mutation{
        CreateSpecification(_id:String,specificationName:String,specificationDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
        UpdateSpecification(_id:String,specificationName:String,specificationDisplayName:String,about:String,isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
      FindSpecification(_id: String):Specification
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],Specification]);

let supportedApi = [
  {api:'FindSpecification', actionName:'READ', moduleName:"SPECIFICATION"},

  {api:'CreateSpecification', actionName:'CREATE', moduleName:"SPECIFICATION"},
  {api:'UpdateSpecification', actionName:'UPDATE', moduleName:"SPECIFICATION"}
];
MlResolver.MlModuleResolver.push(supportedApi)
