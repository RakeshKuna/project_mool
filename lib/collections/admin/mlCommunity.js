import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
/**
 * Created by murali on 14/2/17.
 */
MlCommunity = new Mongo.Collection('mlCommunity');


MlCommunitySchema = new SimpleSchema({


  communityName: {
    type: String,
    optional: false
  },
  communityDisplayName: {
    type: String,
    optional: true
  },
  communityDescription: {
    type: String,
    optional: true
  },
  communityDefId: {
    type: String,
    optional: false
  },
  communityDefCode: {
    type: String,
    optional: false
  },
  communityDefName: {
    type: String,
    optional: false
  },
  clusterId: {
    type: String,
    optional: false
  },
  clusterName: {
    type: String,
    optional: true
  },
  chapterId: {
    type: String,
    optional: false
  },
  chapterName: {
    type: String,
    optional: true
  },
  subChapterId: {
    type: String,
    optional: true
  },
  communityCode:{
    type: String,
    optional: true
  },
  communityAccessId:{
    type: String,
    optional: true
  },
  subChapterName: {
    type: String,
    optional: true
  },
  communityImageLink:{
    type:String,
    optional:true
  },
  showOnMap: {
    type: Boolean,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  },
  hierarchyLevel:{
    type:String,
    optional:true
  },
  hierarchyCode:{
    type:String,
    optional:true
  },
  status:{
    type:Object,
    optional:true
  },
  "status.code":{
    type:Number,
    optional:true
  },
  "status.description":{
    type:String,
    optional:true
  },
})


MlCommunity.attachSchema(MlCommunitySchema);
MlSchemas["MlCommunity"] = MlCommunitySchema;
MlCollections['MlCommunity'] = MlCommunity;
