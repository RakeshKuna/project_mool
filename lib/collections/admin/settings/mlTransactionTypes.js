import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlTransactionTypes = new Mongo.Collection('mlTransactionTypes');

MlTransactionTypesSchema = new SimpleSchema({
  transactionName:{
    type:String,
    optional:false
  },
  transactionDisplayName:{
    type:String,
    optional:true
  },
  transactionDescription:{
    type: String,
    optional:true
  },
  createdDateTime:{
    type : Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlTransactionTypes.attachSchema(MlTransactionTypesSchema);
MlCollections['MlTransactionTypes'] = MlTransactionTypes;
