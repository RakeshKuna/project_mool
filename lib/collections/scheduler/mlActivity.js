/**
 * Created by pankaj on 14/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlActivity = new Mongo.Collection('mlActivity');
MlActivitySchema = new SimpleSchema({
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
  isCurrentVersion: {
    type: Boolean,
    optional: false
  },
  versions: {
    type: Number,
    optional: false
  },
  isInternal: {
    type: Boolean,
    optional: true
  },
  isExternal: {
    type: Boolean,
    optional: true
  },
  mode: {
    type: String,
    allowedValues:['online','offline'],
    optional: true
  },
  isServiceCardEligible:{
    type: Boolean,
    optional: true
  },
  conversation: {
    type: Array,
    optional: true
  },
  'conversation.$': {
    type: String,
    optional: true
  },
  industryTypes: {
    type: Array,
    optional: true
  },
  'industryTypes.$': {
    type: String,
    optional: true
  },
  note: {
    type: String,
    optional: true
  },
  imageLink: {
    type: String,
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
  deliverable:{
    type:Array,
    optional: true
  },
  'deliverable.$':{
    type:String,
    optional: true
  },
  payment: {
    type: Object,
    optional: true
  },
  'payment.amount': {
    type: Number,
    optional: true
  },
  'payment.currencyType': {
    type: String,
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
  'payment.derivedAmount': {
    type: Number,
    optional: true
  },
  teams:{
    type: Array,
    optional:true
  },
  'teams.$':{
    type: Object,
    optional:true
  },
  'teams.$.resourceType':{
    type: String,
    optional:true
  },
  'teams.$.resourceId':{
    type: String,
    optional:true
  },
  'teams.$.users':{
    type: Array,
    optional:true
  },
  'teams.$.users.$':{
    type: Object,
    optional: true
  },
  'teams.$.users.$.userId':{
    type: String,
    optional: true
  },
  'teams.$.users.$.profileId':{
    type: String,
    optional: true
  },
  'teams.$.users.$.isMandatory':{
    type: Boolean,
    optional: true
  },
  isActive:{
    type:Boolean,
    optional:false
  },
  createdAt:{
    type: Date,
    optional: true
  },
  updatedAt:{
    type: Date,
    optional: true
  }
});

MlActivity.attachSchema(MlActivitySchema);
MlCollections['MlActivity'] = MlActivity;
