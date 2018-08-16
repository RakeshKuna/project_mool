/**
 * Created by venkatsrinag on 6/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../../common/commonSchemas";

MlOfficeTransaction = new Mongo.Collection('mlOfficeTransaction');

OfficeTransaction = new SimpleSchema({
    officeId:{
        type:String,
        optional:true
    },

    userId:{
        type:String,
        optional:true
    },

    userName:{
        type:String,
        optional:true
    },

    clusterId:{
        type:String,
        optional:true
    },

    clusterName:{
      type:String,
      optional:true
    },

    chapterId:{
      type:String,
      optional:true
    },

    chapterName:{
      type:String,
      optional:true
    },

    subChapterId:{
      type:String,
      optional:true
    },

    subChapterName:{
      type:String,
      optional:true
    },

    communityId:{
      type:String,
      optional:true
    },

    communityName:{
      type:String,
      optional:true
    },
    communityCode:{
      type:String,
      optional:true
    },
    dateTime:{
        type:Date,
        optional:true
    },

    transactionId:{
        type:String,
        optional:true
    },

    status:{
        type:String,
        allowedValues:['Pending', 'Acknowledged', 'Assigned', 'Payment Generated', 'Payment Canceled', 'Payment Received',
          'Payment Not Received', 'Returned Payment/ Repay', 'Activate Office', 'Approved', 'Friezed', 'Released', 'De-Activated',
          'Rejected','Sent Notification'],
        optional:true
    },

    action:{
      type:String,
      optional:true
    },

    transactionType:{
        type:String,
        optional:true
    },

    paymentDetails:{
        type:Object,
        optional:true
    },

    "paymentDetails.datetime":{
        type:Date,
        optional:true
    },

    "paymentDetails.validity":{
      type:Date,
      optional:true
    },

    "paymentDetails.transactionId":{
        type:String,
        optional:true
    },

    "paymentDetails.totalAmountPaid":{
        type:Number,
        optional:true
    },

    "paymentDetails.paymentMode":{
        type:String,
        optional:true
    },

    "paymentDetails.promotionCode":{
        type:String,
        optional:true
    },

    "paymentDetails.codeAmount":{
        type:String,
        optional:true
    },

    "paymentDetails.promoCodeStatus":{
        type:String,
        optional:true
    },

    "paymentDetails.voucherCode":{
        type:String,
        optional:true
    },

    "paymentDetails.paymentStatus":{
        type:String,
        optional:true
    },
    "paymentDetails.isPaid": {
      type: Boolean,
      optional: true
    },
    orderSubscriptionDetails:{
        type:Object,
        optional:true
    },

    "orderSubscriptionDetails.orderId":{
        type:String,
        optional:true
    },

    "orderSubscriptionDetails.SubscriptionName":{
        type:String,
        optional:true
    },

    "orderSubscriptionDetails.SubscriptionCode":{
        type:String,
        optional:true
    },

    "orderSubscriptionDetails.cost":{
        type:Number,
        optional:true
    },

    "orderSubscriptionDetails.isTaxInclusive":{
        type:Boolean,
        optional:true
    },

    "orderSubscriptionDetails.about":{
        type:String,
        optional:true
    },

    deviceDetails:{
        type:Object,
        optional:true
    },

    "deviceDetails.deviceName":{
        type:String,
        optional:true
    },

    "deviceDetails.deviceId":{
        type:String,
        optional:true
    },

    "deviceDetails.ipAddress":{
        type:String,
        optional:true
    },

    "deviceDetails.location":{
      optional:true,
      type:String
    },
    'duration':{
      type:Object,
      optional:true
    },
    'duration.years': {
      optional:true,
      type:Number
    },
    'duration.months': {
      optional:true,
      type:Number
    },
    'duration.days': {
      optional:true,
      type:Number
    },
    'duration.hours': {
      optional:true,
      type:Number
    },
    'duration.minutes': {
      optional:true,
      type:Number
    },
    'duration.seconds': {
      optional:true,
      type:Number
    },
})

MlOfficeTransaction.attachSchema(OfficeTransaction);
MlCollections['MlOfficeTransaction'] = MlOfficeTransaction;
