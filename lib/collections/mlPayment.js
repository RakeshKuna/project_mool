/**
 * Created by pankaj on 23/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

const PAYMENT_ACTIVITY = [ 'OFFICE-PURCHASED', 'OFFICE-RENEWAL', 'SERVICE-PURCHASED', 'SERVICE-RENEWAL' ];
const PAYMENT_TYPE = [ 'OFFICE', 'SERVICE', 'User-ServiceCard' ];

MlPayment = new Mongo.Collection('mlPayment');
MlPaymentSchema = new SimpleSchema({
    paymentId:{
      type: String,
      optional: true
    },
    paymentMethod:{
      type: String,
      optional: true
    },
    amount:{
      type: String,
      optional: true
    },
    currencyId:{
      type: String,
      optional: true
    },
    resourceId:{
      type: String,
      optional: true
    },
    resourceType:{
      type: String,
      allowedValues: PAYMENT_TYPE,
      optional: true
    },
    activityId:{
      type: String,
      optional: true
    },
    activityType:{
      type: String,
      allowedValues: PAYMENT_ACTIVITY,
      optional: true
    },
    status: {
      type: String,
      optional: true
    },
    userId:{          //payee user Id
      type: String,
      optional: true
    },
    profileId:{          //payee profile Id
      type: String,
      optional: true
    },
    clusterId: {
      type: String,
      optional: true
    },
    clusterName: {
      type: String,
      optional: true
    },
    chapterId: {
      type: String,
      optional: true
    },
    chapterName: {
      type: String,
      optional: true
    },
    subChapterId: {
      type: String,
      optional: true
    },
    subChapterName: {
      type: String,
      optional: true
    },
    communityId: {
      type: String,
      optional: true
    },
    communityName: {
      type: String,
      optional: true
    },
    createdAt:{
      type: Date,
      optional:true
    },
    updatedAt:{
      type: Date,
      optional: true
    }
});

MlPayment.attachSchema(MlPaymentSchema);
MlCollections['MlPayment'] = MlPayment;
