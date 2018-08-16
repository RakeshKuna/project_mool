import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let TemplateAssignment = `        
    type SubProcess{
            _id             : String
            processName     : String
            subProcessName  : String
            createdBy       : String      
            createdDate     : Date
            steps           : [step]      
    }
    type step{
            stepId   : String
            stepCode : String
            stepName : String
            isActive : String    
    }
    type template{
            stepCode    : String
            stepName    : String
            templateCode: String
            templateName: String
            isActive          : Boolean
            createdDate       : Date
    }
    type stepsTemplates{
            step        : String
            template    : String
    }
    type TemplateAssignment{
            _id                       : String           
            templateprocess           : String
            templatesubProcess        : String
            templateProcessName       : String
            templateSubProcessName    : String
            templateGroupName         : String
            assignedTemplates         : [template]    
            createdBy                 : String      
            createdDate               : Date  
            modifiedBy                : String      
            modifiedDate              : Date
            templateclusterId         : String
            templateclusterName       : String
            templatechapterId         : String
            templatechapterName       : String
            templatesubChapterId      : String
            templatesubChapterName    : String
            templatecommunityCode       : String
            templatecommunityName     : String
            templateuserType          : String     
            templateidentity          : String        
            stepAvailability          : [stepsTemplates]       
    }
    input stepInput{
            stepCode    : String
            stepName    : String
            templateCode: String
            templateName: String
            isActive          : Boolean
            createdDate       : Date
    }
    input stepsTemplatesInput{
            step        : String
            template    : String
    }
    input templateInput{
            id                        : String
            templateprocess           : String
            templatesubProcess        : String
            templateProcessName       : String
            templateSubProcessName    : String
            templateGroupName         : String
            assignedTemplates         : [stepInput]    
            createdBy                 : String      
            createdDate               : Date  
            modifiedBy                : String      
            modifiedDate              : Date 
            templateclusterId         : String
            templateclusterName       : String
            templatechapterId         : String
            templatechapterName       : String
            templatesubChapterId      : String
            templatesubChapterName    : String
            templatecommunityCode       : String
            templatecommunityName     : String
            templateuserType          : String     
            templateidentity          : String 
            stepAvailability          : [stepsTemplatesInput]
    }
    type Query{
            findTemplateSteps(id: String):SubProcess           
            fetchAssignedTemplate(process:String,subProcess:String,stepCode:String,recordId:String, mode:String):template
            fetchSubProcess(id:String):[SubProcess]      
            findAssignedTemplates(id:String):TemplateAssignment
            findTemplateStepsSelect(id:String):[step]
    }
    type Mutation{
            createTemplateAssignment(template : templateInput):response
            updateTemplateAssignment(id:String,template:templateInput):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],TemplateAssignment]);

let supportedApi = [
  {api:'findTemplateSteps', actionName:'READ', moduleName:"TEMPLATEASSIGNMENT", isWhiteList:true},
  {api:'fetchAssignedTemplate', actionName:'READ', moduleName:"TEMPLATEASSIGNMENT", isWhiteList:true},
  {api:'fetchSubProcess', actionName:'READ', moduleName:"TEMPLATEASSIGNMENT", isWhiteList:true},
  {api:'findAssignedTemplates', actionName:'READ', moduleName:"TEMPLATEASSIGNMENT", isWhiteList:true},
  {api:'findTemplateStepsSelect', actionName:'READ', moduleName:"TEMPLATEASSIGNMENT", isWhiteList:true},
  {api:'createTemplateAssignment', actionName:'CREATE', moduleName:"TEMPLATEASSIGNMENT"},
  {api:'updateTemplateAssignment', actionName:'UPDATE', moduleName:"TEMPLATEASSIGNMENT"}
];
MlResolver.MlModuleResolver.push(supportedApi)
