import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlBugReport = new Mongo.Collection('mlBugReport');

MlBugReportSchema = new SimpleSchema({
  details:{
    type:String,
    optional:false
  },
  reportedUrl:{
    type:String,
    optional:true
  },
  userId:{
    type:String,
    optional:false
  },
  profileId:{
    type:String,
    optional:true
  },
  emailId:{
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
  clusterId:{
    type:String,
    optional:true
  },
  chapterId:{
    type:String,
    optional:true
  },
  subChapterId:{
    type:String,
    optional:true
  },
  communityId:{
    type:String,
    optional:true
  },
  clusterName:{
    type:String,
    optional:true
  },
  chapterName:{
    type:String,
    optional:true
  },
  subChapterName:{
    type:String,
    optional:true
  },
  communityCode:{
    type:String,
    optional:true
  },
  url:{
    type:String,
    optional:true
  },
  'userAgent':{
    type: Object,
    optional:true
  },
  'userAgent.ipAddress':{
    type:String,
    optional:false
  },
  'userAgent.OS':{
    type:String,
    optional:false
  },
  'userAgent.browser':{
    type:String,
    optional:false
  },
  'userAgent.deviceModel':{
    type:String,
    optional:false
  },
  'userAgent.deviceType':{
    type:String,
    optional:false
  },
  'userAgent.deviceVendor':{
    type:String,
    optional:false
  },
  timeStamp:{
    type:Date,
    optional:false
  }
})

MlBugReport.attachSchema(MlBugReportSchema);
MlCollections['MlBugReport'] = MlBugReport;

