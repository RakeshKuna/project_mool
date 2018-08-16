/**
 * Created by venkatsrinag on 21/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlInteractionSCLedger = new Mongo.Collection('mlInteractionSCLedger');

MlInteractionSCLedgerSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },
    profileId:{
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
    "actionList.$.actionCode":{
        type:String,
        optional:true
    },
    "actionList.$.limit":{
        type:Number,
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

MlInteractionSCLedger.attachSchema(MlInteractionSCLedgerSchema);
MlCollections['MlInteractionSCLedger'] = MlInteractionSCLedger;
