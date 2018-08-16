/**
 * Created by venkatsrinag on 9/3/17.
 */
import SimpleSchema from 'simpl-schema';


MlResources = new Mongo.Collection('mlResources');

MlResourcesSchema = new SimpleSchema({

  name:{
    type:String,
    optional:true
  },

  displayName:{
    type:String,
    optional:true
  },

  code:{
    type:String,
    optional:true
  },

  isActive:{
    type:Boolean,
    optional:true
  }
})



MlResources.attachSchema(MlResourcesSchema);
