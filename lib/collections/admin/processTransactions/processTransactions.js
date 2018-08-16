/**
 * Created by venkatsrinag on 6/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../../common/commonSchemas";

MlProcessTransactions = new Mongo.Collection('mlProcessTransactions');

ProcessTransactionsSchema = new SimpleSchema({
    portfolioId: {
      type: String,
      optional: true
    },
    userId:{
        type:String,
        optional:true
    },
    profileId:{           /**including profileId in-order to show in the transactions*/
      type:String,
      optional:true
    },
    username:{
      type:String,
      optional:true
    },

    name:{
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

    mobileNumber:{
        type:Number,
        optional:true
    },

    paymentDetails:{
        type:Object,
        optional:true
    },

    "paymentDetails.subscriptionName":{
        type:String,
        optional:true
    },

    "paymentDetails.cost":{
      type:Number,
      optional:true
    },

    "paymentDetails.about":{
      type:String,
      optional:true
    },

    "paymentDetails.isTaxInclusive":{
      type:Boolean,
      optional:true
    },

    "paymentDetails.dateTime":{
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

    "paymentDetails.cardNumber":{
      type:String,
      optional:true
    },

    "paymentDetails.cardHolderName":{
      type:String,
      optional:true
    },

    "paymentDetails.promotionCode":{
      type:String,
      optional:true
    },

    "paymentDetails.codeAmount":{
      type:Number,
      optional:true
    },

    "paymentDetails.promotionStatus":{
      type:String,
      optional:true
    },

    "paymentDetails.voucherCode":{
      type:String,
      optional:true
    },

    "paymentDetails.voucherAmount":{
      type:String,
      optional:true
    },

    "paymentDetails.voucherStatus":{
      type:String,
      optional:true
    },

    "paymentDetails.paymentStatus":{
      type:String,
      optional:true
    },
    "paymentDetails.isPaid":{
      type:Boolean,
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
      type:String,
      optional:true
    },

    progress:{
        type:Number,
        optional:true
    }
})

MlProcessTransactions.attachSchema(ProcessTransactionsSchema);
MlCollections['MlProcessTransactions'] = MlProcessTransactions;
