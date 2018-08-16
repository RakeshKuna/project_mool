import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlLookingFor = new Mongo.Collection('mlLookingFor');

MlLookingForSchema = new SimpleSchema({
  lookingForName:{
    type:String,
    optional:false
  },
  lookingForDisplayName:{
    type:String,
    optional:true
  },
  communityCode:{
    type:String,
    optional:true
  },
  communityName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
  },
  createdBy:{
    type:String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional: true
  },
  updatedDate:{
    type:Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlLookingFor.attachSchema(MlLookingForSchema);
MlCollections['MlLookingFor'] = MlLookingFor;

