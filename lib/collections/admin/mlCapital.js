/**
 * Created by sravani on 11/7/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
MlCapital = new Mongo.Collection('mlCountryCapitals');


MlCapitalSchema = new SimpleSchema({

  _id :{
    type : String,
    optional : false
  },
  countryName :{
    type : String,
    optional : false
  },
  capital :{
    type : String,
    optional : false
  },
  lat :{
    type : String,
    optional : true
  },
  long:{
    type : String,
    optional : true
  },
  countryCode:{
    type: String,
    optional:true
  }
})


MlCapital.attachSchema(MlCapitalSchema);
MlSchemas["MlCapital"] =MlCapitalSchema;
MlCollections['MlCapital'] = MlCapital;
