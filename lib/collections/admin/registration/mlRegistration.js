import SimpleSchema from 'simpl-schema';

/**
 * Created by Sireesha on 16/3/17.
 */
import MlCollections from '../../../common/commonSchemas'

MlRegistration = new Mongo.Collection('mlRegistration');


RegistrationSchema = new SimpleSchema({
  registrationId:{
    type:String,
    optional:true
  },
  transactionId:{
    type:String,
    optional:true
  },
  transactionType:{
    type:String,
    optional:true
  },
  industry : {
    type : String,
    optional : true
  },
  profession : {
    type : String,
    optional : true
  },
  userType : {
    type : String,
    optional : true
  },
  identityType:{
    type:String,
    optional:true
  },
  firstName : {
    type : String,
    optional : true
  },
  lastName : {
    type : String,
    optional : true
  },
  countryId : {
    type :String,
    optional : true
  },
  countryName : {
    type :String,
    optional : true
  },
  contactNumber : {
    type : String,
    optional : true
  },
  email : {
    type : String,
    optional : true
  },
  cityId : {
    type : String,
    optional : true
  },
  cityName : {
    type : String,
      optional : true
  },
  registrationType:{
    type : String,
    optional : true
  },
  userName:{
    type : String,
    optional : true
  },
  userId:{
    type : String,
    optional : true
  },
  password:{
    type : String,
    optional : true
  },
  accountType:{
    type : String,
    optional : true
  },
  institutionAssociation:{
    type : String,
    optional : true
  },
  companyname:{
    type : String,
    optional : true
  },
  companyUrl:{
    type : String,
    optional : true
  },
  remarks:{
    type : String,
    optional : true
  },
  referralType:{
    type : String,
    optional : true
  },
  clusterId:{
    type : String,
    optional : true
  },
  clusterName:{
    type : String,
      optional : true
  },
  chapterId:{
    type : String,
      optional : true
  },
  chapterName:{
    type : String,
    optional : true
  },
  subChapterId:{
    type : String,
    optional : true
  },
  subChapterName:{
    type : String,
    optional : true
  },
  communityId:{
    type : String,
    optional : true
  },
  communityName:{
    type : String,
    optional : true
  },
  communityDefCode:{
    type : String,
    optional : true
  },
  communityDefName:{
    type : String,
    optional : true
  },
  source:{
    type : String,
    optional : true
  },
  deviceName:{
    type : String,
    optional : true
  },
  deviceNumber:{
    type : String,
    optional : true
  },
  ipAddress:{
    type : String,
    optional : true
  },
  ipLocation:{
    type : String,
    optional : true
  },
  processStatus:{
    type : Object,
    optional :true
  },
  'processStatus.$':{
    type : Object,
    optional :true
  },
  'processStatus.$.isOTPSent':{
    type : Boolean,
    optional :true
  },
  'processStatus.$.isEmailSent':{
    type : Boolean,
    optional :true
  },
  'processStatus.$.isAcknowledgementSent':{
    type : Boolean,
    optional :true
  },
  registrationDate:{
    type : Date,
    optional :true
  },
  userId : {
    type : String,
    optional : true
  },
  registrationStatus:{
    type : String,
    optional : true
  },
  assignedUser:{
    type : String,
    optional : true
  },
  profileImage:{
    type : String,
    optional : true
  },
  promoCode:{
    type: String,
    optional:true
  },
  campaignCode:{
    type: String,
    optional:true
  },
  isPromoAvailed:{
    type: Boolean,
    optional:true
  },
  createdBy:{
    type: String,
    optional:true
  },
  transactionUpdatedDate:{
    type:Date,
    optional:true
  },

})


