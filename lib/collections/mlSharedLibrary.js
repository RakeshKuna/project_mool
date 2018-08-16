/**
 * Created by Mukhil on 11/8/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlSharedLibrary = new Mongo.Collection('mlSharedLibrary');

MlSharedLibrarySchema = new SimpleSchema({

  sharedId: {
    type: String,
    optional: true
  },
  user:{
    type:Object,
    optional: true
  },
  'user.userId':{
    type: String,
    optional: true
  },
  'user.profileId':{
    type: String,
    optional: true
  },
  owner:{
    type:Object,
    optional: true
  },
  'owner.userId':{
    type: String,
    optional: true
  },
  'owner.profileId':{
    type: String,
    optional: true
  },
  'owner.chapterId':{
    type: String,
    optional: true
  },
  'owner.clusterId':{
    type: String,
    optional: true
  },
  'owner.communityId':{
    type: String,
    optional: true
  },
  'owner.communityCode':{
    type: String,
    optional: true
  },
  'owner.subChapterId':{
    type: String,
    optional: true
  },
  file:{
    type: Object,
    optional: true
  },
  'file.url':{
    type: String,
    optional: true
  },
  'file.fileName':{
    type: String,
    optional: true
  },
  'file.fileType':{
    type: String,
    optional: true
  },
  'file.libraryDocumentId':{
    type: String,
    optional: true
  },
  isSignedUrl:{
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  sharedStartDate: {
    type: Date,
    optional: true
  },
  sharedEndDate: {
    type: Date,
    optional: true
  },
  isActive: {
    type: Boolean,
    defaultValue: true,
    optional: true
  },
  isDownloadable:{
    type: Boolean,
    optional: true
  },
  isExpired:{
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  createdBy: {
    type: String,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  updatedBy: {
    type: String,
    optional: true
  }
})

MlSharedLibrary.attachSchema(MlSharedLibrarySchema);
MlCollections['MlSharedLibrary'] = MlSharedLibrary;

