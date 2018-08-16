/**
 * Created by venkatsrinag on 15/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'


MlUserSchedule = new Mongo.Collection('mlUserSchedule');

MlUserScheduleSchema = new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    profileId: {
        type: String,
        optional: true
    },

    appointmentCount:{
        type:Number,
        optional:true
    },

    timeSlot:{
        type:Number,
        optional:true
    },

    slotDuration:{
        type:Number,
        optional:true
    },

    dayRange:{
        type:Number,
        optional:true
    },

    weekRange:{
        type:Number,
        optional:true
    },

    monthRange:{
        type:Number,
        optional:true
    },

    isRecurring:{
        type:Boolean,
        optional:true
    },

    timeZone:{
        type:Date,
        optional:true
    }
});


MlUserSchedule.attachSchema(MlUserScheduleSchema);
MlCollections['MlUserSchedule'] = MlUserSchedule;
