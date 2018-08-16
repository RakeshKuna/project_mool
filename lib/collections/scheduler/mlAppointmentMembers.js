/**
 * Created by pankaj on 28/7/17.
 */

import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlAppointmentMembers = new Mongo.Collection('mlAppointmentMembers');
MlAppointmentMembersSchema = new SimpleSchema({

  appointmentId: {
    type: String,
    optional: true
  },

  appointmentUniqueId: {
    type: String,
    optional: true
  },

  userId: {
    type: String,
    optional: true
  },

  profileId: {
    type: String,
    optional: true
  },

  status: {
    type: String,
    optional: true
  },

  isProvider: {
    type: Boolean,
    optional: true
  },

  isClient: {
    type: Boolean,
    optional: true
  },

  isAttendee: {
    type: Boolean,
    optional: true
  },

  createdAt:{
    type: Date,
    optional:true
  },

  createdBy: {
    type: String,
    optional: true
  },

  updatedAt:{
    type: Date,
    optional:true
  },

  isCancelled:{
    type:Boolean,
    optional:true
  },

  updatedBy: {
    type: String,
    optional: true
  }

});

MlAppointmentMembers.attachSchema(MlAppointmentMembersSchema);
MlCollections['MlAppointmentMembers'] = MlAppointmentMembers;
