/**
 * Created by mohammed.mohasin on 05/03/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let MasterSettingsSchema = `
       enum MASTER_SETTINGS_TYPE {
                LANGUAGE,TITLE,ADDRESSTYPE,EMAILTYPE,CONTACTTYPE,SOCIALLINKS,GENDER,
                EMPLOYMENTTYPE,COMPANYTYPE,TAXTYPE,TAXATION
      }
      type TaxTypeInfo{
          taxName:String
          aboutTax:String
          taxDisplayName:String
      }
      input TaxTypeInfoRequest{
          taxName:String
          aboutTax:String
          taxDisplayName:String
      }
    
      type LanguageInfo{
          languageName:String
          aboutLanguage:String
          languageDisplayName:String
      }
      
      input LanguageInfoRequest{
          languageName:String
          aboutLanguage:String
          languageDisplayName:String
      }
      
      type AddressTypeInfo{
          addressName:String
          aboutAddress:String
          addressDisplayName:String
          addressUploadIcon:String
      }
      
      input AddressTypeInfoRequest{
          addressName:String
          aboutAddress:String
          addressDisplayName:String
          addressUploadIcon:String
      }
     
     type TitleInfo{
          titleName:String
          aboutTitle:String
          titleDisplayName:String
      }
      
      input TitleInfoRequest{
          titleName:String
          aboutTitle:String
          titleDisplayName:String
      }
      
      type EmploymentTypeInfo{
          employmentName:String
          employmentDisplayName:String
          aboutEmployment:String
      }
      
      input EmploymentTypeInfoRequest{
          employmentName:String
          employmentDisplayName:String
          aboutEmployment:String
      }
      
      
      type CompanyTypeInfo{
          companyName:String
          companyDisplayName:String
          aboutCompany:String
      }
      
      input CompanyTypeInfoRequest{
          companyName:String
          companyDisplayName:String
          aboutCompany:String
      }
      
      
      type EmailTypeInfo{
          emailName:String
          emailDisplayName:String
          aboutEmail:String
          emailUploadIcon:String
      }
      
      input EmailTypeInfoRequest{
          emailName:String
          emailDisplayName:String
          aboutEmail:String
          emailUploadIcon:String
      }
      
      type GenderInfo{
          genderName:String
          genderDisplayName:String
          aboutGender:String
          genderUploadIcon:String
      }
      
      input GenderInfoRequest{
          genderName:String
          genderDisplayName:String
          aboutGender:String
          genderUploadIcon:String
      }
      
      type ContactTypeInfo{
          contactName:String
          contactDisplayName:String
          aboutContact:String
          contactUploadIcon:String
      }
      
      input ContactTypeInfoRequest{
          contactName:String
          contactDisplayName:String
          aboutContact:String
          contactUploadIcon:String
      }
      
       type SocialLinksInfo{
          socialName:String
          socialDisplayName:String
          aboutSocial:String
          socialUploadIcon:String
      }
      
      input SocialLinksInfoRequest{
          socialName:String
          socialDisplayName:String
          aboutSocial:String
          socialUploadIcon:String
      }
      
      
      type MasterSettings{
         _id:String,
         isActive:Boolean
         taxTypeInfo:TaxTypeInfo
         languageInfo:LanguageInfo
         addressTypeInfo:AddressTypeInfo
         titleInfo:TitleInfo
         employmentTypeInfo:EmploymentTypeInfo
         companyTypeInfo:CompanyTypeInfo
         emailTypeInfo:EmailTypeInfo
         genderInfo:GenderInfo
         contactTypeInfo:ContactTypeInfo
         socialLinksInfo:SocialLinksInfo
      }
      
      input MasterSettingsRequest{
         _id:String
         isActive:Boolean
         taxTypeInfo:TaxTypeInfoRequest
         languageInfo:LanguageInfoRequest
         addressTypeInfo:AddressTypeInfoRequest
         titleInfo:TitleInfoRequest
         employmentTypeInfo:EmploymentTypeInfoRequest
         companyTypeInfo:CompanyTypeInfoRequest
         emailTypeInfo:EmailTypeInfoRequest
         genderInfo:GenderInfoRequest
         contactTypeInfo:ContactTypeInfoRequest
         socialLinksInfo:SocialLinksInfoRequest
      }
      type MasterSettingsDropData{
          label:String,
          value:String
      }
      type Query{
        fetchMasterSettings(type:MASTER_SETTINGS_TYPE!):[MasterSettings]
        findMasterSetting(_id:String):MasterSettings
        fetchMasterSettingsForDropDown(type:MASTER_SETTINGS_TYPE!):[MasterSettingsDropData]
        fetchMasterSettingsForPlatFormAdmin(type:String,hierarchyRefId:String):[MasterSettingsDropData]
        
    }
    
    type Mutation{
      createMasterSetting(moduleName:String,actionName:String,type:MASTER_SETTINGS_TYPE!,masterData:MasterSettingsRequest):String
      updateMasterSetting(moduleName:String,actionName:String,type:MASTER_SETTINGS_TYPE!,masterData:MasterSettingsRequest):String
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],MasterSettingsSchema]);
let supportedApi = [
    {api:'fetchMasterSettings', actionName:'READ', moduleName:"MASTERSETTINGS", isWhiteList:true},
    {api:'findMasterSetting', actionName:'READ', moduleName:"MASTERSETTINGS", isWhiteList:true},
    {api:'fetchMasterSettingsForDropDown', actionName:'READ', moduleName:"MASTERSETTINGS", isWhiteList:true},
    {api:'fetchMasterSettingsForPlatFormAdmin', actionName:'READ', moduleName:"MASTERSETTINGS", isWhiteList:true},
    {api:'createMasterSetting', actionName:'CREATE', moduleName:"MASTERSETTINGS"},
    {api:'updateMasterSetting', actionName:'UPDATE', moduleName:"MASTERSETTINGS"}
]
MlResolver.MlModuleResolver.push(supportedApi)