registrationDetailsSchema = new SimpleSchema({

  //IndividualSchema
  identityType:{
    type:String,
    optional:true
  },
  firstName:{
    type:String,
    optional:true
  },
  middleName:{
    type:String,
    optional:true
  },
  lastName:{
    type:String,
    optional:true
  },
  displayName:{
    type:String,
    optional:true
  },
  userType:{
    type:String,
    optional:true
  },
  titleId:{
    type:String,
    optional:true
  },
  titleName:{
    type:String,
    optional:true
  },
  dateOfBirth:{
    type:String,
    optional:true
  },
  citizenships : {
    type : String,
    optional : true
  },
  /*'citizenship.$' : {
    type : Object,
    optional : true
  },
  'citizenship.$.id' : {
    type : String,
    optional : true
  },
  'citizenship.$.name' : {
    type : String,
    optional : true
  },*/
  qualification : {
    type : String,
    optional : true
  },
  employmentStatus : {
    type : String,
    optional : true
  },
  professionalTag : {
    type : String,
    optional : true
  },
  industryId : {
    type : String,
    optional : true
  },
  industryName : {
    type : String,
    optional : true
  },
  professionId : {
    type : String,
    optional : true
  },
  professionName : {
    type : String,
    optional : true
  },
  employerName : {
    type : String,
    optional : true
  },
  employerWebsite : {
    type : String,
    optional : true
  },
  employmentDate : {
    type : String,
    optional : true
  },
  experience : {
    type : String,
    optional : true
  },

  //CompanySchema

  userType: {
    type: String,
    optional: true
  },
  companyName: {
    type: String,
    optional: true
  },
  groupName: {
    type: String,
    optional: true
  },
  companyWebsite: {
    type: String,
    optional: true
  },
  companyEmail: {
    type: String,
    optional: true
  },
  foundationDate: {
    type: String,
    optional: true
  },
  headQuarterLocation: {
    type: String,
    optional: true
  },
  branchLocations: {
    type: Array,
    optional: true
  },

  'branchLocations.$': {
    type: String,
    optional: true
  },
  companytyp: {
    type: String,
    optional: true
  },
  entityType: {
    type: String,
    optional: true
  },
  businessType: {
    type: String,
    optional: true
  },
  industry: {
    type: String,
    optional: true
  },
  subDomain: {
    type: Array,
    optional: true
  },
  'subDomain.$': {
    type: String,
    optional: true
  },
  stageOfCompany: {
    type: String,
    optional: true
  },
  subsidaryCompany: {
    type: String,
    optional: true
  },
  parentCompany: {
    type: String,
    optional: true
  },
  // registrationNumber: {
  //   type: String,
  //   optional: true
  // },
  // isoAccrediationNumber: {
  //   type: String,
  //   optional: true
  // },
  companyTurnOver: {
    type: String,
    optional: true
  },
  partnerCompanies: {
    type: String,
    optional: true
  },
  investors: {
    type: String,
    optional: true
  },
  lookingFor: {
    type: String,
    optional: true
  },
  companyCEOName: {
    type: String,
    optional: true
  },
  companyManagement: {
    type: String,
    optional: true
  },
  toatalEmployeeCount: {
    type: String,
    optional: true
  },
  associatedCompanies: {
    type: String,
    optional: true
  },
   investingFrom: {
    type: String,
    optional: true
  },
   currency: {
    type: String,
    optional: true
  },
   investmentAmount: {
    type: String,
    optional: true
  },

  //InstitutionSchema

  userCategory: {
    type: String,
    optional: true
  },
  institutionType: {
    type: String,
    optional: true
  },
  instituteName: {
    type: String,
    optional: true
  },
  instituteGroupName: {
    type: String,
    optional: true
  },
  foundationYear: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  registrationNumber: {
    type: String,
    optional: true
  },
  isoAccrediationNumber: {
    type: String,
    optional: true
  },
  curriculamProvider: {
    type: String,
    optional: true
  },
  associatedUniversity: {
    type: String,
    optional: true
  },
  studentCount: {
    type: String,
    optional: true
  },
  staffCount: {
    type: String,
    optional: true
  },
  chairman: {
    type: String,
    optional: true
  },
  dean: {
    type: String,
    optional: true
  },
  headQuarterLocation: {
    type: String,
    optional: true
  },
  branchLocations: {
    type: Array,
    optional: true
  },

  'branchLocations.$': {
    type: String,
    optional: true
  },
 /* 'branchLocation.$': {
    type: Object,
    optional: true
  },
  'branchLocation.$.id': {
    type: String,
    optional: true
  },
  'branchLocation.$.name': {
    type: String,
    optional: true
  },*/

  //ServiceProviderSchema

  identityType : {
    type : String,
    optional : true
  },
  userType : {
    type : String,
    optional : true
  },
  title : {
    type : String,
    optional : true
  },
  firstName : {
    type : String,
    optional : true
  },
  middleName : {
    type : String,
    optional : true
  },
  lastName : {
    type : String,
    optional : true
  },
  displayName : {
    type : String,
    optional : true
  },
  dateOfBirth : {
    type : String,
    optional : true
  },
  gender : {
    type : String,
    optional : true
  },
  citizenships : {
    type : String,
    optional : true
  },
  /*'citizenship.$' : {
    type : Object,
    optional : true
  },
  'citizenship.$.id' : {
    type : String,
    optional : true
  },
  'citizenship.$.name' : {
    type : String,
    optional : true
  },*/
  qualification : {
    type : String,
    optional : true
  },
  employmentStatus : {
    type : String,
    optional : true
  },
  professionalTag : {
    type : String,
    optional : true
  },
  industry : {
    type : String,
    optional : true
  },
  profession : {
    type : String,
    optional : true
  },
  employerName : {
    type : String,
    optional : true
  },
  employerWebsite : {
    type : String,
    optional : true
  },
  employmentDate : {
    type : String,
    optional : true
  }

})

