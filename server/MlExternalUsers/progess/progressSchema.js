/**
 * Created by Pankaj on 28/11/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef';
import MlResolver from '../../commons/mlResolverDef'

let progressSchema = `
  
  input progressDoc {
    name: String
    url: String
  }
  
  input progressVariable {
    name: String
    value: String
  }
  
  input progressReference {
    name: String
    value: String
    collection: String
  }
  
  input progress {
    userId: String
    profileId: String
    resourceType: String
    resourceId: String
    progressTemplateLiterals: String
    docs: [progressDoc]
    variables: [progressVariable]
    references: [progressReference]
  }
  
  type ProgressDoc {
    name: String
    url: String
  }
  
  type ProgressVariable {
    name: String
    value: String
  }
  
  type ProgressReference {
    name: String
    value: String
    collection: String
  }
  
  type Progress {
    userId: String
    profileId: String
    resourceType: String
    resourceId: String
    progressTemplateLiterals: String
    docs: [ProgressDoc]
    variables: [ProgressVariable]
    references: [ProgressReference]
  }
  
  type Query {
    fetchProgresses: [Progress]
  }
    
  type Mutation {
    createProgress(progress: progress) : response
  }
`;
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], progressSchema]);
let supportedApi = [
  {api:'fetchProgresses', actionName:'READ', moduleName:"OFFICE", isAppWhiteList: true},
  {api:'createProgress', actionName:'CREATE', moduleName:"OFFICE", isAppWhiteList: true},
];
MlResolver.MlModuleResolver.push(supportedApi);
