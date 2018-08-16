/**
 * Created by venkatsrinag on 21/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from "../../../commons/mlResolverDef";

let interactionSCSchema = `
  
    type Actions{
      actionId:String,
      actionName:String,
      limit:Int
    }
    
    type InteractionSCDef{
        _id:String,
        code:String,
        actionList:[Actions],
        isCarryForward:Boolean,
        carryForwardActions:[String],
        carryForwardExpirationLimit:Int,
        startDate:Date,
        expiryDate:Date,
        isActive:Boolean,
        createdBy:Date,
        createdOn:Date,
        updatedOn:Date
    }
    
    input actions{
      actionId:String,
      actionName:String,
      limit:Int
    }
    
    input interactionSCDef{
        code:String,
        actionList:[actions],
        isCarryForward:Boolean,
        carryForwardActions:[String],
        carryForwardExpirationLimit:Int,
        startDate:Date,
        expiryDate:Date,
        isActive:Boolean,
        createdBy:Date,
        createdOn:Date,
        updatedOn:Date
    }
    
    
    type Query {
        fetchInteractionSC:[InteractionSCDef]
        fetchInteractionSCDef(scDefId:String):InteractionSCDef
    }

    type Mutation {
        createInteractionSCDef(scDefObject:interactionSCDef):response
        updateInteractionSCDef(scDefId:String, scDefObject:interactionSCDef):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], interactionSCSchema]);
