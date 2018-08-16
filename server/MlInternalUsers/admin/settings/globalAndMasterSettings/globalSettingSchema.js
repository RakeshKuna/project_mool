/**
 * Created by mohammed.mohasin on 04/03/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let GlobalSettingsSchema = `
   enum GLOBAL_SETTINGS_TYPE {
            DATEANDTIME,NUMERICAL,REGIONAL
   }
      
      type DateAndTimeInfo{
           timeFormat:String
           amSymbol:String
           pmSymbol:String
           dateFormat:String
           numberOfDaysInWeek:String
           firstDayOfWeek:String   
           hoursFormat:Boolean
           timeZone:String
      }
      
      type NumericalInfo{
             numberOfDigitsAfterDecimal:String,
             firstDayOfWeek:String,
             currencySymbol:String,
             measurementSystem:String,
             currencyFormat:Boolean,
             valueSeparator:String
      }
      
      type RegionalInfo{
             clusterName:String,
             capitalName:String,
             regionalPhoneNumber:String,
             regionalCurrencyName:String,
             regionalCurrencyMarking:String,
             regionalFlag:String,
             aboutRegion:String,
             regionalZipFormat:String
             regionalCurrencySymbol:String
             regionalCurrencyValue:String,
             numberOfDigitsAfterDecimal:String,
             metricnumberOfDigitsAfterDecimal:String,
             firstDayOfWeek:String,
             currencySymbol:String,
             measurementSystem:String,
             currencyFormat:Boolean,
             rounding:String,
             valueSeparator:String
             _id:String
       }

      input DateAndTimeInfoRequest{
           timeFormat:String
           amSymbol:String
           pmSymbol:String
           dateFormat:String
           numberOfDaysInWeek:String
           firstDayOfWeek:String 
           hoursFormat:Boolean
           timeZone:String
      }
      
      input NumericalInfoRequest{
           numberOfDigitsAfterDecimal:String,
           firstDayOfWeek:String,
           currencySymbol:String,
           measurementSystem:String,
           currencyFormat:Boolean,
           valueSeparator:String
      }
      
      input RegionalInfoRequest{
             clusterName:String,
             capitalName:String,
             regionalPhoneNumber:String,
             regionalCurrencyName:String,
             regionalCurrencyMarking:String,
             regionalFlag:String,
             aboutRegion:String,
             regionalZipFormat:String
             regionalCurrencySymbol:String
             regionalCurrencyValue:String
             numberOfDigitsAfterDecimal:String,
             metricnumberOfDigitsAfterDecimal:String
             firstDayOfWeek:String,
             currencySymbol:String,
             measurementSystem:String,
             currencyFormat:Boolean,
             rounding:String,
             valueSeparator:String
       }
      
      
      type GlobalSettings{
         dateAndTimeInfo:DateAndTimeInfo
         numericalInfo:NumericalInfo,
         regionalInfo:RegionalInfo
      }
      
      input GlobalSettingsRequest{
         dateAndTimeInfo:DateAndTimeInfoRequest
         numericalInfo:NumericalInfoRequest
         regionalInfo:RegionalInfoRequest
      }
      
      type timeZone{
         _id:String
         countryCode:String
         country: String
         timeZone:String
         gmtOffset:String
      }
      
      type language{
         _id:String
         lang_code:String
         language_name: String
         native_name:String
      }

      type Query{
        fetchGlobalSettings(type:GLOBAL_SETTINGS_TYPE):[GlobalSettings]    
        findTimeZones(clusterId:String):[timeZone]
        findRounding : [RegionalInfo]
        findLanguages: [language]
        findCurrencyNames : [RegionalInfo]
      }
    
    type Mutation{
      updateGlobalSetting(type:GLOBAL_SETTINGS_TYPE!,settingsData:GlobalSettingsRequest):String
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],GlobalSettingsSchema]);

let supportedApi = [
    {api:'fetchGlobalSettings', actionName:'READ', moduleName:"GLOBALSETTINGS", isWhiteList:true},
    {api:'updateGlobalSetting', actionName:'UPDATE', moduleName:"GLOBALSETTINGS"},
    {api:'findTimeZones', actionName:'READ', moduleName:"GLOBALSETTINGS", isWhiteList:true},
    {api: 'findCurrencyNames', actionName:'READ',moduleName:"GLOBALSETTINGS", isWhiteList:true},
    {api:'findRounding', actionName:'READ', moudleName:"GLOBALSETTTINGS",isWhiteList:true},
    {api:'findLanguages', actionName:'READ', moduleName:"GLOBALSETTINGS", isWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)
