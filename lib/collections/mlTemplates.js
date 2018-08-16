import SimpleSchema from 'simpl-schema';
/**
 * Created by mohammed.mohasin on 21/3/17.
 */
MlTemplates = new Mongo.Collection('mlTemplates');

MlTemplatesSchema = new SimpleSchema({

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
    optional: false
  },
  subProcessId: {
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  },
  templates:{
    type:Array,
    optional:true
  },
  "templates.$":{
    type:Object,
    optional:true
  },
  "templates.$.id":{
    type:String,
    optional:true
  },
  "templates.$.templateCode":{
    type:String,
    optional:true
  },
  "templates.$.templateName":{
    type:String,
    optional:true
  },
  "templates.$.templateDescription":{
    type:String,
    optional:true
  },
  "templates.$.isActive":{
    type:Boolean,
    optional:true
  },
  "templates.$.stepName":{
    type:String,
    optional:true
  },
  "templates.$.stepCode":{
    type:String,
    optional:true
  },
  "templates.$.createdDate":{
    type:Date,
    optional:true
  },
  "templates.$.templateImage":{
    type:String,
    optional:true
  },
  createdBy: {
    type: String,
    optional: true
  },
  createdDate: {
    type: Date,
    optional: true
  }

});

MlTemplates.attachSchema(MlTemplatesSchema);