//Address Schema
addressSchema = new SimpleSchema({
  addressType : {
    type : String,
    optional : true
  },
  addressTypeName : {
    type : String,
    optional : true
  },
  name : {
    type : String,
    optional : true
  },
  phoneNumber : {
    type : String,
    optional : true
  },
  addressFlat : {
    type : String,
    optional : true
  },
  addressLocality : {
    type : String,
    optional : true
  },
  addressLandmark : {
    type : String,
    optional : true
  },
  addressArea : {
    type : String,
    optional : true
  },
  addressCity : {
    type : String,
    optional : true
  },
  addressCityId : {
    type : String,
    optional : true
  },
  addressState : {
    type: String,
    optional: true
  },
  addressStateId : {
    type: String,
    optional: true
  },
  addressCountry : {
    type: String,
    optional: true
  },
  addressCountryId:{
    type: String,
    optional: true
  },
  addressPinCode : {
    type: String,
    optional: true
  },
  latitude:{
    type : Number,
    optional : true
  },
  longitude:{
    type : Number,
    optional : true
  },
  isDefaultAddress:{
    type : Boolean,
    optional : true
  }

})

//Contact Schema
contactSchema = new SimpleSchema({
  numberType : {
    type : String,
    optional : true
  },
  numberTypeName : {
    type : String,
    optional : true
  },
  countryCode : {
    type :String,
    optional : true
  },
  contactNumber : {
    type : String,
    optional : true
  }
})

//Email Schema
emailSchema = new SimpleSchema({
  emailIdType : {
    type : String,
    optional : true
  },
  emailIdTypeName : {
    type : String,
    optional : true
  },
  emailId : {
    type : String,
    optional : true
  }
})

//Social Link Schema
socialLinkSchema = new SimpleSchema({
/*  linkedin : {
    type : String,
    optional : true
  },
  facebook : {
    type : String,
    optional : true
  },
  twitter : {
    type : String,
    optional : true
  },
  youtube : {
    type : String,
    optional : true
  },
  googlePlus : {
    type : String,
    optional : true
  },
  printInfo : {
    type : String,
    optional : true
  }*/
  socialLinkTypeName : {
    type : String,
    optional : true
  },
  socialLinkType : {
    type : String,
    optional : true
  },
  socialLinkUrl : {
    type : String,
    optional : true
  }

})
kycDocumentSchema=new SimpleSchema({
  docTypeName : {
    type : String,
    optional : true
  },
  docTypeId : {
    type : String,
    optional : true
  },
  kycCategoryId : {
    type : String,
    optional : true
  },
  kycCategoryName : {
    type : String,
    optional : true
  },
  documentId : {
    type : String,
    optional : true
  },
  documentDisplayName : {
    type : String,
    optional : true
  },
  documentName : {
    type : String,
    optional : true
  },
  isMandatory : {
    type : Boolean,
    optional : true
  },
  isActive : {
    type : Boolean,
    optional : true
  },
  allowableFormat:{
    type : Array,
    optional : true
  },
  'allowableFormat.$':{
    type:String,
    optional:true
  },
  allowableMaxSize:{
    type:String,
    optional:true
  },
  docFiles:{
    type:Array,
    optional:true
  },
  'docFiles.$':{
    type:Object,
    optional:true
  },
  'docFiles.$.fileId':{
    type:String,
    optional:true
  },
  'docFiles.$.fileUrl':{
    type:String,
    optional:true
  },
  'docFiles.$.fileName':{
    type:String,
    optional:true
  },
  'docFiles.$.fileSize':{
    type:String,
    optional:true
  },
  status : {
    type : String,
    optional : true
  },
  statusDesc : {
    type : String,
    optional : true
  }




})

