import SimpleSchema from 'simpl-schema';
/**
 * Created by venkatasrinag on 25/1/17.
 */

import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlChapters = new Mongo.Collection('mlChapters');

MlChapterSchema = new SimpleSchema({
    clusterId:{
        type:String,
        optional:false
    },

    clusterName:{
        type:String,
        optional:false
    },

    chapterCode:{
        type:String,
        optional:true
    },
    chapterName:{
        type:String,
        optional:false
    },

    displayName:{
        type:String,
        optional:true
    },

    about:{
        type:String,
        optional:true
    },

    chapterImage:{
        type:String,
        optional:true
    },
    stateName:{
        type:String,
        optional:true
    },
    stateId:{
        type:String,
        optional:true
    },
    cityId:{
        type:String,
        optional:true,
        unique:true
     },
    cityName:{
      type:String,
      optional:true
    },
    latitude:{
        type:Number,
        optional:false
    },
    longitude:{
        type:Number,
        optional:false
    },
    email:{
        type:String,
        optional:true
    },
    showOnMap:{
        type: Boolean,
        optional:true
    },
    isActive:{
        type: Boolean,
        optional:true
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
    },
})

MlChapters.attachSchema(MlChapterSchema);
MlSchemas["MlChapters"] = MlChapterSchema;
MlCollections['MlChapters'] = MlChapters;
