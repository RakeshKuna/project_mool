/**
 * Created by venkatsrinag on 22/6/17.
 */

import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlOfficeJournal = new Mongo.Collection('mlOfficeJournal');

MlOfficeJournalSchema = new SimpleSchema({
    officeId:{
        type:String,
        optional:true
    },

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

    actionCode:{ // add, remove mem in office
        type:String,
        optional:true
    },

    createdOn:{
        type:Date,
        optional:true
    },

    createdBy:{
        type:String,
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


MlOfficeJournal.attachSchema(MlOfficeJournalSchema);
MlCollections['MlOfficeJournal'] = MlOfficeJournal;
