import SimpleSchema from 'simpl-schema';

MlCurrencyType = new Mongo.Collection('mlCurrencyType');

MlCurrencyTypeSchema = new SimpleSchema({
  currencyName:{
    type:String,
    optional:false
  },
  currencyCode:{
    type:String,
    optional:true
  },
  countryCode:{
    type:String,
    optional:true
  },
  countryName:{
    type: String,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})

MlCurrencyType.attachSchema(MlCurrencyTypeSchema);
MlSchemas["MlCurrencyType"] = MlCurrencyTypeSchema;
MlCollections['MlCurrencyType'] = MlCurrencyType;

