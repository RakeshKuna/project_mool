/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlFeedBacks = new Mongo.Collection('mlFeedBacks');


MlFeedBackSchema = new SimpleSchema({
  resourceId:{
    type:String,
    optional:true
  },
  resourceType:{
    type:String,
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
MlCollections['MlFeedBacks']=MlFeedBacks;
