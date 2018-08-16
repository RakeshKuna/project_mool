/**
 * Created by vishwadeep on 15/9/17.
 */
import SimpleSchema from 'simpl-schema';
import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'
MlSeo = new Mongo.Collection('mlSeo');

MlSeoDetails = new SimpleSchema({
  userId:{
    type:String,
    optional:true
  },
  createdBy:{
    type:String,
    optional:true
  },
  url:{
    type:String,
    optional:true
  },
  seoDetails:{
    type:String,
    optional:true
  },
  timestamp:{
    type:Date,
    optional: true,
    defaultValue: new Date()
  }
})
MlSeo.attachSchema(MlSeoDetails);
MlSchemas["MlSeo"] = MlSeoDetails;
MlCollections['MlSeo'] = MlSeo;
