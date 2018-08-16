import SimpleSchema from 'simpl-schema';
/**
 * Created by venkatasrinag on 25/1/17.
 */

import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlClusters = new Mongo.Collection('mlClusters');

SimpleSchema.extendOptions(['unique','index']);


MlClusterSchema = new SimpleSchema({
  countryName:{
        type:String,
        optional:false
    },
  clusterName:{
    type:String,
    optional:false
  },
  clusterCode:{
    type:String,
    optional:true,
    unique : true
  },
  countryId:{
        type:String,
        optional:false
    },

    countryFlag:{
        type:String,
        optional:true
    },
    about:{
        type:String,
        optional:true
    },

    displayName:{
        type:String,
        optional:false
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
    isEmailNotified:{
      type:Boolean,
      optional:true
    },
    showOnMap:{
        type:Boolean,
        optional:false
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


MlClusters.attachSchema(MlClusterSchema);

MlSchemas["MlClusters"] = MlClusterSchema;
MlCollections['MlClusters'] = MlClusters;
