/**
 * Created by Mukhil on 1/7/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlLibrary = new Mongo.Collection('mlLibrary');

MlLibrarySchema = new SimpleSchema({

  userId:{
    type:String,
    optional: true
  },
  fileName:{
    type: String,
    optional: true
  },
  fileUrl:{
    type: String,
    optional: true
  },
  fileSize:{
    type: Number,
    optional: true
  },
  fileType:{
    type: String,
    optional: true
  },
  isPrivate:{
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  libraryType: {
    type: String,
    optional: true
  },
  inCentralLibrary: {
    type: Boolean,
    optional: true
  },
  portfolioReference: {
    type: Array,
    optional: true
  },
  'portfolioReference.$': {
    type: Object,
    optional: true
  },
  'portfolioReference.$.portfolioId':{
    type: String,
    optional: true
  },
  'portfolioReference.$.isPrivate':{
    type: Boolean,
    optional: true
  },
  isActive: {
    type: Boolean,
    defaultValue: true,
    optional: true
  }
})

MlLibrary.attachSchema(MlLibrarySchema);
MlCollections['MlLibrary'] = MlLibrary;

