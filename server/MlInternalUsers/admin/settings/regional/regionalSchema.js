import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let RegionalSchema = `
    type Regional
    {
      _id :String
      clusterName : String
      capitalName : String
      regionalPhoneNumber : String
      regionalCurrencyName: String
      regionalCurrencyMarking: String
      regionalFlag : String
      aboutRegion : String
      regionalZipFormat : String
      regionalCurrencySymbol: String
      regionalCurrencyValue: String
      numberOfDigitsAfterDecimal :String
      metricnumberOfDigitsAfterDecimal :String
      firstDayOfWeek:String,
      currencySymbol:String,
      measurementSystem:String,
      currencyFormat:Boolean,
      rounding : String,
      valueSeparator:String
    }
    input regionalObject{
        clusterName : String,
        capitalName : String,
        regionalPhoneNumber : String,
        regionalCurrencyName: String,
        regionalCurrencyMarking: String,
        regionalFlag : String,
        aboutRegion : String,
        regionalZipFormat : String,
        regionalCurrencySymbol: String,
        regionalCurrencyValue: String,
        numberOfDigitsAfterDecimal :String,
        metricnumberOfDigitsAfterDecimal :String
        firstDayOfWeek:String,
        currencySymbol:String,
        measurementSystem:String,
        currencyFormat:Boolean,
        rounding : String,
        valueSeparator:String
        _id :String,
    }
    
   type Mutation 
    {
        updateRegional(_id:String, regional: regionalObject):String
        createRegional(regional:regionalObject):String
    }
    type Query{
        fetchRegional(_id:String): Regional
        fetchRegionals:[Regional]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],RegionalSchema]);

let supportedApi = [
  {api:'fetchRegional', actionName:'READ', moduleName:"REGIONAL"},
  {api:'fetchRegionals', actionName:'READ', moduleName:"REGIONAL"},

  {api:'createRegional', actionName:'CREATE', moduleName:"REGIONAL"},
  {api:'updateRegional', actionName:'UPDATE', moduleName:"REGIONAL"}
];
MlResolver.MlModuleResolver.push(supportedApi)
