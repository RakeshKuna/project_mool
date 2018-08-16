import SimpleSchema from "simpl-schema";

moolyaProfile = new SimpleSchema({

    firstName:{
      type:String,
      optional:false
    },

    middleName:{
      type:String,
      optional:false
    },

    lastName:{
      type:String,
      optional:false
    },

    userType:{
        type:String,
        optional:false
    },

    roleType:{
        type:String,
        optional:false
    },
    assignedDepartment :{
        type:Array,
        optional:true
    },

    'assignedDepartment.$':{
      type:Object,
      optional:true
    },

    'assignedDepartment.$.department':{
      type:String,
      optional:true
    },

    'assignedDepartment.$.subDepartment':{
      type:String,
      optional:true
    },

    displayName:{
      type:String,
      optional:false
    },

    email:{
      type:String,
      optional:false
    },
    socialLinksInfo:{
      type:Array,
      optional:true
    },
    "socialLinksInfo.$":{
      type:socialLinkSchema,
      optional:true
    },
    contact:{
      type:Array,
      optional:false
    },

    'contact.$':{
      type:Object,
      optional:true
    },

    'contact.$.contactNumberType':{
      type:String,
      optional:true
    },

    'contact.$.contactType':{
      type:String,
      optional:true
    },

    'contact.$.countryCode':{
      type:String,
      optional:true
    },

    'contact.$.number':{
      type:String,
      optional:true
    },

    'contact.$.isOTPValidated':{
      type:Boolean,
      optional:true
    },

    globalAssignment:{
      type:Boolean,
      optional:true
    },

    isActive:{
      type:Boolean,
      optional:true
    },

    userProfiles:{
        type:Array,
        optional:true
    },

    'userProfiles.$':{
        type:Object,
        optional:true
    },

    'userProfiles.$.isDefault':{
      type:Boolean,
      optional:true
    },

    'userProfiles.$.clusterId':{
        type:String,
        optional:true
    },

   'userProfiles.$.userRoles':{
      type:Array,
      optional:true
    },

    'userProfiles.$.userRoles.$':{
        type:Object,
        optional:true
    },
  'userProfiles.$.userRoles.$.roleId': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.roleName': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.departmentId': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.departmentName': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.subDepartmentId': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.subDepartmentName': {
    type: String,
    optional: true
  },
  'userProfiles.$.userRoles.$.clusterId':{
    type:String,
    optional:true
  },
    'userProfiles.$.userRoles.$.chapterId':{
        type:String,
        optional:true
    },
    'userProfiles.$.userRoles.$.subChapterId':{
        type:String,
        optional:true
    },
    'userProfiles.$.userRoles.$.communityId':{
        type:String,
        optional:true
    },
    'userProfiles.$.userRoles.$.communityCode':{
      type:String,
      optional:true
    },
    'userProfiles.$.userRoles.$.communityHierarchyLevel':{
      type:SimpleSchema.Integer,
      optional:true
    },
    'userProfiles.$.userRoles.$.isActive':{
        type:Boolean,
        optional:true
    },
    'userProfiles.$.userRoles.$.validFrom':{
        type:String,
        optional:true
    },

    'userProfiles.$.userRoles.$.validTo':{
      type:String,
      optional:true
    },

    'userProfiles.$.userRoles.$.hierarchyLevel':{
        type:SimpleSchema.Integer,
        optional:true
    },

    'userProfiles.$.userRoles.$.hierarchyCode':{
        type:String,
        optional:true
    },
    'userProfiles.$.userRoles.$.isAnchor':{
      type:Boolean,
      optional:true
    }

})

InternalUprofile = new SimpleSchema({
    moolyaprofile:{
        type:moolyaProfile,
        optional:false
    }

})

//fireBase Schema
fireBaseSchema = new SimpleSchema({
  firebaseId : {
    type : String,
    optional : true
  },
  frequency : {
    type : String,
    optional : true
  },
  isAllowedNotifications : {
    type : Boolean,
    optional : true
  }
})


