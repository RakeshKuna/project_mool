import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'
/**
 * Created by mohammed.mohasin on 21/3/17.
 */
MlTemplateAssignment = new Mongo.Collection('mlTemplateAssignment');

MlTemplateAssignmentSchema = new SimpleSchema({
  templateprocess:{
    type: String,
    optional: true
  },
  templatesubProcess: {
    type: String,
    optional: true
  },
  templateProcessName : {
    type : String,
    optional : true
  },
  templateSubProcessName : {
    type : String,
    optional : true
  },
  templateGroupName : {
    type : String,
    optional : true
  },
  templateuserType: {
    type: String,
    optional: true
  },
  templateidentity: {
    type: String,
    optional: true
  },
  templateclusterId:{
    type: String,
    optional: true
  },
  templateclusterName:{
    type: String,
    optional: true
  },
  templatechapterId:{
    type: String,
    optional: true
  },
  templatechapterName:{
    type: String,
    optional: true
  },
  templatesubChapterId:{
    type: String,
    optional: true
  },
  templatesubChapterName:{
    type: String,
    optional: true
  },
  templatecommunityCode:{
    type: String,
    optional: true
  },
  templatecommunityName:{
    type: String,
    optional: true
  },
  templatecommunityType:{
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  },
  stepAvailability:{
    type: Array,
    optional: true
  },
  isSystemDefined:{
    type : Boolean,
    optional:true
  },

  /*'stepAvailability.$':{
    type: Object,
    optional: true
  },
  'stepAvailability.$.step':{
    type: String,
    optional: true
  },
  'stepAvailability.$.template':{
    type: String,
    optional: true
  },*/
  assignedTemplates:{
    type: Array,
    optional: true
  },
  'assignedTemplates.$':{
    type: Object,
    optional: true
  },
  'assignedTemplates.$.stepName':{
    type: String,
    optional: true
  },
  'assignedTemplates.$.stepCode':{
    type: String,
    optional: true
  },
  'assignedTemplates.$.templateCode':{
    type: String,
    optional: true
  },
  'assignedTemplates.$.templateName':{
    type: String,
    optional: true
  },
  'assignedTemplates.$.createdDate':{
    type: Date,
    optional: true
  },
  'assignedTemplates.$.isActive':{
    type: Boolean,
    optional: true
  },
  createdBy: {
    type: String,
    optional: true
  },
  createdDate: {
    type: Date,
    optional: true
  },
  modifiedBy: {
    type: String,
    optional: true
  },
  modifiedDate: {
    type: Date,
    optional: true
  }
})

MlTemplateAssignment.attachSchema(MlTemplateAssignmentSchema);
MlCollections['MlTemplateAssignment'] = MlTemplateAssignment;
