/**
/**
 * Created by vishwadeep on 10/7/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../../common/commonSchemas";

MlServiceProviderPortfolio = new Mongo.Collection('mlServiceProviderPortfolio');

awardsRecognition = new SimpleSchema({
  awardName:{
    type:String,
    optional:true
  },
  awardId:{
    type:String,
    optional:true
  },
  isAwardPrivate:{
    type:Boolean,
    optional:true
  },
  year:{
    type:String,
    optional:true
  },
  isYearPrivate:{
    type:Boolean,
    optional:true
  },
  awardsDescription:{
    type:String,
    optional:true
  },
  isDescriptionPrivate:{
    type:Boolean,
    optional:true
  },
  'logo': {
    type: Object,
    optional: true
  },
  'logo.fileUrl':{
    type:String,
    optional:true
  },
  'logo.fileName':{
    type:String,
    optional:true
  },
  makePrivate:{
    type:Boolean,
    optional:true
  },
  index:{
    type: Number,
    optional:true
  }
})

serviceProviderMemberships = new SimpleSchema({
  membershipDescription: {
    type: String,
    optional: true
  },
  isMembershipPrivate: {
    type: Boolean,
    optional: true
  }
})

serviceProviderCompliances = new SimpleSchema({
  compliancesDescription: {
    type: String,
    optional: true
  },
  isCompliancesPrivate: {
    type: Boolean,
    optional: true
  }
})

serviceProviderLicenses = new SimpleSchema({
  licensesDescription: {
    type: String,
    optional: true
  },
  isLicensesPrivate: {
    type: Boolean,
    optional: true
  }
})

services = new SimpleSchema({
  servicesDescription: {
    type: String,
    optional: true
  },
  isServicesPrivate: {
    type: Boolean,
    optional: true
  }
})

serviceProviderClients = new SimpleSchema({
  companyName: {
    type: String,
    optional: true
  },
  'isCompanyNamePrivate': {
    type: Boolean,
    optional: true
  },
  'clientDescription': {
    type: String,
    optional: true
  },
  'isClientDescriptionPrivate': {
    type: Boolean,
    optional: true
  },
  'logo': {
    type: Object,
    optional: true
  },
  'logo.fileUrl': {
    type: String,
    optional: false
  },
  'logo.fileName': {
    type: String,
    optional: false
  },
  makePrivate: {
    type: Boolean,
    optional: true
  },
  index: {
    type: Number,
    optional: true
  }
})
serviceProviderAbout = new SimpleSchema({
  aboutTitle:{
    type:String,
    optional:true
  },
  isAboutTitlePrivate:{
    type: Boolean,
    optional: true
  },
  aboutDescription:{
    type:String,
    optional:true
  },
  isDescriptionPrivate:{
    type: Boolean,
    optional: true
  },
  aboutImages: {
    type: Array,
    optional: true
  },
  'aboutImages.$': {
    type: Object,
    optional: true
  },
  'aboutImages.$.fileUrl':{
    type:String,
    optional:true
  },
  'aboutImages.$.fileName':{
    type:String,
    optional:true
  },
})

/**Looking for type*/
serviceProviderLookingFor = new SimpleSchema({
  lookingForName:{
    type:String,
    optional:true
  },
  lookingForId:{
    type:String,
    optional:true
  },
  'lookingDescription':{
    type:String,
    optional:true
  },
  isDescriptionPrivate:{
    type: Boolean,
    optional: true
  },
  'makePrivate':{
    type:Boolean,
    optional:true
  },
  index:{
    type: Number,
    optional:true
  }
})

ServiceProviderPortfolioSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  communityType: {
    type: String,
    optional: true
  },
  portfolioDetailsId: {
    type: String,
    optional: true
  },
  about: {
    type: serviceProviderAbout,
    optional: true
  },
  awardsRecognition: {
    type: Array,
    optional: true
  },
  'awardsRecognition.$': {
    type: awardsRecognition,
    optional: true
  },
  licenses: {
    type: serviceProviderLicenses,
    optional: true
  },
  compliances: {
    type: serviceProviderCompliances,
    optional: true
  },
  memberships: {
    type: serviceProviderMemberships,
    optional: true
  },
  services: {
    type: services,
    optional: true
  },
  clients: {
    type: Array,
    optional: true
  },
  "clients.$": {
    type: serviceProviderClients,
    optional: true
  },
  lookingFor:{
    type:Array,
    optional:true
  },
  'lookingFor.$':{
    type:serviceProviderLookingFor,
    optional:true
  },
})

MlServiceProviderPortfolio.attachSchema(ServiceProviderPortfolioSchema);
MlCollections['MlServiceProviderPortfolio'] = MlServiceProviderPortfolio;
