import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlWeekDays = new Mongo.Collection('mlWeekDays');

MlWeekDaySchema = new SimpleSchema({
  dayName:{
    type:String,
    optional:false
  },
  displayName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
  },
  createdDateTime:{
    type : Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlWeekDays.attachSchema(MlWeekDaySchema);
MlCollections['MlWeekDays'] = MlWeekDays;

