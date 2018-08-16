/**
 * Created by venkatasrinag on 9/2/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
let actions = `
    type Query {
        fetchActions: String
    }    
`

//TODO: Update Role

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], actions]);

