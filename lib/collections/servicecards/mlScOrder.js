/**
 * Created by venkatsrinag on 20/7/17.
 */


import SimpleSchema from "simpl-schema";

MlScOrder = new Mongo.Collection('mlScOrder');

ScOrderSchema = new SimpleSchema({
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
  orderId:{
    type: String,
    optional:true
  },
  // Nothing but serviceDefId
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
  isActive:{
    type: Boolean,
    optional:true
  },
  paymentStatus: {
    type: String,
    allowedValues:['unpaid', 'pending','paid'],
    optional: true
  },
  status: {
    type: String,
    allowedValues:['pending', 'sign off'],
    optional: true
  },
  createdAt:{
    type: Date,
    optional:true
  },
  updatedAt:{
    type: Date,
    optional:true
  }
})

MlScOrder.attachSchema(ScOrderSchema);
MlCollections['MlScOrder'] = MlScOrder;

