

import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let CompanyType = `        
    
    type CompanyType{
      companyName :String
      companyDisplayName :String
      aboutCompany: String
      _id:String
      isActive:Boolean
    }
    type Mutation{
        CreateCompanyType(_id:String,companyName:String,companyDisplayName:String,aboutCompany:String,isActive:Boolean):String
        UpdateCompanyType(_id:String,companyName:String,companyDisplayName:String,aboutCompany:String,isActive:Boolean):String
    }
    type Query{
      FindCompanyType(_id:String):CompanyType
      fetchCompanyTypes:[CompanyType]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],CompanyType]);
