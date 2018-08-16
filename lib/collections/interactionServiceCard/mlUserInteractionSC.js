/**
 * Created by venkatsrinag on 19/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlUserInteractionSC = new Mongo.Collection('mlUserInteractionSC');

MlUserInteractionSCSchema = new SimpleSchema({

    userId:{
        type:String,
        optional:true
    },

    profileId:{
        type:String,
        optional:true
    },

    serviceCardDefId:{
        type:String,
        optional:true
    },

    serviceCardCode:{
        type:String,
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

    "actionList.$.actionCode":{
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

    carryForwardExpiryDate:{
        type:Date,
        optional:true
    },

    isReconciled:{
        type:Boolean,
        optional:true
    },

    lastReconcileDate:{
        type:Date,
        optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    },

    isExpired:{
        type:Boolean,
        optional:true
    }


});

MlUserInteractionSC.attachSchema(MlUserInteractionSCSchema);
MlCollections['MlUserInteractionSC'] = MlUserInteractionSC;
