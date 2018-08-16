import SimpleSchema from "simpl-schema";
import MlSchemas from "../../common/commonSchemas";
import MlCollections from "../../common/commonSchemas";
/**
 * Created by vishwadeep on 11/08/17.
 */

MlRelatedSubChapters = new Mongo.Collection('mlRelatedSubChapters');

MlRelatedSubChaptersSchema = new SimpleSchema({
  subChapters: {
    type: Array,
    optional: true
  },
  'subChapters.$': {
    type: Object,
    optional: true
  },
  'subChapters.$.chapterId': {
    type: String,
    optional: true
  },

  'subChapters.$.subChapterId': {
    type: String,
    optional: true
  },
  backendUser: {
    type: Object,
    optional: true
  },
  'backendUser.canSearch': {
    type: Boolean,
    optional: true
  },
  'backendUser.canView': {
    type: Boolean,
    optional: true
  },
  'backendUser.canTransact': {
    type: Boolean,
    optional: true
  },
  externalUser: {
    type: Object,
    optional: true
  },
  'externalUser.canSearch': {
    type: Boolean,
    optional: true
  },
  'externalUser.canView': {
    type: Boolean,
    optional: true
  },
  'externalUser.canTransact': {
    type: Boolean,
    optional: true
  },
  isActive:{
    type: Boolean,
    optional:true
  },
  relatedCode:{
    type: String,
    unique:true,
    optional:true
  },
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date()
  }
})

MlRelatedSubChapters.attachSchema(MlRelatedSubChaptersSchema);
MlSchemas["MlRelatedSubChapters"] = MlRelatedSubChaptersSchema;
MlCollections['MlRelatedSubChapters'] = MlRelatedSubChapters;

