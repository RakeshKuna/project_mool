import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
MlCities = new Mongo.Collection('mlCities');


MlCitiesSchema = new SimpleSchema({

  name :{
    type : String,
    optional : false
  },
  stateId :{
    type : String,
    optional : false
  },
  countryId :{
    type : String,
    optional : false
  },
  countryCode :{
    type : String,
    optional : false
  },
  displayName :{
    type : String,
    optional : true
  },
  about :{
    type : String,
    optional : true
  },
  isActive:{
    type: Boolean,
    optional:true
  }
})


MlCities.attachSchema(MlCitiesSchema);
MlCollections['MlCities'] = MlCities;
