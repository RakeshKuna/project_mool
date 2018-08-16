


import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let moolya = `
    interface moolya {
     id : String
     }

    type Cluster implements moolya {
      id : String
      countryId: String
      displayName: String
    }    
    type Chapter implements moolya {
      id : String
      clusterId: String
      chapterName: String
    }
    
    
`

//MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'],moolya]);

let search = `
union SearchResult = GenericType | Cluster | Chapter | SubChapter | Community | Department | SubDepartment | Requests | Countries | States | Cities | UserTypes | Transaction | RoleTypes | DocumentTypes | DocumentFormats | KycCategories | DocumentMapping | Account | BackendUsers | Industry | Specification | Profession | Entity | StageOfCompany | BusinessType | Citizenship | LookingFor | Assets | Technologies | SubDomain | FundingType | Roles | ProcessType | Tax | taxation | Title | Regional | Language | DateAndTime | NumericalFormat | AddressType | CompanyType | Gender | SocialLinks | EmployeeType | EmailType | ContactType | RegistrationInfo | TemplateDetails | TemplateAssignment | Hierarchy | Portfoliodetails | Award | Filters | FunderPortfolio | ActionAndStatusType | officeTransactionType | myTransaction | serviceProviderPortfolioDetails | startupPortfolioOutput | NotificationTemplate | OfficePackage 

input SearchGenericSpec{
  filter:[GenericFilter],
    sort  :String
}

type GenericType{
       _id:String
}

input GenericFilter {
   fieldName: String,
   value: String,
   fieldType:String,
   operator:String
}

input SortFilter {
  fieldName : String,
  sort : String
}
type SearchResp {
  totalRecords:Int,
  data:[SearchResult]
}

input CustomParams{
   docId:String
}

type Query {
  SearchQuery(module: String!,customParams: CustomParams, offset: Int,limit:Int,fieldsData:[GenericFilter],sortData:[SortFilter]): SearchResp!
}`

MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'],search]);
let supportedApi = [{api:'SearchQuery', actionName:'READ', moduleName:"GENERIC"}];
MlResolver.MlModuleResolver.push(supportedApi)

//have to integrate to search
// valueType: String || Boolean || Date,
// operator: String!,
// valueType: String

// SearchQuery(module: String!,offset: Int,limit:Int,fieldsData:[GenericFilter]): SearchResp!
