import SimpleSchema from "simpl-schema";
import MlSchemas from "../../common/commonSchemas";
import MlCollections from "../../common/commonSchemas";
/**
 * Created by muralidhar on 14/02/17.
 */

MlSubChapters = new Mongo.Collection('mlSubChapters');

contactDetailsSchema = new SimpleSchema({
 
  addressTypeName:{
    type: String,
    optional: true
  },
  name : {
     type: String,
     optional: true
  },
  contactNumber:{
    type:String,
    optional:true
  },
  buildingNumber:{
    type:String,
    optional:true
  },
  street:{
    type:String,
    optional:true
  },
  landmark:{
    type:String,
    optional:true
  },
  area:{
    type:String,
    optional:true
  },
  cityId:{
    type:String,
    optional:true
  },
  stateId:{
    type: String,
    optional:true
  },
  countryId:{
    type: String,
    optional:true
  },
  pincode:{
    type: String,
    optional:true
  },
  latitude:{
    type: String,
    optional:true
  },
  longitude:{
    type: String,
    optional:true
  },
  // emailId:{
  //   type:String,
  //   optional:true
  // },
   // contactPersonRole:{
  //   type:String,
  //   optional:true
  // },
  // addressTypeId:{
  //   type:String,
  //   optional:true
  // },
  // status:{
  //   type:Boolean,
  //   optional:true
  // }
})

MlSubChaptersSchema = new SimpleSchema({
    clusterId:{
        type:String,
        optional:true
    },
    clusterName:{
        type:String,
        optional:true
    },
    stateId:{
        type:String,
        optional:true
    },
    stateName: {
      type: String,
      optional: true
    },
    chapterId:{
        type:String,
        optional:true
    },
    chapterName:{
        type:String,
        optional:false
    },
    subChapterCode:{
        type:String,
        optional:true
    },
    subChapterName:{
        type:String,
        optional:true
    },
    subChapterDisplayName:{
        type:String,
        optional:true
    },
    subChapterUrl:{
      type:String,
      optional:true
    },
    isUrlNotified:{
        type:Boolean,
        optional:true
    },
    isDefaultSubChapter:{
        type:Boolean,
        optional:true
    },
    subChapterEmail:{
      type:String,
      optional:true
    },
    isEmailNotified:{
      type:Boolean,
      optional:true
    },
    aboutSubChapter:{
      type:String,
      optional:true
    },
    subChapterImageLink:{
      type:String,
      optional:true
    },
    showOnMap:{
        type: Boolean,
        optional:true
    },
    userCategoryId: {
      type: String,
      optional: true
    },
    isActive:{
        type: Boolean,
        optional:true
    },
    latitude:{
      type:Number,
      optional:true
    },
    longitude:{
      type:Number,
      optional:true
    },
    isBespokeRegistration:{
      type: Boolean,
      optional:true
    },
    isBespokeWorkFlow:{
      type: Boolean,
      optional:true
    },
    moolyaSubChapterAccess:{
      type:Object,
      optional:true
    },
    'moolyaSubChapterAccess.externalUser':{
      type:Object,
      optional:true
    },
    'moolyaSubChapterAccess.externalUser.canSearch':{
      type:Boolean,
      optional:true
    },
    'moolyaSubChapterAccess.externalUser.canView':{
      type:Boolean,
      optional:true
    },
    'moolyaSubChapterAccess.externalUser.canTransact':{
      type:Boolean,
      optional:true
    },
    objective: {
      type: Array,
      optional: true
    },
    'objective.$': {
      type: Object,
      optional: true
    },
    'objective.$.description': {
      type: String,
      optional: true
    },
    'objective.$.status': {
      type: Boolean,
      optional: true
    },
    contactDetails: {
      type: Array,
      optional: true
    },
    'contactDetails.$': {
      type: contactDetailsSchema,
      optional: true
    },
    status:{
      type:Object,
      optional:true
    },
    "status.code":{
      type:Number,
      optional:true
    },
    "status.description":{
      type:String,
      optional:true
    }
})

MlSubChapters.attachSchema(MlSubChaptersSchema);
MlSchemas["MlSubChapters"] = MlSubChaptersSchema;
MlCollections['MlSubChapters'] = MlSubChapters;

