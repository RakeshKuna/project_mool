/**
 * Created by venkatsrinag on 5/5/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas';
MlConnections = new Mongo.Collection('mlConnections');

ConnectionSchema = new SimpleSchema({
    users:{
        type:Array,
        optional:true
    },
   'connectionCode':{
     type:String,
     unique:true,
     optional:true
    },
    'users.$':{
        type:Object,
        optional:true
    },

    'users.$.userId':{
        type:String,
        optional:true
    },

    'users.$.userName':{
        type:String,
        optional:true
    },

    'users.$.isFavourite':{
        type:Boolean,
        optional:true
    },

    'users.$.isBlock':{
        type:Boolean,
        optional:true
    },

    requestedFrom:{
        type:String,
        optional:true
    },
    actionUserId:{
      type:String,
      optional:true
    },
    status:{
      type:SimpleSchema.Integer,
      optional:true
    },
    createdBy:{
        type:String,
        optional:true
    },
    createdAt:{
      type:Date,
      optional:true
    },
    updatedAt:{
      type:Date,
      optional:true
    },
    updatedBy:{
        type:String,
        optional:true
    },

    isAccepted:{
        type:Boolean,
        optional:true
    },
    isDenied:{
        type:Boolean,
        optional:true
    },
    isBlocked:{
         type:Boolean,
         optional:true
    },
    resendCount: {
      type: Number,
      optional: true
    }
})

MlConnections.attachSchema(ConnectionSchema);
MlCollections['MlConnections']=MlConnections;
