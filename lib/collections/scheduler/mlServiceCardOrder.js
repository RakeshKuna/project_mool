/**
 * Created by pankaj on 23/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlUserServiceCardOrder = new Mongo.Collection('mlUserServiceCardOrder');
MlUserServiceCardOrderSchema = new SimpleSchema({
  userId:{
    type: String,
    optional:true
  },
  profileId:{
    type: String,
    optional:true
  },
  transactionId:{
    type: String,
    optional:true
  },
  serviceId:{
    type: String,
    optional: true
  },
  serviceName:{
    type: String,
    optional: true
  },
  amount:{
    type: Number,
    optional:true
  },
  tax:{
    type: Number,
    optional:true
  },
  promoCode:{
    type: String,
    optional:true
  },
  discountedAmount:{
    type: Number,
    optional: true
  },
  totalAmount:{
    type: Number,
    optional:true
  },

  isCancelled:{
    type:Boolean,
    optional:true
  },

  isSignOff:{
    type:Boolean,
    optional:true
  },

  isActive:{
    type: Boolean,
    optional:true
  },
  paymentStatus: {
    type: String,
    allowedValues:['unpaid', 'pending','paid'],
    optional: true
  },
  isExpired:{
    type: Boolean,
    optional:true
  },
  createdAt:{
    type: Date,
    optional:true
  },
  updatedAt:{
    type: Date,
    optional:true
  },
  taskDetails:{
    type: Array,
    optional:true
  },
  'taskDetails.$':{
    type: Object,
    optional:true
  },
  'taskDetails.$.taskId':{
    type: String,
    optional:true
  },
  'taskDetails.$.documents':{
    type: Array,
    optional:true
  },
  'taskDetails.$.documents.$':{
    type: Object,
    optional:true
  },
  'taskDetails.$.documents.$.fileName':{
    type: String,
    optional:true
  },
  'taskDetails.$.documents.$.fileUrl':{
    type: String,
    optional:true
  }
  // reconciliation or recancalation and it's data (need srinag comment)
});

MlUserServiceCardOrder.attachSchema(MlUserServiceCardOrderSchema);
MlCollections['MlUserServiceCardOrder'] = MlUserServiceCardOrder;

