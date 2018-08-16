import SimpleSchema from 'simpl-schema';


import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlLanguages = new Mongo.Collection('mlLanguages');

MlLanguagesSchema = new SimpleSchema({

  _id:{
    type:String,
    optional:false
  },

  lang_code:{
    type:String,
    optional:false
  },

  language_name:{
    type:String,
    optional:true
  },

  native_name:{
    type:String,
    optional:false
  }
})

MlLanguages.attachSchema(MlLanguagesSchema);
MlSchemas["MlLanguages"] = MlLanguagesSchema;
MlCollections['MlLanguages'] = MlLanguages;
