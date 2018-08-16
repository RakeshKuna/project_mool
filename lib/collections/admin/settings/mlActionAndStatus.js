/**
 * Created by pankaj on 15/5/17.
 */

import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas';

MlActionAndStatus = new Mongo.Collection('mlActionAndStatus');

const departmentsListSchema = new SimpleSchema({
  'departmentId': {
    type: String,
    optional: false
  },
  'departmentName': {
    type: String,
    optional: false
  },
  'subDepartmentId': {
    type: String,
    optional: false
  },
  'subDepartmentName': {
    type: String,
    optional: false
  },
  'status': {
    type: String,
    optional: true
  },
  'operation':{
    type: Array,
    optional: false
  },
  'operation.$':{
    type:Object,
    optional: false
  },
  'operation.$.roleIds':{
    type: Array,
    optional: false
  },
  'operation.$.roleIds.$':{
    type: String,
    optional: false
  },
  'operation.$.about':{
    type: String,
    optional: false
  },
  'operation.$.actionName':{
    type: String,
    optional: false
  },
  'operation.$.actionDisplayName':{
    type: String,
    optional: false
  },
  'operation.$.statusName':{
    type: String,
    optional: false
  },
  'operation.$.statusDisplayName':{
    type: String,
    optional: false
  },
  'operation.$.status':{
    type: String,
    optional: true
  }
});

const MlActionAndStatusSchema = new SimpleSchema({
  processId:{
    type:String,
    optional:false
  },
  processName:{
    type:String,
    optional:false
  },
  subProcessId:{
    type:String,
    optional:false
  },
  subProcessName:{
    type:String,
    optional:false
  },
  clusterId:{
    type:String,
    optional:false
  },
  isMoolya:{
    type: Boolean,
  },
  clusterName:{
    type:String,
    optional:false
  },
  chapterId:{
    type:String,
    optional:false
  },
  chapterName:{
    type:String,
    optional:false
  },
  subChapterId:{
    type:String,
    optional:false
  },
  subChapterName:{
    type:String,
    optional:false
  },
  departmentInfo:{
    type: departmentsListSchema,
    optional: true
  },
  createdBy: {
    type: String,
    optional: true
  },
  updatedBy: {
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
});

MlActionAndStatus.attachSchema(MlActionAndStatusSchema);
MlCollections['MlActionAndStatus'] = MlActionAndStatus;
