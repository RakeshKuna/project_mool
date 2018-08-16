import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlDocumentFormats = new Mongo.Collection('mlDocumentFormats');

MlDocumentFormatSchema = new SimpleSchema({
  docFormatName:{
    type:String,
    optional:false
  },
  docFormatDisplayName:{
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
  // createdDateTime:{
  //   type : Date,
  //   optional:true
  // },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlDocumentFormats.attachSchema(MlDocumentFormatSchema);
MlCollections['MlDocumentFormats'] = MlDocumentFormats;

