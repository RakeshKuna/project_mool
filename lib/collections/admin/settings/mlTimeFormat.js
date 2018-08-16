import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlTimeFormats = new Mongo.Collection('mlTimeFormats');

MlTimeFormatSchema = new SimpleSchema({
  timeFormatName:{
    type:String,
    optional:false
  },
  timeFormatDisplayName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
  },
  createdDateTime:{
    type : Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlTimeFormats.attachSchema(MlTimeFormatSchema);
MlCollections['MlTimeFormats'] = MlTimeFormats;

