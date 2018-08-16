/**
 * Created by mohammed.mohasin on 6/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
MlInquiries = new Mongo.Collection('mlInquiries');


MlInquirySchema = new SimpleSchema({
  resourceId:{
    type:String,
    optional:true
    },
  resourceType:{
    type:String,
    optional:true
  },
  subject:{
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
    type:Date,
    optional:true
  }

});
MlCollections['MlInquiries']=MlInquiries;
