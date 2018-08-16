import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Template = `        
    type TemplateDetails{
            _id                         : String,
            procesId                    : String,
            subProcessId                : String,
            processName                 : String,
            subProcessName              : String,
            templates                   : [template],
            createdBy                   : String,
            createdDate                 : Date,
            isActive                    : Boolean  
    }
    type template{
            stepCode                    : String
            stepName                    : String
            templateCode                : String
            templateName                : String
            isActive                    : Boolean
            createdDate                 : Date
            templateDescription         : String
            templateImage               : String
    }    
    type Query{
            findStepAssignedTemplates(id: String,stepCode:String):TemplateDetails
            findTemplates(id:String,stepCode:String):TemplateDetails
            findTemplatesSelect(id:String,stepName:String):[template]
    }
     type Mutation{
            updateStepAssignedTemplate(id: String,templateCode:String,isActive:Boolean):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],Template]);
let supportedApi = [
  {api:'findStepAssignedTemplates', actionName:'READ', moduleName:"TEMPLATE"},
  {api:'findTemplates', actionName:'READ', moduleName:"TEMPLATE", isWhiteList:true},
  {api:'findTemplatesSelect', actionName:'READ', moduleName:"TEMPLATE", isWhiteList:true},
  {api:'updateStepAssignedTemplate', actionName:'UPDATE', moduleName:"TEMPLATE"}
];
MlResolver.MlModuleResolver.push(supportedApi)
