/**
 * Created by venkatsrinag on 11/5/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlOffice = new Mongo.Collection('mlOffice');

MlOfficeSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },

    profileId:{
      type:String,
      optional:true
    },

    userName:{
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

    barerCount:{
        type:Number,
        optional:true
    },

    description:{
        type:String,
        optional:true
    },

    officeName:{
      type:String,
      optional:true
    },

    branchType:{
        type:String,
        optional:true
    },

    officeLocation:{
        type:String,
        optional:true
    },

    streetLocality:{
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

    zipCode:{
        type:Number,
        optional:true
    },

    paymentLink:{
      type:String,
      optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    },

    location:{
        type:Array,
        optional:true
    },

    "location.$.":{
        type:Object,
        optional:true
    },

    "location.$.lat":{
        type:Number,
        optional:true
    },

    "location.$.lang":{
      type:Number,
      optional:true
    },

    createdDate:{
      type:Date,
      optional:true
    }
})


MlOffice.attachSchema(MlOfficeSchema);
MlCollections['MlOffice'] = MlOffice;