externalUserProfile = new SimpleSchema({

    profileId:{
        type:String,
        optional:true
    },

    registrationId:{
        type:String,
        optional:true
    },

    portfolios:{
        type:Array,
        optional:true
    },

    'portfolios.$':{
        type:Object,
        optional:true
    },

    'portfolios.$.portfolioId':{
        type:String,
        optional:true
    },

    'portfolios.$.isDefault':{
        type:Boolean,
        optional:true
    },

    countryName:{
      type:String,
      optional:true
    },
    countryId:{
        type:String,
        optional:true
    },
    cityName:{
        type:String,
        optional:true
    },
    cityId:{
        type:String,
        optional:true
    },
    mobileNumber:{
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
    communityType:{
        type:String,
        optional:true
    },
    isDefault:{
        type:Boolean,
        optional:true
    },
    isActive:{
        type:Boolean,
        optional:true
    },
    accountType:{
        type:String,
        optional:true
    },

    // "for type office bearer"
    isTypeOfficeBearer:{
        type:Boolean,
        optional:true
    }
})

externalUserAdditionalInfo = new SimpleSchema({
  clusterId:{
    type:String,
    optional:true
  },
  registrationId:{
    type:String,
    optional:true
  },
  profileId:{
    type:String,
    optional:true
  },
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
  "firebaseInfo":{
    type:Array,
    optional:true
  },
  "firebaseInfo.$":{
    type:fireBaseSchema,
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
  }
})

UserProfileSchema = new SimpleSchema({
    isInternaluser:{
        type:Boolean,
        optional:false
    },
    isExternaluser:{
        type:Boolean,
        optional:false
    },
    city:{
        type:String,
        optional:true
    },
    state:{
        type:String,
        optional:true
    },
    country:{
        type:String,
        optional:true
    },
    cluster:{
        type:String,
        optional:true
    },
    chapter:{
        type:String,
        optional:true
    },
    community:{
        type:String,
        optional:true
    },
    hasSwitchedProfile:{
        type:Boolean,
        optional:true
    },
    switchedProfileDefaultId:{
        type:String,
        optional:true
    },
    isShowOnMap: {
      type: Boolean,
      optional: true,
      defaultValue: true
    },
    InternalUprofile:{
        type:InternalUprofile,
        optional:false
    },
    externalUserProfiles:{
      type:Array,
      optional:true
    },
    'externalUserProfiles.$':{
      type:externalUserProfile,
      optional:true
    },
    externalUserAdditionalInfo:{
      type:Array,
      optional:true
    },
    'externalUserAdditionalInfo.$':{
      type:externalUserAdditionalInfo,
      optional:true
    },
    firstName:{
      type:String,
      optional:false
    },
    displayName:{
      type:String,
      optional:true
    },
    isMoolya: {
      type: Boolean,
      optional: true
    },
    lastName:{
      type:String,
      optional:false
    },
    isActive:{
        type:Boolean,
        optional:true
    },
    isSystemDefined : {
      type : Boolean,
      optional : true,
      defaultValue : false
    },
    profileImage:{
      type:String,
      optional:true
    },
    numericalFormat:{
      type: String,
      optional : true
    },
    currencyType:{
      type: String,
      optional : true
    },
    languages:{
    type: String,
    optional : true
    },
    timeZone:{
    type: String,
    optional : true
  },
    genderType:{
        type: String,
      optional: true
    },
    dateOfBirth:{
      type: Date,
      optional: true
    },
    about: {
      type: Date,
      optional: true
    },
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
    "firebaseInfo":{
      type:Array,
      optional:true
    },
    "firebaseInfo.$":{
      type:fireBaseSchema,
      optional:true
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
  },
  index:{
    type : Number,
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
  },
  index:{
    type : Number,
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
  addressCountryId : {
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


//Social Link Schema
socialLinkSchema = new SimpleSchema({
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

//kyc documents
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
  }

})
