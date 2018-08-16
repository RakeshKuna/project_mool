/**
 * Created by venkatsrinag on 9/3/17.
 */

import SimpleSchema from 'simpl-schema';


MlResourceConfig = new Mongo.Collection('mlResourceConfig');

MlResourceConfigSchema = new SimpleSchema({

  community:{
      type:Object,
      optional:true
  },

  'community.communityName':{
      type:String,
      optional:true
  },

  'community.communityCode':{
      type:String,
      optional:true
  },

  'community.communityDefId':{
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

  resourceCode:{
      type:String,
      optional:true
  },

  isActive:{
      type:Boolean,
      optional:true
  }
})



MlResourceConfig.attachSchema(MlResourceConfigSchema);
