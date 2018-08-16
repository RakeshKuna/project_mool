/**
 * Created by venkatasrinag on 9/2/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let modules = `
    type Module{
        _id:String
         name:String,
         displayName:String,
         code:String,
         isActive:Boolean
    }
    type Query {
        fetchModules: [Module]
    }    
`

//TODO: Update Role

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], modules]);
let supportedApi = [
    {api:'fetchModules', actionName:'READ', moduleName:"MODULELIST"}
]
MlResolver.MlModuleResolver.push(supportedApi)
