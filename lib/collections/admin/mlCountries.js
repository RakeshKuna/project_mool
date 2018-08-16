import SimpleSchema from 'simpl-schema';
import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlCountries = new Mongo.Collection('mlCountries');


MlCountriesSchema = new SimpleSchema({

    country :
    {
        type : String,
        optional : false
    },

    countryCode :{
        type : String,
        optional : false
    },

    displayName :{
        type : String,
        optional : false
    },

    about :{
      type : String,
      optional : true
    },

    capital :{
      type : String,
      optional : true
    },

    url :{
        type : String,
        optional : true
    },
    isActive:{
        type: Boolean,
        optional:true
    },
    phoneNumberCode:{
      type:String,
      optional:true
    },
    status:{
        type: String,
        optional:true
    }
})


MlCountries.attachSchema(MlCountriesSchema);
MlSchemas["MlCountries"] = MlCountriesSchema;
MlCollections['MlCountries'] = MlCountries;
