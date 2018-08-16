import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlSubProcess = new Mongo.Collection('mlSubProcess');
MlSubProcessSchema = new SimpleSchema({
  processName: {
    type: String,
    optional: false
  },
  procesId: {
    type: String,
    optional: true
  },
  subProcessName: {
    type: String,
    optional: true
  },
  subProcessDescription:{
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  },
  steps:{
    type:Array,
    optional:true
  },
  "steps.$":{
    type:Object,
    optional:true
  },
  "steps.$.isActive":{
    type:Boolean,
    optional:true
  },
  "steps.$.stepName":{
    type:String,
    optional:true
  },
  "steps.$.stepCode":{
    type:String,
    optional:true
  },
  "steps.$.stepId":{
    type:String,
    optional:true
  },
  createdBy:{
    type: String,
    optional: true
  },
  createdDate:{
    type: Date,
    optional: true
  },
  modifiedBy:{
    type: String,
    optional: true
  },
  modifiedDate:{
    type: Date,
    optional: true
  },
});

MlSubProcess.attachSchema(MlSubProcessSchema);
MlCollections['MlSubProcess'] = MlSubProcess;
