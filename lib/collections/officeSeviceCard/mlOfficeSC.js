/**
 * Created by venkatsrinag on 22/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlOfficeSC = new Mongo.Collection('mlOfficeSC');

MlOfficeSCSchema = new SimpleSchema({
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

    scDefId:{
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

    isReconciled:{
        type:Boolean,
        optional:true
    },

    lastReconcileDate:{
        type:Date,
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

    isActivated:{
        type:Boolean,
        optional:true
    },

    isExpired:{
        type:Boolean,
        optional:true
    }
});

MlOfficeSC.attachSchema(MlOfficeSCSchema);
MlCollections['MlOfficeSC'] = MlOfficeSC;
