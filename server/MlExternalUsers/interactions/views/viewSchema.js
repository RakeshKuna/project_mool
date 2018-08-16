/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'


let viewSchema = `
    type Mutation{
        createView(resourceId:String!,resourceType:String!):response       
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],viewSchema]);
