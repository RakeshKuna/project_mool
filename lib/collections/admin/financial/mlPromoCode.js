import SimpleSchema from 'simpl-schema';
MlPromocodes = new Mongo.Collection('mlPromocodes');
import moment from "moment";

var MlPromocodeSchema=new SimpleSchema({
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
		unique:true
    //regEx:/^[a-zA-Z0-9!”$@#-:'<>.?%&’()*\+,\/;\[\\\]\^_`="{|}~\s]+$/,
		//regEx:/^[a-zA-Z0-9-_$#]+$/,
		/*custom: function () {
			if (Meteor.isClient && this.isSet&&this.isInsert) {
				var code=MlPromocodes.findOne({code:{$regex:'^'+this.value+'$',$options: "i" }});
				if(code){
					return "recordExists";

				}
			}
		}*/
	},
	description:{
		type: String,
		optional: false,
		label:"Description"
	},
	isActive:{
		type: Boolean,
		optional: true,
		label:"Active"
	},
	validityFrom:{
		type: Date,
		optional: false,
		label:"Valid From"
				/*custom: function () {
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
			//var context = resolveNamedContext(this);
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

		}*/
	},
	validityTo:{
		type: Date,
		optional: false,
		label:"Valid To"
    /*,
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
						//var context = resolveNamedContext(this);
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
		}*/
	}
	/*,
	"referral.discountType": {
		type: String,
		optional:true,
		defaultValue:"percentage",
		allowedValues: ['percentage', 'amount'],
	},
	"referral.discountValue":{
		type: Number,
		optional: true,
		min:0,
		label:"Percentage/Amount",
		custom:function(){
			if(this.field("type").value == "referral"){
				if(!this.value){
					return "required";
				}
			}
			if (this.siblingField('discountType').value) {
				var discountType=this.siblingField('discountType').value;
				var value=Number(this.value);
				if(value&&!isNaN(value)&&value>100&&discountType==="percentage"){
					return "invalidPercentage";
				}
			}
		}
	},
	"referee.discountType": {
		type: String,
		optional:true,
		defaultValue:"percentage",
		allowedValues: ['percentage', 'amount'],
		custom: function () {
			if(this.field("type").value == "referral"){
				if(!this.value){
					return "required";
				}
			}
		},
	},
	"referee.discountValue":{
		type: Number,
		optional: true,
		min:0,
		label:"Percentage/Amount",
		custom:function(){
			if(this.field("type").value == "referral"){
				if(!this.value){
					return "required";
				}
			}
			if (this.siblingField('discountType').value) {
				var discountType=this.siblingField('discountType').value;
				var value=Number(this.value);
				if(value&&!isNaN(value)&&value>100&&discountType==="percentage"){
					return "invalidPercentage";
				}
			}
		}
	},
	discountType: {
		type: String,
		optional: true,
		label: "Promo Code Value Type",
		allowedValues: ['percentage', 'amount'],
		defaultValue:"percentage",
		custom:function () {
			if(this.field("type").value == "promotion"){
				if(!this.value){
					return "required";
				}
			}
		}
	},
	discountValue:{
		type: Number,
		optional: true,
		min:0,
		label:"Promo Code Percentage / Promo Code Amount",
		custom:function(){
			if(this.field("type").value == "promotion"){
				if(!this.value){
					return "required";
				}
			}
			if (this.siblingField('discountType').value) {
				var discountType=this.siblingField('discountType').value;
				var value=Number(this.value);
				if(value && value < 0){
					return "noNegativeValues";
				}
				if(value&&!isNaN(value)&&value>100&&discountType==="percentage"){
					return "invalidPercentage";
				}
			}
		}
	},
	upperLimit:{
		type:Number,
		optional:true,
		min:0,
		label:"Maximum Amount for Promotion to Apply",
		custom:function(){
			if(this.value && this.field("minimumPurchase").value){
				if(this.field("minimumPurchase").value > this.value){
					return "maximumPurchaseAmountGreterThenMinumumAmount"
				}
			}
			if(this.value && this.value < 0) {
				return "noNegativeValues";
			}
		}
	},
	upperLimitPromotionAmount: {
		type:Number,
		optional:true,
		min:0,
		label:"Maximum discounted amount",
		custom:function(){
			if(this.value && this.value < 0) {
				return "noNegativeValues";
			}
		}
	}
	,
	minimumPurchase: {
		type: Number,
		label:"Minimum Amount for Promotion to Apply",
		min:1,
		defaultValue: 0.0,
		custom:function(){
			var discountType;
			var discountValue;
			if(this.field("type").value == "promotion"){
				discountValue=Number(this.field("discountValue").value);
				discountType =this.field("discountType").value;
			}else{
				if(this.field("referee.discountValue").value && this.field("referral.discountValue").value){
					if(this.field("referee.discountValue").value >= this.field("referral.discountValue").value){
						discountType = this.field("referee.discountType").value
						discountValue=Number(this.field("referee.discountValue").value);
					}else{
						discountType = this.field("referral.discountType").value;
						discountValue=Number(this.field("referral.discountValue").value);
					}
				}


			}

			if(this.value && this.value < 0){
				return "noNegativeValues";
			}
			if(this.value&&discountType==="amount"&&discountValue&&!isNaN(discountValue)&&discountValue>this.value){
				return "minimumPurchaseDiscountAmountValidation";
			}
		}
	},
	usagePerUser:{
		type: String,
		label:"Usage Per User",
		defaultValue:"unlimited",
		allowedValues: ['once', 'twice','unlimited'],

	},
	userCount:{
		type:Number,
		optional:true,
		label:"Count of Users"
	},
	usagePerProvider:{
		type: String,
		label:"Usage Per Service Provider",
		defaultValue:"multiple",
		allowedValues: ['once','multiple'],

	},
	specificDevice:{
		type: String,
		label:"Types of Devices",
		defaultValue:"all",
		allowedValues: ['all','mobile','web'],

	},
	specificGender:{
		type: String,
		label:"Promotions Based on Gender",
		allowedValues: ['all','male','female'],
		defaultValue:"all",

	},
	isAgeSpecific:{
		type:Boolean,
		optional:true,
		label:"Promotions Based on Age Group",
	},
	fromAge: {
		type: Number,
		optional:true,
		label:"From Age",
		min:1,

	},
	toAge: {
		type: Number,
		optional:true,
		label:"To Age",
		min:1,
		custom:function(){
			var fromAge=this.field("fromAge").value;
			if(this.value&&fromAge&&fromAge>this.value){
				return "ageValidation";
			}
		}
	},
	isUserSpecific:{
		type:Boolean,
		optional:true,
		label:"User Specific",
	}*/
	/*,
	specificUsers:{
		// type:[String],
    type:Array,
		optional:true,
		label:"Applicable Users",
		autoValue: function() {
			return setAutoValueBasedOnSiblingCheckbox('isUserSpecific',this);
		},
		custom:function(){
			if(this.field("isUserSpecific").value){
				if(!this.value||this.value.length<1){
					return "required";
				}
			}
		}
	},
  'specificUsers.$':{
    type:String,
    optional:true,
    label:"Applicable Users",
    autoValue: function() {
      return setAutoValueBasedOnSiblingCheckbox('isUserSpecific',this);
    },
    custom:function(){
      if(this.field("isUserSpecific").value){
        if(!this.value||this.value.length<1){
          return "required";
        }
      }
    }
  },
	"specificLocation.$.country": {
		type: String,
		optional:true,
		autoValue: function(){
			if(this.value && this.value === "Select Country"){
				return null;
			}
		}
	},
	"specificLocation.$.state": {
		type: String,
		optional:true,
		autoValue: function(){
			if(this.value && this.value === "Select State"){
				return null;
			}
		}
	},
	"specificLocation.$.city": {
		type: String,
		optional:true,
		autoValue: function(){
			if(this.value && this.value === "Select City"){
				return null;
			}
		}
	},
	mode:{
		type: String,
		optional:true,
		defaultValue: "manual",
		allowedValues: ['automatic','manual']
	},
	"referralPromocodeBases": {
		type: Object,
		optional: true,
		blackbox: true
	},
	isReferral: {
		type: Boolean,
		optional: true,
		defaultValue: false
	}*/
});

MlPromocodes.attachSchema(MlPromocodeSchema);


