/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlLikes = new Mongo.Collection('mlLikes');


MlLikeSchema = new SimpleSchema({
  resourceId:{
    type:String,
    optional:true
    },
  resourceType:{
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
  isActive:{//unlike if its false
    type:Boolean,
    optional:true
  }

});

MlCollections['MlLikes']=MlLikes;
