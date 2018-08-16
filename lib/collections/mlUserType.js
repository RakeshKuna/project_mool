import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'
/**
 * Created by muralidhar on 14/02/17.
 */
MlUserTypes = new Mongo.Collection('mlUserTypes');

MlUserTypesSchema = new SimpleSchema({
  userTypeName: {
    type: String,
    optional: false
  },
  displayName: {
    type: String,
    optional: true
  },
  userTypeDesc: {
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
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
  communityCode:{
    type:String,
    optional:true
  },
  communityName:{
    type:String,
    optional:true
  }
})

MlUserTypes.attachSchema(MlUserTypesSchema);
MlCollections['MlUserTypes'] = MlUserTypes;
