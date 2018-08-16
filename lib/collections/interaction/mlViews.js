/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlViews = new Mongo.Collection('mlViews');


MlViewSchema = new SimpleSchema({
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
  updatedOn:{
    type:Date,
    optional:true
  }
});

MlViews.attachSchema(MlViewSchema);
MlCollections['MlViews']=MlViews;
