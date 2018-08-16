/**
 * Created by venkatsrinag on 9/1/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlOfficeType = new Mongo.Collection('mlOfficeType');

MlOfficeTypeSchema = new SimpleSchema({

  name:{
      type:String,
      optional:true
  },

  displayName:{
      type:String,
      optional:true
  },

  code:{
      type:String,
      optional:true
  },

  isActive:{
      type:Boolean,
      optional:true
  }
})

MlOfficeType.attachSchema(MlOfficeTypeSchema);
MlCollections['MlOfficeType'] = MlOfficeType;
