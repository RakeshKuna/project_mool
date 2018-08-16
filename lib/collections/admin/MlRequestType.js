import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlRequestType = new Mongo.Collection('mlRequestType');

MlRequestTypeSchema = new SimpleSchema({
  _id:{
    type:String,
    optional:false
  },

  requestName:{
    type:String,
    optional:false
  },

  displayName:{
    type:String,
    optional:true
  },

  requestDesc:{
    type: String,
    optional:true
  },
  createdBy:{
    type:String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional: true
  },
  updatedDate: {
    type: Date,
    optional: true
  },
  isActive:{
    type:Boolean,
    optional:true
  },
  transactionType:{
    type: String,
    optional:true
  },
  transactionId:{
    type: String,
    optional:true
  }
})


MlRequestType.attachSchema(MlRequestTypeSchema);
MlCollections['MlRequestType'] = MlRequestType;
