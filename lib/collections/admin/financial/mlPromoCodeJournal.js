import SimpleSchema from 'simpl-schema';
MlPromocodesJournal = new Mongo.Collection('mlPromocodesJournal');

var MlPromocodeJournalSchema=new SimpleSchema({

	promocodeId:{
		type: String,
		optional: true,
		label:"Promocode Id"
	},
	promocode:{
		type: String,
		optional: true,
		label:"Promocode"
	},
	promocodeType: {
		type: String,
		optional: true,
		label:"Promocode type"
	},
	promocodeValueType: {
		type: String,
		optional: true,
		allowedValues: ['percentage', 'amount'],
		label:"Promocode value type"
	},
	promocodeValue: {
		type: String,
		optional: true,
		label:"Promocode Value"

	},
	totalAmount:{
		type: String,
		optional: true,
		label:"Total amount"
	},
	promocodeUsedAmount:{
		type: String,
		optional: true,
		label:"Promocode used amount"
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
		}
	},
	transactionId:{
		type:String,
		optional: true,
		label: "Transaction Id"
	},
	transactionCode:{
		type:String,
		optional: true,
		label: "Transaction Code"
	},
	userId:{
		type:String,
		optional: true,
		label: "User id"
	},
	username:{
		type:String,
		optional: true,
		label: "Username"
	},
	createdAt:{
		type:Date,
		optional:true
	},
	status:{
		type:String,
		optional:true,
		label: "Status",
		allowedValues: ["used","unused"]
	},
	transactionStatus:{
		type:String,
		optional:true,
		label: "Transaction status"
	},
	locationName:{
		type:String,
		optional:true,
		label: "Location name"
	},
	resendStatus:{
		type:Boolean,
		optional:true,
		label: "Resend status",
		defaultValue: false
	}
});


//MlCollections.MlPromocodesJournal = MlPromocodesJournal;
//MlSchemas.MlPromocodeJournalSchema = MlPromocodeJournalSchema;
MlPromocodesJournal.attachSchema(MlPromocodeJournalSchema);
