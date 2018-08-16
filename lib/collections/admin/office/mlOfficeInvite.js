/**
 * Created by vishwadeep on 8/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlOfficeInvite = new Mongo.Collection('mlOfficeInvite');
MlOfficeInviteSchema = new SimpleSchema({
  officeId:{
    type:String,
    optional:true
  },
  toUserId:{
    type:String,
    optional:true
  },
  userType:{
    type:String,
    optional:true
  },
  isAccepted:{
    type:Boolean,
    optional:true
  },
  isDenied:{
    type:Boolean,
    optional:true
  },
  message:{
    type:String,
    optional:true
  },
  createdDate:{
    type:Date,
    optional:true
  }
})


MlOfficeInvite.attachSchema(MlOfficeInviteSchema);
MlCollections['MlOfficeInvite'] = MlOfficeInvite;
