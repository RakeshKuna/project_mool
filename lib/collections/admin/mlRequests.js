import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlRequests = new Mongo.Collection('mlRequests');

let BySchema = new SimpleSchema({
  type: {
    type: String,
    optional: true
  },
  id: {
    type: String,
    optional: true
  }
});

MlStatusSchema = new SimpleSchema({
  "code": {
    type: String
  },
  "description": {
    type: String
  },
  trail: {
    type: Array,
    optional: true
  },
  'trail.$': {
    type: Object,
    optional: true
  },
  'trail.$.statusCode': {
    type: Number
  },
  'trail.$.statusDescription': {
    type: String
  },
  'trail.$.at': {
    type: Date,
    optional: true
  },
  'trail.$.by': {
    type: BySchema,
    optional: true
  }
});



MlRequestsSchema = new SimpleSchema({

  transactionTypeName:{
    type:String,
    optional:true
  },
  transactionTypeId:{
    type:String,
    optional:true
  },
  requestTypeName:{
    type:String,
    optional:true
  },
  requestDescription:{
    type:String,
    optional:true
  },
  requestId:{
    type:String,
    optional:true
  },
  userId:{
    type:String,
    optional:true
  },
  requestTypeId:{
    type:String,
    optional:true
  },
  requestsStatus:{
    type:MlStatusSchema,
    optional:true
  },
  hierarchy:{
    type:String,
    optional:true
  },
  transactionCreatedDate:{
    type:Date,
    optional:true,
    defaultValue: new Date()
  },
  requestsUpdatedDate:{
    type:Date,
    optional:true
  },
  status:{
    type:String,
    optional:true
  },
  cluster:{
    type:String,
    optional:true
  },
  clusterName:{
    type:String,
    optional:true
  },
  chapter:{
    type:String,
    optional:true
  },
  chapterName:{
    type:String,
    optional:true
  },
  subChapter:{
    type:String,
    optional:true
  },
  subChapterName:{
    type:String,
    optional:true
  },
  communityId:{
    type:String,
    optional:true
  },
  community:{
    type:String,
    optional:true
  },
  communityName:{
    type:String,
    optional:true
  },
  createdBy:{
    type:String,
    optional:true
  },
  emailId:{
    type:String,
    optional:true
  },
  deviceName:{
    type:String,
    optional:true
  },
  deviceId:{
    type:String,
    optional:true
  }
});





MlRequests.attachSchema(MlRequestsSchema);
MlCollections['MlRequests'] = MlRequests;
