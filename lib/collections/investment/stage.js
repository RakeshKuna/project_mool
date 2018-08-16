/**
 * Created by pankaj on 17/6/17.
 */

import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlStage = new Mongo.Collection('mlStage');
MlStageSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  profileId: {
    type: String,
    optional: true
  },
  resourceId: {
    type: String,
    optional: true
  },
  resourceType: {
    type: String,
    optional: true
  },
  resourceStage: {
    type: String,
    optional: true
  },
  hasInvested: {
    type: Boolean,
    optional: true
  },
  onBoardRequest: {
    type: Boolean,
    optional: true
  },
  onBoardStatus: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  transactionLogStatus: {
    type: Array,
    optional: true
  },
  'transactionLogStatus.$': {
    type: Object,
    optional: true
  },
  'transactionLogStatus.$.transactionId': {
    type: String,
    optional: true
  },
  'transactionLogStatus.$.status': {
    type: String,
    optional: true
  }
});

MlStage.attachSchema(MlStageSchema);
MlCollections['MlStage'] = MlStage;
