/**
 * Created by pankaj on 23/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlCalendarSettings = new Mongo.Collection('mlCalendarSettings');
MlCalendarSettingsSchema = new SimpleSchema({
    userId:{
      type: String,
      optional:true
    },
    profileId:{
      type: String,
      optional:true
    },
    timezone:{
      type: String,
      optional:true
    },
    slotDuration:{
      type:Object,
      optional:true
    },
    'slotDuration.hours':{
      type:Number,
      optional:true
    },
    'slotDuration.minutes':{
      type:Number,
      optional:true
    },
    appointmentCountPerSlots:{
      type: Number,
      optional: true
    },
    slotBreakTime:{
      type:Number, // In minutes
      optional:true
    },
    isOverlappingSchedule:{
      type:Boolean,
      optional:true
    },
    workingDays:{
      type: Array,
      optional:true
    },
    'workingDays.$':{
      type:Object,
      optional:true
    },
    'workingDays.$.isActive':{
      type:Boolean,
      optional:false
    },
    'workingDays.$.dayName':{
      type:Number,
      optional:false
    },
    'workingDays.$.lunch':{
      type:Array,
      optional:true
    },
    'workingDays.$.lunch.$':{
      type:Object,
      optional:true
    },
    'workingDays.$.lunch.$.isActive':{
      type:Boolean,
      optional:true
    },
    'workingDays.$.lunch.$.start':{
      type: String,
      optional:true
    },
    'workingDays.$.lunch.$.end':{
      type: String,
      optional:true
    },
    'workingDays.$.slots':{
      type:Array,
      optional:true
    },
    'workingDays.$.slots.$':{
      type:Object,
      optional:true
    },
    'workingDays.$.slots.$.isActive':{
      type:Boolean,
      optional:true
    },
    'workingDays.$.slots.$.start':{
      type: String,
      optional:true
    },
    'workingDays.$.slots.$.startTimestamp':{
      type: String,
      optional:true
    },
    'workingDays.$.slots.$.end':{
      type: String,
      optional:true
    },
    'workingDays.$.slots.$.endTimestamp':{
      type: String,
      optional:true
    },
    vacations:{
      type:Array,
      optional:true
    },
    'vacations.$':{
      type:Object,
      optional:true
    },
    'vacations.$.vacationId':{
      type: String,
      optional:true
    },
    'vacations.$.isActive':{
      type:Boolean,
      optional:true
    },
    'vacations.$.start':{
      type:Date,
      optional:true
    },
    'vacations.$.end':{
      type:Date,
      optional:true
    },
    'vacations.$.type':{
      type:String,
      allowedValues:['holiday','travel'],
      optional:true
    },
    'vacations.$.note':{
      type:String,
      optional:true
    },
    'vacations.$.isAllowBooking': {
      type: Boolean,
      optional: true
    },
    'vacations.$.isAutoCancelAppointment': {
      type: Boolean,
      optional: true
    },
    createdAt: {
      type: Date,
      optional:true
    },
    updatedAt: {
      type: Date,
      optional:true
    }
});

MlCalendarSettings.attachSchema(MlCalendarSettingsSchema);
MlCollections['MlCalendarSettings'] = MlCalendarSettings;
