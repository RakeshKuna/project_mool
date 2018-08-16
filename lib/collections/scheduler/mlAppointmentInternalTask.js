/**
 * Created by pankaj on 5/8/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../common/commonSchemas";

MlAppointmentTask = new Mongo.Collection('mlAppointmentTask');
MlAppointmentTaskSchema = new SimpleSchema({
  userId:{
    type:String,
    optional:true
  },
  profileId: {
    type:String,
    optional:true
  },
  name: {
    type:String,
    optional:true
  },
  mode: {
    type:String,
    optional:true,
    allowedValues:['online','offline']
  },
  about:{
    type:String,
    optional:true
  },
  industries: {
    type: Array,
    optional: true
  },
  'industries.$': {
    type: String,
    optional: true
  },
  conversation:{
    type: Array,
    optional: true
  },
  'conversation.$':{
    type: String,
    optional: true
  },
  duration:{
    type: Object,
    optional: true
  },
  'duration.hours':{
    type: Number,
    optional: true
  },
  'duration.minutes':{
    type: Number,
    optional: true
  },
  frequency:{
    type: String,
    optional: true
  },
  expectedInput: {
    type:String,
    optional:true,
  },
  expectedOutput: {
    type:String,
    optional:true,
  },
  isSelfAssigned: {
    type:Boolean,
    optional:true
  },
  createdAt: {
    type:Date,
    optional:true
  },
  createdBy: {
    type:String,
    optional:true
  }
});

MlAppointmentTask.attachSchema(MlAppointmentTaskSchema);
MlCollections['MlAppointmentTask'] = MlAppointmentTask;