MlAllocationSchema= new SimpleSchema({
  assignee:{
    type:String,
    optional:true
  },
  assigneeId:{
    type:String,
    optional:true
  },
  assignedDate:{
    type:Date,
    optional:true
  },
  department:{
    type:String,
    optional:true
  },
  departmentId:{
    type:String,
    optional:true
  },
  subDepartment:{
    type:String,
    optional:true
  },
  subDepartmentId:{
    type:String,
    optional:true
  },
  allocationStatus:{
    type:String,
    optional:true
  },
  allocationDescription:{
    type:String,
    optional:true
  }
})

MlRegistrationSchema=new SimpleSchema({
  status:{
    type : String,
    optional : true
  },
  statusDesc : {
    type : String,
    optional : true
  },
  transactionId:{
    type : String,
    optional : true
  },
  transactionCreatedDate:{
    type:String,
    optional:true
  },
  allocation:{
    type:MlAllocationSchema,
    optional:true
  },
  hierarchy:{
    type:String,
    optional:true
  },
  transactionType:{
    type:String,
    optional:true
  },
  registrationInfo:{
    type:RegistrationSchema,
    optional:true
  },
  registrationDetails:{
    type:registrationDetailsSchema,
    optional:true
  },
 /* services:{  //address,verified
    type:Array,
    blackbox:true,
    optional:true
  },*/
  'services':{
    type:Object,
    optional:true,
    blackbox:true
  },
  emails:{  //address,verified
    type:Array,
    blackbox:true,
    optional:true
  },
  'emails.$':{
    type:Object,
    optional:true,
    blackbox:true
  },
  otps:{
    type:Array,
    optional:true,
    blackbox:true
  },
  'otps.$':{//num,verified,time
    type:Object,
    optional:true,
    blackbox:true
  },

 /* 'registrationDetails.individualInfo':{
    type:IndividualSchema,
    optional:true
  },
  'registrationDetails.companyInfo':{
    type:companySchema,
    optional:true
  },
  'registrationDetails.institutionInfo':{
    type:institutionSchema,
    optional:true
  },
  'registrationDetails.serviceProviderInfo':{
    type:serviceProviderSchema,
    optional:true
  },*/
  "contactInfo":{
    type:Array,
    optional:true
  },
  "contactInfo.$":{
    type:contactSchema,
    optional:true
  },
  "emailInfo":{
    type:Array,
    optional:true
  },
  "emailInfo.$":{
    type:emailSchema,
    optional:true
  },
  "addressInfo":{
    type:Array,
    optional:true
  },
  "addressInfo.$":{
    type:addressSchema,
    optional:true
  },
  "socialLinksInfo":{
    type:Array,
    optional:true
  },
  "socialLinksInfo.$":{
    type:socialLinkSchema,
    optional:true
  },
  "kycDocuments":{
    type:Array,
    optional:true
  },
  'kycDocuments.$':{
    type:Object,
    optional:true
  },
  "kycDocuments.$":{
    type:kycDocumentSchema,
    optional:true
  },
  promoCode:{
    type: String,
    optional:true
  },
  campaignCode:{
    type: String,
    optional:true
  }
});

MlRegistration.attachSchema(MlRegistrationSchema);
MlCollections['MlRegistration'] = MlRegistration;
