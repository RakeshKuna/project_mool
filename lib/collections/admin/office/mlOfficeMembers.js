/**
 * Created by vishwadeep on 6/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../../common/commonSchemas";

MlOfficeMembers = new Mongo.Collection('mlOfficeMembers');
MlOfficeMembersSchema = new SimpleSchema({
  officeId:{
    type:String,
    optional:true
  },
  userId:{
    type:String,
    optional:true
  },
  profileId:{
    type:String,
    optional:true
  },
  firstName:{
    type:String,
    optional:true
  },
  lastName:{
    type:String,
    optional:true
  },

  mobileNumber:{
    type:Number,
    optional:true
  },

  emailId:{
    type:String,
    optional:true
  },

  communityType:{
      type:String,
      optional:true
  },

  description:{
    type:String,
    optional:true
  },
  name:{
    type:String,
    optional:true
  },
  joiningDate:{
    type:Date,
    optional:true
  },
  role:{
    type:String,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  },

  isPrincipal:{
    type:Boolean,
    optional:true
  },
  isIndependent:{
    type:Boolean,
    optional:true
  },
  isInternalUserInteraction:{
    type:Boolean,
    optional:true
  },
  isExternalUserInteraction:{
    type:Boolean,
    optional:true
  },
  isFreeze:{
    type:Boolean,
    optional:true
  },
  isRetire:{
    type:Boolean,
    optional:true
  },
  isFreeUser:{
      type:Boolean,
      optional:true
  },
  isPaidUser:{
      type:Boolean,
      optional:true
  },
  isAdminUser:{
      type:Boolean,
      optional:true
  },
  registrationId: {
    type: String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  }
})

MlOfficeMembers.attachSchema(MlOfficeMembersSchema);
MlCollections['MlOfficeMembers'] = MlOfficeMembers;
