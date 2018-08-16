/**
 * Created by venkatsrinag on 13/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

// Service Card Instance for end user

MlServiceCards = new Mongo.Collection('mlServiceCards');

ServiceCardSchema = new SimpleSchema({
  userId:{
    type:String,
    optional:true
  },
  profileId:{
    type:String,
    optional:true
  },
  transactionId:{
    type: String,
    optional:true
  },
  serviceName:{
    type: String,
    optional: true
  },
  serviceDefId:{
    type:String,
    optional:true
  },
  orderId:{
    type:String,
    optional:true
  },
  isActive:{
    type: Boolean,
    optional:true
  },
  tasks:{
    type: Array,
    optional: true
  },
  'tasks.$':{
    type: Object,
    optional: true
  },
  'tasks.$.id':{
    type: String,
    optional: true
  },
  'tasks.$.sequence':{
    type: String,
    optional: true
  },
  'tasks.$.sessions':{
    type: Array,
    optional: true
  },
  'tasks.$.sessions.$':{
    type: Object,
    optional: true
  },
  'tasks.$.sessions.$.id':{
    type: String,
    optional: true
  },
  'tasks.$.sessions.$.sequence':{
    type: String,
    optional: true
  },
  'tasks.$.sessions.$.isCompleted':{
    type: Boolean,
    optional: true
  },
  isExpired:{
    type:Boolean,
    optional:true
  },

  startDate:{
    type:Date,
    optional:true
  },

  expiryDate:{
    type:Date,
    optional:true
  }
})

MlServiceCards.attachSchema(ServiceCardSchema);
MlCollections['MlServiceCards'] = MlServiceCards;
