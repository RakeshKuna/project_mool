import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

/**
 * Created by murali on 14/2/17.
 */
MlTaxation = new Mongo.Collection('mlTaxation');

MlTaxationSchema = new SimpleSchema({
    taxationName:{
      type : String,
      optional : true
    },
    taxationValidityFrom:{
      type : String,
      optional : true
    },
    taxationValidityTo:{
      type : String,
      optional : true
    },
    aboutTaxation:{
      type : String,
      optional : true
    },
    isActive:{
      type : Boolean,
      optional : true
    },
    taxInformation:{
      type : Array,
      optional : true
    },
    'taxInformation.$':{
      type : Object,
      optional : true
    },
    'taxInformation.$.taxId':{
      type : String,
      optional : true
    },
    'taxInformation.$.taxName':{
      type : String,
      optional : true
    },

    'taxInformation.$.taxPercentage':{
      type : String,
      optional : true
    },
    'taxInformation.$.applicableStates':{
      type : String,
      optional : true
    },
    'taxInformation.$.aboutTax':{
      type : String,
      optional : true
    },
    'taxInformation.$.statesInfo':{
      type : Array,
      optional : true
    },
    'taxInformation.$.statesInfo.$':{
      type : Object,
      optional : true
    },
    'taxInformation.$.statesInfo.$.stateName':{
      type : String,
      optional : true
    },
    'taxInformation.$.statesInfo.$.taxPercentage':{
      type : String,
      optional : true
    },
    'taxInformation.$.statesInfo.$.isChecked':{
      type : Boolean,
      optional : true
    },
    'taxInformation.$.statesInfo.$.taxId':{
      type : String,
      optional : true
    }

})

MlTaxation.attachSchema(MlTaxationSchema);
MlCollections['MlTaxation'] = MlTaxation;

