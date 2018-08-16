/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlFollowings = new Mongo.Collection('mlFollowings');


MlFollowingSchema = new SimpleSchema({
  followerId:{
    type:String,
    optional:false
  },
  followerEmail:{
    type:String,
    optional:false
  },
  followedBy:{
    type:String,
    optional:false
  },
  followedByEmail:{
    type:String,
    optional:false
  },
  createdOn:{
    type:Date,
    optional:true
  },
  createdBy:{
    type:String,
    optional:true
  },
  updatedOn:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional:true
  },
  isActive:{//isUnFollowed
    type:Boolean,
    optional:true
  }

});
MlCollections['MlFollowings']=MlFollowings;
