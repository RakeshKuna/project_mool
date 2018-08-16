/**
 * Created by venkatsrinag on 15/6/17.
 */

import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlAppointments = new Mongo.Collection('mlAppointments');
MlAppointmentSchema = new SimpleSchema({

    appointmentId: {
      type:String,
      optional:true
    },

    appointmentType: {
        type:String,
        allowedValues:['SERVICE-TASK','INTERNAL-TASK','SELF-TASK'],
        optional:true
    },

    "startDate":{
      type: Date,
      optional: true
    },

    "endDate":{
      type: Date,
      optional: true
    },

    duration: {
      type: Object,
      optional: true
    },

    "duration.hours": {
      type: Number,
      optional: true
    },

    "duration.minutes": {
      type: Number,
      optional: true
    },

    timeZone: {
      type: String,
      optional: true
    },

    provider:{
        type:Object,
        optional:true
    },

    "provider.userId":{
        type:String,
        optional:true
    },

    "provider.userName":{
      type:String,
      optional:true
    },

    "provider.profileId":{
        type:String,
        optional:true
    },

    client:{
        type:Object,
        optional:true
    },

    "client.userId":{
        type:String,
        optional:true
    },

    "client.userName":{
      type:String,
      optional:true
    },

    "client.profileId":{
        type:String,
        optional:true
    },

    status: {
        type: String,
        optional:true
    },

    appointmentInfo: {
      type: Object,
      optional: true
    },

    "appointmentInfo.resourceType": {
      type: String,
      optional: true
    },

    "appointmentInfo.resourceId": {
      type: String,
      optional: true
    },

    "appointmentInfo.serviceOrderId": {
      type:String,
      optional:true
    },

    "appointmentInfo.serviceCardId": {
      type:String,
      optional:true
    },

    "appointmentInfo.serviceName": {
      type:String,
      optional:true
    },

    "appointmentInfo.taskId": {
      type:String,
      optional:true
    },

    "appointmentInfo.taskName": {
      type:String,
      optional:true
    },

    "appointmentInfo.sessionId": {
      type:String,
      optional:true
    },

    isCancelled:{
      type:Boolean,
      optional:true
    },

    isRescheduled:{
      type:Boolean,
      optional:true
    },

    rescheduleTrail: {
      type: Array,
      optional: true
    },

    "rescheduleTrail.$": {
      type: Object,
      optional: true
    },

    "rescheduleTrail.$.startDate": {
      type: Date,
      optional: true
    },

    "rescheduleTrail.$.endDate": {
      type: Date,
      optional: true
    },

    "rescheduleTrail.$.rescheduleBy": {
      type: String,
      optional: true
    },

    "rescheduleTrail.$.rescheduleAt": {
      type: Date,
      optional: true
    },

    isInternal:{
      type:Boolean,
      optional:true
    },

    isSelf: {
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

    updatedBy: {
      type: String,
      optional: true
    }

});

MlAppointments.attachSchema(MlAppointmentSchema);
MlCollections['MlAppointments'] = MlAppointments;
