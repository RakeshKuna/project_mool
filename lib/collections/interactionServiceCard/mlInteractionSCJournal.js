/**
 * Created by venkatsrinag on 21/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlInteractionSCJournal = new Mongo.Collection('mlInteractionSCJournal');

MlInteractionSCJournalSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },
    profileId:{
        type:String,
        optional:true
    },

    journalType:{
        type:String,
        optional:true
    },

    journalType:{
        type:String,
        optional:true
    },

    actionCode:{
        type:String,
        optional:true
    },

    createdOn:{
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
    }
});

MlInteractionSCJournal.attachSchema(MlInteractionSCJournalSchema);
MlCollections['MlInteractionSCJournal'] = MlInteractionSCJournal;
