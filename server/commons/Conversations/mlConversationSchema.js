/**
 * Created by venkatsrinag on 8/21/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";

let conversationSchema = `
   type Query{
      fetchConversationAuthToken : response
   }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], conversationSchema]);
