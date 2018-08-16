/**
 * Created by venkatsrinag on 22/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlOfficeLedger = new Mongo.Collection('mlOfficeLedger');

MlOfficeLedgerSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },
    profileId:{
        type:String,
        optional:true
    },
    officeId:{
        type:String,
        optional:true
    },
    totalusercount:{
        type:Number,
        optional:true
    },
    principalcount:{
        type:Number,
        optional:true
    },
    teamMembercount:{
        type:Number,
        optional:true
    },
    availableCommunities:{
      type:Array,
      optional:true
    },
    'availableCommunities.$':{
        type:Object,
        optional:true
    },
    'availableCommunities.$.communityName':{
        type:String,
        optional:true
    },
    'availableCommunities.$.communityId':{
        type:String,
        optional:true
    },
    'availableCommunities.$.userCount':{
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

MlOfficeLedger.attachSchema(MlOfficeLedgerSchema);
MlCollections['MlOfficeLedger'] = MlOfficeLedger;
