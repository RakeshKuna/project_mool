import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
/**
 * Created by mohammed.mohasin on 28/02/17.
 */
MlCommunityAccess = new Mongo.Collection('mlCommunityAccess');


MlCommunityAccessSchema = new SimpleSchema({

  platformId: {
    type: String,
    optional: true
  },
  clusterId:{
    type:String,
    optional:true
  },
  chapterId: {
    type: String,
    optional: true
  },
  subChapterId: {
    type: String,
    optional: true
  },
  communityId: {
    type: String,
    optional: true
  },
  communityDefId: {
    type: String,
    optional: true
  },
  communityDefCode:{
    type: String,
    optional: true
  },
  communityDefName:{
    type: String,
    optional: true
  },
  communityImageLink:{
    type: String,
    optional: true
  },
  showOnMap: {
    type: Boolean,
    optional: true
  },
  isRoot: {
    type: Boolean,
    optional: true
  },
  isLeaf: {
    type: Boolean,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  },
  isAvailableByParent: {
    type: Boolean,
    optional: true
  },
  hierarchyLevel:{
    type: SimpleSchema.Integer,
    optional: true
  },
  hierarchyCode:{
    type: String,
    optional: true
  },
  displayName:{
    type:String,
    optional:true
  },
  aboutCommunity:{
    type:String,
    optional:true
  }
});


MlCommunityAccess.attachSchema(MlCommunityAccessSchema);
MlCollections['MlCommunityAccess'] = MlCommunityAccess;
