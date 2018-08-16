/**
 * Created by rajatshekhar on 27/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let FundingTypesSchema = `
    type FundingType
    {
        _id:String,
        fundingTypeName:String,
        displayName :String,
        about: String,
        icon:String,
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
        isActive:Boolean
    }
    
    input fundingTypeInput
    {
        fundingTypeName :String,
        displayName :String,
        about: String,
        icon:String,
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
        isActive:Boolean
    }
    
    type Mutation 
    {
        createFundingType(fundingType:fundingTypeInput, moduleName:String, actionName:String):response
        updateFundingType(fundingTypeId:String, fundingType:fundingTypeInput):response
    }
    type Query{
        fetchFundingType(fundingTypeId:String): FundingType
        fetchFundingTypes:[FundingType]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], FundingTypesSchema]);

let supportedApi = [
  {api:'fetchFundingType', actionName:'READ', moduleName:"FUNDINGTYPE"},
  {api:'fetchFundingTypes', actionName:'READ', moduleName:"FUNDINGTYPE", isWhiteList:true},

  {api:'createFundingType', actionName:'CREATE', moduleName:"FUNDINGTYPE"},
  {api:'updateFundingType', actionName:'UPDATE', moduleName:"FUNDINGTYPE"}
];
MlResolver.MlModuleResolver.push(supportedApi)

