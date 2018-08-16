/**
 * Created by venkatsrinag on 20/7/17.
 */

import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlServiceCardDefinition = new Mongo.Collection('mlServiceCardDefinition');

MlServiceCardDefinitionSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  profileId: {
    type: String,
    optional: true
  },
  serviceId: {
    type: String,
    optional: true
  },
  cluster: {
    type: Object,
    optional:true
  },
  'cluster.id': {
    type: String,
    optional:true
  },
  'cluster.name': {
    type: String,
    optional:true
  },
  state:{
    type:Array,
    optional:true
  },
  'state.$':{
    type:Object,
    optional:true
  },
  'state.$.id':{
    type:String,
    optional:true
  },
  'state.$.name':{
    type:String,
    optional:true
  },
  city:{
    type:Array,
    optional:true
  },
  'city.$':{
    type:Object,
    optional:true
  },
  'city.$.id':{
    type:String,
    optional:true
  },
  'city.$.name':{
    type:String,
    optional:true
  },
  subChapter:{
    type:Array,
    optional:true
  },
  'subChapter.$':{
    type:Object,
    optional:true
  },
  'subChapter.$.id':{
    type:String,
    optional:true
  },
  'subChapter.$.name':{
    type:String,
    optional:true
  },
  community:{
    type:Array,
    optional:true
  },
  'community.$':{
    type:Object,
    optional:true
  },
  'community.$.id':{
    type:String,
    optional:true
  },
  'community.$.name':{
    type:String,
    optional:true
  },
  'community.$.communityCode':{
    type:String,
    optional:true
  },
  name: {
    type: String,
    optional: true
  },
  displayName: {
    type: String,
    optional: true
  },
  noOfSession: {
    type: Number,
    optional: true
  },
  sessionFrequency:{
    type: String,
    optional: true
  },
  serviceExpiry:{
    type: Number,
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
  validTill:{
    type:Date,
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
  'tasks.$.sessions.$.isOffline':{
    type: Boolean,
    optional: true
  },
  termsAndCondition:{
    type:Object,
    optional:true
  },
  'termsAndCondition.isCancelable':{
    type:Boolean,
    optional:true
  },
  // 'termsAndCondition.isRefundable':{
  //   type:Boolean,
  //   optional:true
  // },
  'termsAndCondition.noOfDaysBeforeCancelation':{
    type:Number,
    optional:true
  },
  'termsAndCondition.isReschedulable':{
    type:Boolean,
    optional:true
  },
  'termsAndCondition.noOfReschedulable':{
    type:Number,
    optional:true
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
  'attachments.$.fileUrl':{
    type: Array,
    optional:true
  },
  'attachments.$.fileUrl.$':{
    type: String,
    optional:true
  },
  payment: {
    type: Object,
    optional: true
  },
  'payment.tasksAmount': {
    type: Number,
    optional: true
  },
  'payment.tasksDiscount': {
    type: Number,
    optional: true
  },
  'payment.tasksDerived': {
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
  'payment.isTaxInclusive': {
    type: Boolean,
    optional: true
  },
  'payment.currencyType': {
    type: String,
    optional: true
  },
  'payment.isPromoCodeApplicable': {
    type: Boolean,
    optional: true
  },
  'payment.isApprovalRequiredFromSeeker': {
    type: Boolean,
    optional: true
  },
  facilitationCharge:{
    type: Object,
    optional: true
  },
  'facilitationCharge.type': {
    type: String,
    allowedValues:['percent','amount'],
    optional: true
  },
  'facilitationCharge.amount':{
    type: Number,
    optional: true
  },
  finalAmount: {
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
  isBeSpoke: {
    type: Boolean,
    defaultValue : false,
    optional: true
  },
  beSpokeCreatorUserId: {
    type: String,
    optional: true
  },
  beSpokeCreatorProfileId: {
    type: String,
    optional: true
  },
  beSpokeCreatorProfileImage: {
    type: String,
    optional: true
  },
  isApproved: {
    type: Boolean,
    defaultValue : false,
    optional: true
  },
  mode: {
    type: String,
    allowedValues:['online','offline'],
    optional: true
  },
  industryId: {
    type: Array,
    optional: true
  },
  'industryId.$': {
    type: String,
    optional: true
  },
  beSpokeAttachments: {
    type: Array,
    optional: true
  },
  'beSpokeAttachments.$': {
    type: Object,
    optional: true
  },
  'beSpokeAttachments.$.fileName': {
    type: String,
    optional: true
  },
  'beSpokeAttachments.$.fileSize': {
    type: Number,
    optional: true
  },
  'beSpokeAttachments.$.fileUrl': {
    type: String,
    optional: true
  },
  conversation:{
    type: Array,
    optional: true
  },
  'conversation.$':{
    type: String,
    optional: true
  },
  expectedInput:{
    type: String,
    optional: true
  },
  expectedOutput:{
    type: String,
    optional: true
  },
  transactionId: {
    type: String,
    optional: false
  },
  isCurrentVersion: {
    type: Boolean,
    optional: false
  },
  versions: {
    type: Number,
    optional: false
  },
  about: {
    type: String,
    optional:true
  },

  isLive:{
    type:Boolean,
    defaultValue : false,
    optional:true
  },

  isReview:{
    type:Boolean,
    defaultValue : false,
    optional:true
  },
  clusterId: {
    type: String,
    optional: false
  },
  clusterName: {
    type: String,
    optional: false
  },
  chapterId: {
    type: String,
    optional: false
  },
  chapterName: {
    type: String,
    optional: false
  },
  subChapterId: {
    type: String,
    optional: false
  },
  subChapterName: {
    type: String,
    optional: false
  },
  communityId: {
    type: String,
    optional: false
  },
  communityName: {
    type: String,
    optional: false
  },
  communityCode: {    //making true wrt 3449 not able to update from communityAdmin	MOOLYA-3632
    type: String,
    optional: true
  },
  status:{
    type: String,
    optional: true
  },
  isActive:{
    type: Boolean,
    optional: true
  },
  deviceDetails:{
    type:Object,
    optional:true
  },
  'deviceDetails.deviceName':{
    type:String,
    optional:true
  },
  'deviceDetails.deviceId':{
    type:String,
    optional:true
  },
  'deviceDetails.ipAddress':{
    type:String,
    optional:true
  },
  'deviceDetails.location':{
    type:String,
    optional:true
  }
});

MlServiceCardDefinition.attachSchema(MlServiceCardDefinitionSchema);
MlCollections['MlServiceCardDefinition'] = MlServiceCardDefinition;

