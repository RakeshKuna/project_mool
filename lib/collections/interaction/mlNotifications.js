/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlNotifications = new Mongo.Collection('mlNotifications');


MlNotificationUserSchema=new SimpleSchema({
  userId:{
    type:String,
    optional:true
  },
  userName:{
    type:String,
    optional:true
  }
});

MlNotificationSchema = new SimpleSchema({
  notif_type:{
    type:String,
    optional:true
  },
  notif_msg:{
    type:Object,
    optional:true
  },
  'notif_msg.text':{
    type:String,
    optional:true
  },
  url:{
    type:String,
    optional:true
  },
  from:{
    type:MlNotificationUserSchema,
    optional:false
  },
  to:{
    type:MlNotificationUserSchema,
    optional:false
  },
  resource_context:{
    type:Object,
    optional:true
  },
  'resource_context.resourceType':{
    type:String,
    optional:true
  },
  'resource_context.resourceId':{
    type:String,
    optional:true
  },
  isDeleted:{
    type:Boolean,
    optional:true
  },
  isRead:{
    type:Boolean,
    optional:true
  },
  isProfileSpecific:{
    type:Boolean,
    optional:true
  },
  profileId:{
    type:String,
    optional:true
  },
  createdAt:{
    type:Date,
    optional:true
  },
  createdBy:{
    type:String,
    optional:true
  },
  updatedAt:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional:true
  }

});

MlNotifications.attachSchema(MlNotificationSchema);
MlCollections['MlNotifications'] = MlNotifications;
