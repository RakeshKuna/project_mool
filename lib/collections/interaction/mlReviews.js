/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlReviews = new Mongo.Collection('mlReviews');


MlReviewSchema = new SimpleSchema({
  resourceId:{
    type:String,
    optional:true
  },
  resourceType:{
    type:String,
    optional:true
  },
  rating:{
    type:Number,
    optional:true
  },
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
    type:Date,
    optional:true
  },
  updatedOn:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:Date,
    optional:true
  },
  status:{
    type:String,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  },
  status:{
    type:SimpleSchema.Integer,
    optional:true
  }

});
MlCollections['MlReviews']=MlReviews;
