import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlDateFormats = new Mongo.Collection('mlDateFormats');

MlDateFormatSchema = new SimpleSchema({
  dateFormatName:{
    type:String,
    optional:false
  },
  dateFormatDisplayName:{
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


MlDateFormats.attachSchema(MlDateFormatSchema);
MlCollections['MlTimeFormats'] = MlDateFormats;

