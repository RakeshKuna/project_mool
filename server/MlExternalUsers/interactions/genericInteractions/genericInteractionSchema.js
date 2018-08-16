/**
 * Created by mohammed.mohasin on 19/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'


let viewSchema = `
    type Counter{
      actionName:String,
      count:Int  
    }
    type ActionAttributes{
      actionName:String,
      isDisabled:Boolean,
      isHidden:Boolean
    }
    type Query{
        fetchInteractionsCount(resourceId:String!,resourceType:String!,actionNames:[String]):[Counter]
        fetchInteractionActionAttributes(resourceId:String!,resourceType:String!,actionNames:[String]):[ActionAttributes]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],viewSchema]);
