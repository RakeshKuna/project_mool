//When a New User SignUp using the Referral Code then the Entry is created in the ReferralEntry schema.
// RefereeId is set to unique as at any point of time, One Referral User can refer to atmost One Referee User.
import SimpleSchema from 'simpl-schema';
MlCampaignCode = new Mongo.Collection('mlCampaignCode');

var MlCampaignCodeSchema = new SimpleSchema({
	type:{
		type:String,
		label:"Promotion Type",
		defaultValue:"promotion",
		allowedValues: ['promotion', 'referral'],

	},
	code:{
		type: String,
		optional: false,
		label:"Promotion Name/Code",
		unique:true,
		regEx:/^[a-zA-Z0-9!”$@#-:'<>.?%&’()*\+,\/;\[\\\]\^_`="{|}~\s]+$/,
		//regEx:/^[a-zA-Z0-9-_$#]+$/,
		custom: function () {
			if (Meteor.isClient && this.isSet&&this.isInsert) {
				var code=MlPromocodes.findOne({code:{$regex:'^'+this.value+'$',$options: "i" }});
				if(code){
					return "recordExists";

				}
			}
		}
	},
	description:{
		type: String,
		optional: false,
		label:"Description",
		autoValue:function(){
			if (this.value) {
				//console.log("converting sentence case");
				return toSentenceCase(this.value);
			}
		}
	},
	isActive:{
		type: Boolean,
		optional: true,
		label:"Active"
	},
	"validity.from":{
		type: Date,
		optional: false,
		label:"Valid From",
				custom: function () {
			if(this.value){
				var currentDateTime=moment().toDate().getTime();
				var selectedDateTime=moment(this.value).toDate().getTime();
				if(Meteor.isClient&&(this.isInsert||this.isUpsert)&&selectedDateTime<currentDateTime){
					SimpleSchema.messages({pastStartDate: "Valid From Date must be on or after "+moment(currentDateTime).format("YYYY-MM-DD")});
					return "pastStartDate";
				}
			}
			else if(this.value&&isNaN( this.value.getTime() )){
				return "invalidDate";
			}else if (moment(this.value).isAfter( moment(this.field('validity.to').value))) {
				return 'validStartDate';
			}
			var context = resolveNamedContext(this);
			if(this.field("type").value == "referral"){
				if(Meteor.isClient){
					var docId=this.docId?this.docId:"dummy";
					var fromDate=this.value;
					var promoCodeFromDate =null;
					if(fromDate && this.isSet){

						Meteor.call("checkDateOverlap",docId,fromDate,"from", function (err,res){
							if(res){
								//MlPromocodes.simpleSchema().namedContext(context).addInvalidKeys([{name:"validity.from",type:"dateOverlap"}])
								FlashMessages.sendError("Date overlap with another promocode");
							}
						})
					}

				}else{

					var docId=this.docId?this.docId:"dummy";
					var fromDate=this.value;
					var promoCodeFromDate =null;
					if(fromDate){
						promoCodeFromDate=MlPromocodes.findOne({"_id":{$ne:docId},"validity.from":{$lte: fromDate},"validity.to":{$gte:fromDate},isActive:true,type:"referral"});
						if (promoCodeFromDate){
							return "dateOverlap";
						}
					}
				}
			}

		}
	},
	"validity.to":{
		type: Date,
		optional: false,
		label:"Valid To",
				custom: function () {
			if(this.value&&isNaN( this.value.getTime() )){
				return "invalidDate";
			}else if (moment(this.value).isBefore( moment(this.field('validity.from').value))) {
				return 'validEndDate';
			}
			if(this.value){
				var currentDateTime=moment().toDate().getTime();
				var selectedDateTime=moment(this.value).toDate().getTime();
				if(Meteor.isClient&&(this.isInsert||this.isUpsert)&&selectedDateTime<currentDateTime){
					SimpleSchema.messages({pastEndDate: "Valid To Date must be on or after "+moment(currentDateTime).format("YYYY-MM-DD")});
					return "pastEndDate";
				}
			}
			if(this.field("type").value == "referral") {
				if (Meteor.isClient) {
					var docId = this.docId ? this.docId : "dummy";
					var toDate = this.value;
					var promoCodeToDate = null;
					if (toDate && this.isSet) {
						var context = resolveNamedContext(this);
						Meteor.call("checkDateOverlap", docId, toDate, "to", function (err, res) {
							if (res) {
								//MlPromocodes.simpleSchema().namedContext(context).addInvalidKeys([{name:"validity.to",type:"dateOverlap"}])
								FlashMessages.sendError("Date overlap with another promocode");
								return "dateOverlap"
							}
						})
					}

				} else {
					var docId = this.docId ? this.docId : "dummy";
					var toDate = this.value;
					var promoCodeToDate = null;
					if (toDate) {
						promoCodeToDate = MlPromocodes.findOne({
							"_id": {$ne: docId},
							"validity.from": {$lte: toDate},
							"validity.to": {$gte: toDate},
							isActive: true,
							type: "referral"
						});
						if (promoCodeToDate) {
							return "dateOverlap";
						}
					}
				}
			}
		}
	},
});

MlCampaignCode.attachSchema(MlCampaignCodeSchema);

