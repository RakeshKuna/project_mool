import SimpleSchema from 'simpl-schema';


import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlTimeZones = new Mongo.Collection('mlTimeZones');

MlTimeZonesSchema = new SimpleSchema({

    _id:{
        type:String,
        optional:false
    },

    countryCode:{
        type:String,
        optional:false
    },

    country:{
        type:String,
        optional:true
    },

    timeZone:{
        type:String,
        optional:false
    },

    gmtOffset:{
        type:String,
        optional:true
    }

})

MlTimeZones.attachSchema(MlTimeZonesSchema);
MlSchemas["MlTimeZones"] = MlTimeZonesSchema;
MlCollections['MlTimeZones'] = MlTimeZones;
