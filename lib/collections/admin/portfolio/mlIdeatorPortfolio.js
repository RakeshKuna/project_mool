/**
 * Created by venkatasrinag on 3/4/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../../common/commonSchemas'

MlIdeatorPortfolio = new Mongo.Collection('mlIdeatorPortfolio');

ideatorAbout = new SimpleSchema({
    title:{
        type:String,
        optional:true
    },
    description:{
        type:String,
        optional:true
    },
    isTitlePrivate:{
        type:Boolean,
        optional:true
    },
    isDescriptionPrivate:{
        type:Boolean,
        optional:true
    }
})

portfolioIdeatorDetails = new SimpleSchema({
    firstName:{
        type:String,
        optional:true
    },
    isfirstNamePrivate:{
        type:Boolean,
        optional:true
    },
    lastName:{
        type:String,
        optional:true
    },
    islastNamePrivate:{
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
    dateOfBirth:{
      type:String,
      optional:true
    },
    isDateOfBirthPrivate:{
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
    yearsofExperience:{
        type:String,
        optional:true
    },
    isYoePrivate:{
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
    employerName:{
        type:String,
        optional:true
    },
    isEmployerNamePrivate:{
        type:Boolean,
        optional:true
    },
    profilePic:{
        type:String,
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
    emailId:{
        type:String,
        optional:true
    },
    isEmailIdPrivate:{
        type:Boolean,
        optional:true
    },
    facebookId:{
        type:String,
        optional:true
    },
    isfacebookIdPrivate:{
        type:Boolean,
        optional:true
    },
    linkedInId:{
        type:String,
        optional:true
    },
    islinkedInIdPrivate:{
        type:Boolean,
        optional:true
    },
    twitterId:{
        type:String,
        optional:true
    },
    isTwitterIdPrivate:{
        type:Boolean,
        optional:true
    },
    gplusId:{
        type:String,
        optional:true
    },
    isGplusIdPrivate:{
        type:Boolean,
        optional:true
    }
})

problemSolution = new SimpleSchema({
  problemStatement: {
    type: String,
    optional: true
  },
  isProblemPrivate: {
    type: Boolean,
    optional: true
  },
  problemImage: {
    type: Array,
    optional: true
  },
  'problemImage.$': {
    type: Object,
    optional: true
  },
  'problemImage.$.fileUrl':{
    type:String,
    optional:true
  },
  'problemImage.$.fileName':{
    type:String,
    optional:true
  },
  solutionStatement: {
    type: String,
    optional: true
  },
  isSolutionPrivate: {
    type: Boolean,
    optional: true
  },
  solutionImage: {
    type: Array,
    optional: true
  },
  'solutionImage.$': {
    type: Object,
    optional: true
  },
  'solutionImage.$.fileUrl':{
    type:String,
    optional:true
  },
  'solutionImage.$.fileName':{
    type:String,
    optional:true
  }
})

audience = new SimpleSchema({
    audienceDescription:{
        type:String,
        optional:true
    },
    isAudiencePrivate:{
      type: Boolean,
      optional: true
    },
    audienceImages: {
      type: Array,
      optional: true
    },
    'audienceImages.$': {
      type: Object,
      optional: true
    },
    'audienceImages.$.fileUrl':{
      type:String,
      optional:true
    },
    'audienceImages.$.fileName':{
      type:String,
      optional:true
    },
})

strategyAndPlanning = new SimpleSchema({
    spDescription:{
        type:String,
        optional:true
    },
    isStrategyPlansPrivate: {
      type: Boolean,
      optional: true
    }
})

intellectualPlanning = new SimpleSchema({
    IPdescription:{
        type:String,
        optional:true
    },
    isIntellectualPrivate: {
      type: Boolean,
      optional: true
    }
})

lookingFor = new SimpleSchema({
    // lookingForDescription:{
    //     type:String,
    //     optional:true
    // },
    // isLookingForPrivate: {
    //   type: Boolean,
    //   optional: true
    // }
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
  isDescriptionPrivate:{
    type: Boolean,
    optional: true
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

IdeatorPortfolioSchema = new SimpleSchema({
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
    ideatorabout:{
        type:ideatorAbout,
        optional:true
    },

    portfolioIdeatorDetails:{
        type:portfolioIdeatorDetails,
        optional:true
    },

    problemSolution:{
        type:problemSolution,
        optional:true
    },

    audience:{
        type:audience,
        optional:true
    },

    strategyAndPlanning:{
          type:strategyAndPlanning,
          optional:true
      },

    intellectualPlanning:{
        type:intellectualPlanning,
        optional:true
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

MlIdeatorPortfolio.attachSchema(IdeatorPortfolioSchema);
MlCollections['MlIdeatorPortfolio'] = MlIdeatorPortfolio;
