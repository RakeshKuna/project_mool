/**
 * Created by Pankaj on 28/10/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'


MlProgress = new Mongo.Collection('mlProgress');

MlProgressSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },

  profileId: {
    type: String,
    optional: true
  },

  resourceType: {
    type: String,
    optional: true
  },

  resourceId: {
    type: String,
    optional: true
  },

  progressTemplateLiterals: {
    type: String,
    optional: true
  },

  docs : {
    type: Array,
    optional: true
  },

  "docs.$" : {
    type: Object,
    optional: true
  },

  "docs.$.name" : {
    type: String,
    optional: true
  },

  "docs.$.url" : {
    type: String,
    optional: true
  },

  variables : {
    type: Array,
    optional: true
  },

  "variables.$" : {
    type: Object,
    optional: true
  },

  "variables.$.name" : {
    type: String,
    optional: true
  },

  "variables.$.value" : {
    type: String,
    optional: true
  },

  references : {
    type: Array,
    optional: true
  },

  "references.$" : {
    type: Object,
    optional: true
  },

  "references.$.name" : {
    type: String,
    optional: true
  },

  "references.$.value" : {
    type: String,
    optional: true
  },

  "references.$.collection" : {
    type: String,
    optional: true
  },

  isActive: {
    type: Boolean,
    optional: true
  },

  createdAt: {
    type: Date,
    optional: true
  },

  updatedAt: {
    type: Date,
    optional: true
  }

});

MlProgress.attachSchema(MlProgressSchema);
MlCollections['MlProgress'] = MlProgress;
