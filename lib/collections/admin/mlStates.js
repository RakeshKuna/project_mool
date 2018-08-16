import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
MlStates = new Mongo.Collection('mlStates');


MlStatesSchema = new SimpleSchema({

  name :{
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


MlStates.attachSchema(MlStatesSchema);
MlCollections['MlStates'] = MlStates;
