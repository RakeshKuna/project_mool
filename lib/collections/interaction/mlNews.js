/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';

MlNews = new Mongo.Collection('mlNews');


MlNewsSchema = new SimpleSchema({
  message:{
    type:String,
    optional:true
  },
  userId:{
    type:String,
    optional:true
  },
  userEmail:{
    type:String,
    optional:true
  },
  createdOn:{
    type:String,
    optional:true
  },
  updatedOn:{
    type:String,
    optional:true
  },
  status:{
    type:String,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }

});
