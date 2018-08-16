import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let RoleTypesSchema = `
    type RoleTypes
    {
      roleTypeName :String
      roleTypeDisplayName :String
      roleTypeDescription :String
      _id :String
      isActive :Boolean
    }
    
   type Mutation 
    {
        UpdateRoleType(_id:String, roleTypeDisplayName:String, roleTypeDescription:String, isActive:Boolean, moduleName:String, actionName:String):response
    }
    type Query{
        FindRoleType(_id:String): RoleTypes
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],RoleTypesSchema]);

let supportedApi = [
  {api:'FindRoleType', actionName:'READ', moduleName:"ROLETYPE"},

  {api:'UpdateRoleType', actionName:'UPDATE', moduleName:"ROLETYPE"}
];
MlResolver.MlModuleResolver.push(supportedApi)
