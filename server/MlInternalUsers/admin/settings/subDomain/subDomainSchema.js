import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let SubDomainSchema = `
  type SubDomain
  {
      _id:String,
      name:String,
      displayName :String,
      about: String,
      industryId:String,
      industryName:String,
      isActive:Boolean
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
  }
  
  input SubDomainMasterData
  {
      name :String,
      displayName :String,
      about: String,
      industryId:String,
      isActive:Boolean
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
  }
  
  type Mutation 
  {
      createSubDomain(SubDomainMasterData:SubDomainMasterData, moduleName:String, actionName:String):response
      updateSelectedSubDomain(SubDomainId:String, SubDomainMasterData:SubDomainMasterData):response
  }
  type Query{
      findSubDomain(SubDomainId:String): SubDomain
      fetchIndustryDomain(industryId: String):[SubDomain]
      fetchIndustryBasedSubDomain(industryId: [String]):[SubDomain]
  }
`;

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], SubDomainSchema]);
let supportedApi = [
  {api: 'createSubDomain', actionName: 'CREATE', moduleName: "SUBDOMAIN"},
  {api: 'updateSelectedSubDomain', actionName: 'UPDATE', moduleName: "SUBDOMAIN"},

  {api: 'findSubDomain', actionName: 'READ', moduleName: "SUBDOMAIN"},
  {api: 'fetchIndustryDomain', actionName: 'READ', moduleName: "SUBDOMAIN", isWhiteList: true},
  {api: 'fetchIndustryBasedSubDomain', actionName: 'READ', moduleName: "SUBDOMAIN", isWhiteList: true}
];
MlResolver.MlModuleResolver.push(supportedApi)

