/**
 * Created by pankaj on 14/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../common/commonSchemas";

MlTask = new Mongo.Collection('mlTask');
MlTaskSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  profileId: {
    type: String,
    optional: true
  },
  transactionId: {
    type: String,
    optional: false
  },
  name: {
    type: String,
    optional: true
  },
  displayName: {
    type: String,
    optional: true
  },
  isInternal: {
    type: Boolean,
    optional: true
  },
  isExternal: {
    type: Boolean,
    optional: true
  },
  versions: {
    type: Number,
    optional: false
  },
  note: {
    type: String,
    optional: true
  },
  noOfSession: {
    type: Number,
    optional: true
  },
  sessionFrequency:{
    type: String,
    allowedValues: ['weekly', 'monthly', 'daily'],
    optional: true
  },
  duration:{
    type: Object,
    optional: true
  },
  'duration.hours':{
    type: Number,
    optional: true
  },
  'duration.minutes':{
    type: Number,
    optional: true
  },
  isServiceCardEligible:{
    type: Boolean,
    optional: true
  },
  session:{
    type:Array,
    optional: true
  },
  'session.$':{
    type:Object,
    optional: true
  },
  'session.$.isOffline':{
    type:Boolean,
    optional: true
  },
  'session.$.sessionId':{   //generated Id
    type:String,
    optional: true
  },
  'session.$.duration':{
    type:Object,
    optional: true
  },
  'session.$.duration.hours':{
    type:Number,
    optional: true
  },
  'session.$.duration.minutes':{
    type:Number,
    optional: true
  },
  'session.$.activities':{
    type:Array,
    optional: true
  },
  'session.$.activities.$':{
    type:String,  // Activities ids
    optional: true
  },
  'attachments':{
    type: Array,
    optional:true
  },
  'attachments.$':{
    type: Object,
    optional:true
  },
  'attachments.$.name':{
    type: String,
    optional:true
  },
  'attachments.$.info':{
    type: String,
    optional:true
  },
  'attachments.$.isMandatory':{
    type: Boolean,
    optional:true
  },
  payment: {
    type: Object,
    optional: true
  },
  'payment.activitiesAmount': {
    type: Number,
    optional: true
  },
  'payment.activitiesDiscount': {
    type: Number,
    optional: true
  },
  'payment.currencyType': {
    type: String,
    optional: true
  },
  'payment.activitiesDerived': {
    type: Number,
    optional: true
  },
  'payment.amount': {
    type: Number,
    optional: true
  },
  'payment.isDiscount': {
    type: Boolean,
    optional: true
  },
  'payment.discountType': {
    type: String,
    allowedValues:['percent','amount'],
    optional: true
  },
  'payment.discountValue': {
    type: Number,
    optional: true
  },
  'payment.derivedAmount':{
    type: Number,
    optional: true
  },
  createdAt:{
    type: Date,
    optional: true
  },
  updatedAt:{
    type: Date,
    optional: true
  },
  isActive:{
    type: Boolean,
    optional: true
  },
  isCurrentVersion: {
    type: Boolean,
    optional: false
  }
});

MlTask.attachSchema(MlTaskSchema);
MlCollections['MlTask'] = MlTask;
