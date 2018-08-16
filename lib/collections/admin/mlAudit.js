import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlAudit = new Mongo.Collection('mlAudit');

MlMlAuditSchema = new SimpleSchema({
  userId:{
    type:String,
    optional:false
  },
  userName:{
    type:String,
    optional:false
  },
  moduleName:{
    type:String,
    optional:true
  },
  collectionName:{
    type:String,
    optional:false
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
    optional:false
  },
  docId:{
    type:String,
    optional:true
  },
  action:{
    type:String,
    optional:true
  },
  field:{
    type: String,
    optional:true
  },
  fieldName:{
    type: String,
    optional:true
  },
  previousValue:{
    type:String,
    optional:true
  },
  currentValue:{
    type:String,
    optional:true
  },
  errorReason:{
    type:String,
    optional: true
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
  },
})

MlAudit.attachSchema(MlMlAuditSchema);
MlCollections['MlAudit'] = MlAudit;

