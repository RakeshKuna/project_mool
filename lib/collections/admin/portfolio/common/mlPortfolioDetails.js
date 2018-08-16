/**
 * Created by venkatasrinag on 4/4/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../../common/commonSchemas'

MlPortfolioDetails = new Mongo.Collection('mlPortfolioDetails');

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

portfolioDetails = new SimpleSchema({
    portfolioId:{
        type:String,
        optional:true
    },
    transactionType:{
        type:String,
        optional:true
    },
    registrationId:{
       type:String,
       optional:true
    },
    portfolioUserName:{
      type:String,
      optional:true
    },
    userId:{
      type:String,
      optional:true
    },
    contactNumber:{
      type:String,
      optional:true
    },
    userType:{
      type:String,
      optional:true
    },
    investmentFrom:{
      type:String,
      optional:true
    },
    communityType:{
       type:String,
       optional:true
    },
    communityCode:{
        type:String,
        optional:true
    },
    clusterId:{
       type:String,
       optional:true
    },
    chapterId:{
        type:String,
       optional:true
    },
    subChapterId:{
        type:String,
        optional:true
    },
    communityId:{
        type:String,
        optional:true
    },
    clusterName :{
      type:String,
      optional:true
    },
    chapterName:{
      type:String,
      optional:true
    },
    subChapterName:{
      type:String,
      optional:true
    },
    communityName:{
      type:String,
      optional:true
    },
    identityType:{
      type:String,
      optional:true
    },
    industryId:{
      type:String,
      optional:true
    },
    subDomainId:{
      type:Array,
      optional:true
    },
    'subDomainId.$':{
      type:String,
      optional:true
    },
    professionId:{
      type:String,
      optional:true
    },
    businessType:{
      type:String,
      optional:true
    },
    stageOfCompany:{
      type:String,
      optional:true
    },
    accountType:{
        type:String,
        optional:true
    },
    source:{
        type:String,
        optional:true
    },
    createdBy:{
        type:String,
        optional:true
    },
    createdAt:{
        type:Date,
        defaultValue:new Date(),
        optional:true
    },
    status:{
        type:String,
       // allowedValues:['WIP', 'Yet To Start', 'Go Live', 'gone live'],
        optional:true
    },
    statusDesc : {
       type : String,
       optional : true
    },
    assignedTo:{
        type:String,
        optional:true
    },
    progress:{
        type:String,
        optional:true
    },
    isPublic:{
        type:Boolean,
        optional:true
    },
    isGoLive:{
        type:Boolean,
        optional:true
    },
    isActive:{
        type:Boolean,
        optional:true
    },
    transactionId:{
      type:String,
      optional:true
    },
    gender:{
      type:String,
      optional:true
    },
  employmentStatus:{
    type:String,
    optional:true
  },
    transactionCreatedDate:{
      type:Date,
      optional:true
    },
    transactionUpdatedDate:{
      type:Date,
      optional:true
    },
    allocation:{
      type:MlAllocationSchema,
      optional:true
    },

    privateFields:{
        type:Array,
        optional:true
    },

    "privateFields.$":{
        type:Object,
        optional:true
    },

    "privateFields.$.keyName":{
        type:String,
        optional:true
    },

    "privateFields.$.booleanKey":{
      type:String,
      optional:true
    },

    "privateFields.$.index":{
      type:Number,
      optional:true
    },

    "privateFields.$.tabName":{
      type:String,
      optional:true
    },

    "privateFields.$.objectName":{
      type:String,
      optional:true
    },
    /**
     * introducing profileId with new usage in calander
     * */
    profileId:{
      type:String,
      optional:true
    },
    lastLiveDate:{
      type:Date,
      optional:true
    }
})


MlPortfolioDetails.attachSchema(portfolioDetails);
MlCollections['MlPortfolioDetails'] = MlPortfolioDetails;
