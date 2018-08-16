import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlTransactionsLog = new Mongo.Collection('mlTransactionsLog');

MlTransactionsLogSchema = new SimpleSchema({

  createdAt:{
    type:Date,
    optional: true
  },
  updatedAt:{
    type:Date,
    optional: true
  },
  transactionTypeName:{
    type:String,
    optional:true
  },
  transactionTypeId:{
    type:String,
    optional:true
  },
  transactionId:{
    type:String,
    optional:true
  },
  emailId:{
    type:String,
    optional:true
  },

  userId:{
    type:String,
    optional:true
  },

  userName:{
    type:String,
    optional:true
  },

  moduleName:{
    type:String,
    optional:true
  },

  docId:{
    type:String,
    optional:true
  },

  activity:{
    type:String,
    optional:true
  },
  activityDocId:{
    type:String,
    optional:true
  },
  'userAgent':{
    type: Object,
    optional:true
  },
  'userAgent.ipAddress':{
    type:String,
    optional:true
  },
  'userAgent.OS':{
    type:String,
    optional:true
  },
  'userAgent.browser':{
    type:String,
    optional:true
  },
  'userAgent.deviceModel':{
    type:String,
    optional:true
  },
  'userAgent.deviceType':{
    type:String,
    optional:true
  },
  'userAgent.deviceVendor':{
    type:String,
    optional:true
  },

  transactionDetails:{
    type:String,
    optional:true
  },

  clusterId : {
    type:String,
    optional:true
  },

  clusterName : {
    type:String,
    optional:true
  },

  chapterId : {
    type:String,
    optional:true
  },

  chapterName : {
    type:String,
    optional:true
  },

  subChapterId : {
    type:String,
    optional:true
  },
  subChapterName : {
    type:String,
    optional:true
  },
  communityId : {
    type: String,
    optional: true
  },
  communityName:{
    type : String,
    optional : true
  },
  communityCode:{
    type : String,
    optional : true
  },
  fromUserId: {
    type : String,
    optional : true
  },
  fromUserName: {
    type : String,
    optional : true
  },
  fromProfileId: {
    type : String,
    optional : true
  },
  fromUserType: {
    type : String,
    allowedValues:['system', 'user'],
    optional : true
  },
  attendeeDetails: {
    type: Array,
    optional: true,
  },
  "attendeeDetails.$": {
    type: Object,
    optional: true,
  },

  "attendeeDetails.$.userId": {
    type: String,
    optional: true,
  },

  "attendeeDetails.$.profileId": {
    type: String,
    optional: true,
  },
});
MlTransactionsLog.attachSchema(MlTransactionsLogSchema);
MlCollections['MlTransactionsLog'] = MlTransactionsLog;
