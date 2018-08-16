//When a New User SignUp using the Referral Code then the Entry is created in the ReferralEntry schema.
// RefereeId is set to unique as at any point of time, One Referral User can refer to atmost One Referee User.
import SimpleSchema from 'simpl-schema';
MlUserReferralsEntry = new Mongo.Collection('mlUserReferralsEntry');

var MlUserReferralEntrySchema = new SimpleSchema({
"referralId": {
  type: String,
  optional: false
},
"refereeId": {
  type: String,
  optional: false,
  unique: true
},
"dateAndTime":{
	type:Number,
	optional:false
},
"status":{
  type:String,
  optional:true
}
});

MlUserReferralsEntry.attachSchema(MlUserReferralEntrySchema);

