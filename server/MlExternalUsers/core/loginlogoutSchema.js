import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from '../../commons/mlResolverDef'

let loginlogoutSchema = `
    type Mutation{
        # Log the user out.
        logout (token: String!): response
    }
`

MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'], loginlogoutSchema]);
let supportedApi = [
  {api:'logout', actionName:'UPDATE', moduleName:"LOGOUT", isWhiteList:true}
]
// String
MlResolver.MlModuleResolver.push(supportedApi)
