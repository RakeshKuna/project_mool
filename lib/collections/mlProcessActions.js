/**
 * Created by venkatsrinag on 7/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlProcessActions = new Mongo.Collection('mlProcessActions');

MlProcessActionsSchema = new SimpleSchema({
    name:{
        type:String,
        optional:false
    },

    displayName:{
        type:String,
        optional:false
    },

    code:{
        type:String,
        optional:false
    },

    isActive:{
        type:Boolean,
        optional:false
    }
})

MlProcessActions.attachSchema(MlProcessActionsSchema);
MlCollections['MlProcessActions'] = MlProcessActions;

