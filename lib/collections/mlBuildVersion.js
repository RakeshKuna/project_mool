/**
 * Created by Vishwadeep on 16/11/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlBuildVersion = new Mongo.Collection('mlBuildVersion');

MlBuildVersionSchema = new SimpleSchema({
  majorPatch: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  minorPatch: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  hotPatch: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  imageTag: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  latestRelease: {
    type: String,
    allowedValues: ["MAJOR", "MINOR", "HOT"],
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

MlBuildVersion.attachSchema(MlBuildVersionSchema);
MlCollections['MlBuildVersion'] = MlBuildVersion;

