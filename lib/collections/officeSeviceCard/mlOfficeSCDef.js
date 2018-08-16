/**
 * Created by venkatsrinag on 13/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../common/commonSchemas";

MlOfficeSCDef = new Mongo.Collection('mlOfficeSCDef');

MlOfficeSCDefSchema = new SimpleSchema({

    profileId:{
        type:String,
        optional:true
    },

    totalCount:{
        type:Number,
        optional:true
    },
    principalUserCount:{
        type:Number,
        optional:true
    },
    teamUserCount:{
        type:Number,
        optional:true
    },
    availableCommunities:{
        type:Array,
        optional:true
    },

    'availableCommunities.$':{
        type:Object,
        optional:true
    },

    'availableCommunities.$.communityName':{
        type:String,
        optional:true
    },

    'availableCommunities.$.communityId':{
        type:String,
        optional:true
    },

    'availableCommunities.$.userCount':{
        type:Number,
        optional:true
    },
    code:{
        type:String,
        optional:true
    },

    serviceCardName:{
        type:String,
        optional:true
    },

    totalAmount:{
        type:Number,
        optional:true
    },

    displayName:{
        type:String,
        optional:true
    },

    cardType:{
        type:String,
        optional:true
    },

    frequencyType:{
        type:String,
        optional:true
    },

    about:{
        type:String,
        optional:true
    },

    validFrom:{
        type:Date,
        optional:true
    },

    validTo:{
        type:Date,
        optional:true
    },

    clusters:{
        type:Array,
        optional:true
    },

    "clusters.$":{
        type:Object,
        optional:true
    },

    "clusters.$.clusterId":{
        type:String,
        optional:true
    },

    "clusters.$.clusterName":{
        type:String,
        optional:true
    },

    chapters:{
        type:Array,
        optional:true
    },

    "chapters.$":{
        type:Object,
        optional:true
    },

    "chapters.$.chapterId":{
        type:String,
        optional:true
    },

    "chapters.$.chapterName":{
        type:String,
        optional:true
    },

    subChapters:{
        type:Array,
        optional:true
    },

    "subChapters.$":{
        type:Object,
        optional:true
    },

    "subChapters.$.subChapterId":{
        type:String,
        optional:true
    },

    "subChapters.$.subChapterName":{
        type:String,
        optional:true
    },


    termsConditions:{
        type:String,
        optional:true
    },

    applicableCommunity:{
        type:Array,
        optional:true
    },

    'applicableCommunity.$':{
        type:Object,
        optional:true
    },

    'applicableCommunity.$.communityId':{
        type:String,
        optional:true
    },

    'applicableCommunity.$.communityName':{
        type:String,
        optional:true
    },

    accountType:{
        type:String,
        optional:true
    },

    createdBy:{
        type:String,
        optional:true
    },

    createdOn:{
        type:Date,
        optional:true
    },

    updatedOn:{
        type:Date,
        optional:true
    },

    isMoolya:{
        type:Boolean,
        optional:true
    },

    isOthers:{
        type:Boolean,
        optional:true
    },

    isBSpoke: {
      type: Boolean,
      optional: true,
      defaultValue: false
    },

    isSystemDefined:{   /**not using this key as of now*/
        type:Boolean,
        optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    }
});

MlOfficeSCDef.attachSchema(MlOfficeSCDefSchema);
MlCollections['MlOfficeSCDef'] = MlOfficeSCDef;
