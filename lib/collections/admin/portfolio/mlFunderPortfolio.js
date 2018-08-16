/**
 * Created by venkatsrinag on 24/4/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../../common/commonSchemas'

MlFunderPortfolio = new Mongo.Collection('mlFunderPortfolio');

funderAbout = new SimpleSchema({
    firstName:{
        type:String,
        optional:true
    },
    isFirstNamePrivate:{
        type:Boolean,
        optional:true
    },
    lastName:{
        type:String,
        optional:true
    },
    isLastNamePrivate:{
        type:Boolean,
        optional:true
    },
    gender:{
        type:String,
        optional:true
    },
    isGenderPrivate:{
        type:Boolean,
        optional:true
    },
    category:{
        type:String,
        optional:true
    },
    isCategoryPrivate:{
        type:Boolean,
        optional:true
    },
    qualification:{
        type:String,
        optional:true
    },
    isQualificationPrivate:{
        type:Boolean,
        optional:true
    },
    employmentStatus:{
        type:String,
        optional:true
    },
    isEmploymentStatusPrivate:{
        type:Boolean,
        optional:true
    },
    professionalTag:{
        type:String,
        optional:true
    },
    isProfessionalTagPrivate:{
        type:Boolean,
        optional:true
    },
    yearsOfExperience:{
        type:String,
        optional:true
    },
    isYearsOfExperiencePrivate:{
        type:Boolean,
        optional:true
    },
    industry:{
        type:String,
        optional:true
    },
    isIndustryPrivate:{
        type:Boolean,
        optional:true
    },
    profession:{
        type:String,
        optional:true
    },
    isProfessionPrivate:{
        type:Boolean,
        optional:true
    },
    investmentFrom:{
        type:String,
        optional:true
    },
    investmentCount:{
        type:String,
        optional:true
    },
    isInvestmentCountPrivate:{
        type:Boolean,
        optional:true
    },
    emailId:{
        type:String,
        optional:true
    },
    isEmailIdPrivate:{
        type:Boolean,
        optional:true
    },
    mobileNumber:{
        type:String,
        optional:true
    },
    isMobileNumberPrivate:{
        type:Boolean,
        optional:true
    },
    linkedinUrl:{
        type:String,
        optional:true
    },
    isLinkedinUrlPrivate:{
        type:Boolean,
        optional:true
    },
    facebookUrl:{
        type:String,
        optional:true
    },
    isFacebookUrlPrivate:{
        type:Boolean,
        optional:true
    },

    investmentBudget:{
        type:Object,
        optional:true
    },

    "investmentBudget.from":{
        type:String,
        optional:true
    },

    "investmentBudget.isFromPrivate":{
        type:Boolean,
        optional:true
    },

    "investmentBudget.to":{
        type:String,
        optional:true
    },

    "investmentBudget.isToPrivate":{
        type:Boolean,
        optional:true
    },

    'logo':{
      type: Object,
      optional:true
    },
    'logo.fileUrl':{
      type:String,
      optional:true
    },
    'logo.fileName':{
      type:String,
        optional:true
    },
  profilePic:{
      type:String,
    optional:true
  }
})

investments = new SimpleSchema({
    dateOfInvestment:{
        type:String,
        optional:true
    },
    isDateOfInvestmentPrivate:{
      type:Boolean,
      optional:true
    },
    investmentcompanyName:{
        type:String,
        optional:true
    },
    isCompanyNamePrivate:{
        type:Boolean,
        optional:true
    },
    investmentAmount:{
      type:String,
      optional:true
    },
    isInvestmentAmountPrivate:{
      type:Boolean,
      optional:true
    },
    typeOfFundingId:{
        type:String,
        optional:true
    },
    isTypeOfFundingPrivate:{
        type:Boolean,
        optional:true
    },
    aboutInvestment:{
        type:String,
        optional:true
    },
    isAboutInvestmentPrivate:{
        type:Boolean,
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

principal = new SimpleSchema({
    title:{
        type:String,
        optional:true
    },
    firstName:{
        type:String,
        optional:true
    },
    isFirstNamePrivate:{
        type:Boolean,
        optional:true
    },
    lastName:{
        type:String,
        optional:true
    },
    isLastNamePrivate:{
        type:Boolean,
        optional:true
    },
    designation:{
        type:String,
        optional:true
    },
    isDesignationPrivate:{
        type:Boolean,
        optional:true
    },
    principalcompanyName:{
        type:String,
        optional:true
    },
    duration:{
        type:String,
        optional:true
    },
    isDurationPrivate:{
        type:Boolean,
        optional:true
    },
    yearsOfExperience:{
        type:String,
        optional:true
    },
    isYearsOfExperiencePrivate:{
        type:Boolean,
        optional:true
    },
    qualification:{
        type:String,
        optional:true
    },
    isQualificationPrivate:{
        type:Boolean,
        optional:true
    },
    aboutPrincipal:{
        type:String,
        optional:true
    },
    isAboutPrincipalPrivate:{
        type:Boolean,
        optional:true
    },
    linkedinUrl:{
      type:String,
      optional:true
    },
    isLinkedinUrlPrivate:{
      type:Boolean,
      optional:true
    },
    socialLinks:{
        type:Array,
        optional:true
    },

    'socialLinks.$':{
        type:Object,
        optional:true
    },

    'socialLinks.$.socialLinkType':{
      type:String,
      optional:true
    },

    'socialLinks.$.userId':{
        type:String,
        optional:true
    },

    'socialLinks.$.isUserIdPrivate':{
        type:Boolean,
        optional:true
    },
    makePrivate:{
      type:Boolean,
      optional:true
    },
    index:{
      type: Number,
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
    }
})

team = new SimpleSchema({
    title:{
        type:String,
        optional:true
    },
    firstName:{
        type:String,
        optional:true
    },
    isFirstNamePrivate:{
        type:Boolean,
        optional:true
    },
    lastName:{
        type:String,
        optional:true
    },
    isLastNamePrivate:{
        type:Boolean,
        optional:true
    },
    designation:{
        type:String,
        optional:true
    },
    isDesignationPrivate:{
        type:Boolean,
        optional:true
    },
    teamcompanyName:{
        type:String,
        optional:true
    },
    duration:{
        type:String,
        optional:true
    },
    isDurationPrivate:{
        type:Boolean,
        optional:true
    },
    yearsOfExperience:{
        type:String,
        optional:true
    },
    isYearsOfExperiencePrivate:{
        type:Boolean,
        optional:true
    },
    qualification:{
        type:String,
        optional:true
    },
    isQualificationPrivate:{
        type:Boolean,
        optional:true
    },
    aboutTeam:{
        type:String,
        optional:true
    },
    isAboutTeamPrivate:{
        type:Boolean,
        optional:true
    },
    linkedinUrl:{
      type:String,
      optional:true
    },
    isLinkedinUrlPrivate:{
      type:Boolean,
      optional:true
    },
    socialLinks:{
        type:Array,
        optional:true
    },

    'socialLinks.$.':{
        type:Object,
        optional:true
    },

    'socialLinks.$.socialLinkType':{
        type:String,
        optional:true
    },

    'socialLinks.$.userId':{
        type:String,
        optional:true
    },

    'socialLinks.$.isUserIdPrivate':{
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

areaOfInterest = new SimpleSchema({
    industryTypeId:{
        type:String,
        optional:true
    },
    industryTypeName:{
      type:String,
      optional:true
    },
    subDomainId:{
       type:String,
       optional:true
    },
    subDomainName:{
      type:String,
      optional:true
    },
    isActive:{
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

successStories = new SimpleSchema({
    date:{
        type:String,
        optional:true
    },
    isDatePrivate:{
        type:Boolean,
      optional:true
    },
    storyImage:{
        type:String,
        optional:true
    },
    storyTitle:{
        type:String,
        optional:true
    },
    isStoryTitlePrivate:{
        type:Boolean,
        optional:true
    },
    description:{
        type:String,
        optional:true
    },
    isDescPrivate:{
        type:Boolean,
        optional:true
    },
    isPrivate:{
        type:Boolean,
        optional:true
    },
    isActive:{
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

services = new SimpleSchema({
  dateOfService: {
    type: String,
    optional: true
  },
  isDateOfServicePrivate: {
    type: Boolean,
    optional: true
  },
  industryType: {
    type: Array,
    optional: true
  },
  'industryType.$': {
    type: String,
    optional: true
  },
  conversationType: {
    type: Array,
    optional: true
  },
  'conversationType.$': {
    type: String,
    optional: true
  },
  about: {
    type: String,
    optional: true
  },
  expectedInput: {
    type: String,
    optional: true
  },
  expectedOutput: {
    type: String,
    optional: true
  },
  mode: {
    type: Boolean,
    optional: true
  },
  session: {
    type: String,
    optional: true
  },
  duration: {
    type: Object,
    optional: true
  },
  'duration.hours': {
    type: String,
    optional: true
  },
  'duration.minutes': {
    type: String,
    optional: true
  },
  attachments: {
    type: Array,
    optional: true
  },
  'attachments.$.documentName': {
    type: String,
    optional: true
  },
  'attachments.$.images': {
    type: Array,
    optional: true
  },
  'attachments.$.images.$':{
    type: String,
    optional: true
  },
  isPrivate:{
    type:Boolean,
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

lookingFor = new SimpleSchema({
  lookingForName:{
    type:String,
    optional:true
  },
  lookingForId:{
    type:String,
    optional:true
  },
  lookingDescription:{
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

FunderPortfolioSchema = new SimpleSchema({
    userId:{
      type:String,
      optional:true
    },
    communityType:{
      type:String,
      optional:true
    },
    portfolioDetailsId:{
      type:String,
      optional:true
    },
    funderAbout:{
        type:funderAbout,
        optional: true
    },

    investments:{
        type:Array,
        optional:true
    },

    "investments.$":{
        type:investments,
        optional:true
    },

    principal:{
        type:Array,
        optional:true
    },

    "principal.$":{
        type:principal,
        optional:true
    },

    team:{
        type:Array,
        optional:true
    },

    "team.$":{
        type:team,
        optional:true
    },

    areaOfInterest:{
        type:Array,
        optional:true
    },

    "areaOfInterest.$":{
        type:areaOfInterest,
        optional:true
    },

    successStories:{
        type:Array,
        optional:true
    },

    "successStories.$":{
        type:successStories,
        optional:true
    },
     services: {
      type:services,
      optional: true
    },
    lookingFor:{
      type:Array,
      optional:true
    },
    'lookingFor.$':{
      type:lookingFor,
      optional:true
    }
})

MlFunderPortfolio.attachSchema(FunderPortfolioSchema);
MlCollections['MlFunderPortfolio'] = MlFunderPortfolio;
