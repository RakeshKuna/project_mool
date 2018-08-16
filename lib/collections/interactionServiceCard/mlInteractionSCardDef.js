/**
 * Created by venkatsrinag on 19/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlInteractionSCDef = new Mongo.Collection('mlInteractionSCDef');

MlInteractionSCDefSchema = new SimpleSchema({

    code:{
        type:String,
        optional:true
    },
    actionList:{
        type:Array,
        optional:true
    },

    "actionList.$.":{
        type:Object,
        optional:true
    },

    "actionList.$.actionId":{
        type:String,
        optional:true
    },

    "actionList.$.actionName":{
        type:String,
        optional:true
    },

    "actionList.$.limit":{
        type:Number,
        optional:true
    },

    isCarryForward:{
        type:Boolean,
        optional:true
    },

    carryForwardActions:{
        type:Array,
        optional:true
    },

    "carryForwardActions.$.actionId":{
        type:String,
        optional:true
    },

    carryForwardExpirationLimit:{
        type:Number,
        optional:true
    },

    startDate:{
        type:Date,
        optional:true
    },

    expiryDate:{
        type:Date,
        optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    },

    createdBy:{
        type:String,
        optional:true
    },

    createdOn:{
        type:Date,
        optional:true
    },

    updatedOn:{
        type:Date,
        optional:true
    }
});


MlInteractionSCDef.attachSchema(MlInteractionSCDefSchema);
MlCollections['MlInteractionSCDef'] = MlInteractionSCDef;
