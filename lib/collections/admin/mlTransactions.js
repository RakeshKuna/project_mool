import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlTransactions = new Mongo.Collection('mlTransactions');
MlAllocationSchema= new SimpleSchema({
  assignee:{
    type:String,
    optional:true
  },
  assigneeId:{
    type:String,
    optional:true
  },
  assignedDate:{
    type:Date,
    optional:true
  },
  department:{
    type:String,
    optional:true
  },
  departmentId:{
    type:String,
    optional:true
  },
  subDepartment:{
    type:String,
    optional:true
  },
  subDepartmentId:{
    type:String,
    optional:true
  },
  allocationStatus:{
    type:String,
    optional:true
  },
  allocationDescription:{
    type:String,
    optional:true
  }
})
MlTransactionsSchema = new SimpleSchema({

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
  transactionStatus:{
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
  },
  transactionUpdatedDate:{
    type:Date,
    optional:true
  },
  allocation:{
    type:MlAllocationSchema,
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
  chapter:{
    type:String,
    optional:true
  },
  subChapter:{
    type:String,
    optional:true
  },
  community:{
    type:String,
    optional:true
  }
});

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
    type: Number
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



MlTransactions.attachSchema(MlTransactionsSchema);

//MlSchemas["MlTransactions"] = MlTransactionsSchema;
MlCollections['MlTransactions'] = MlTransactions;
