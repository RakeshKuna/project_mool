/**
 * Created by pankaj on 16/5/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'
let actionAndStatusesSchema = `        
    
    type operationSchema {
        roleIds           : [String]
        about             : String
        actionName        : String
        actionDisplayName : String
        statusName        : String
        statusDisplayName : String
        status            : String
    }
    
    type departmentInfoSchema{
        departmentId      : String
        departmentName    : String
        subDepartmentId   : String
        subDepartmentName : String
        status            : String
        operation         : [operationSchema]
    }
    
    type actionAndStatusSchema{
         _id              : String
         processId        : String
         processName      : String
         subProcessId     : String
         subProcessName   : String
         clusterId        : String
         clusterName      : String
         isMoolya         : Boolean
         chapterId        : String
         chapterName      : String
         subChapterId     : String
         subChapterName   : String
         departmentInfo   : departmentInfoSchema
    }
    
    input operation {
        roleIds           : [String]
        about             : String
        actionName        : String
        actionDisplayName : String
        statusName        : String
        statusDisplayName : String
        status            : String
    }
    
    
    input departmentInfo {
        departmentId      : String
        departmentName    : String
        subDepartmentId   : String
        subDepartmentName : String
        status            : String
        operation         : [operation]
    }
    
    input actionAndStatus {
         processId        : String!
         processName      : String
         subProcessId     : String!
         subProcessName   : String
         clusterId        : String!
         clusterName      : String
         isMoolya         : Boolean!
         chapterId        : String!
         chapterName      : String
         subChapterId     : String!
         subChapterName   : String
         departmentInfo  : departmentInfo
    }
    
    type ActionAndStatusType {
         _id              : String
         processId        : String
         processName      : String
         subProcessId     : String
         subProcessName   : String
         clusterId        : String
         clusterName      : String
         isMoolya         : Boolean
         chapterId        : String
         chapterName      : String
         subChapterId     : String
         subChapterName   : String
         departmentInfo   : departmentInfoSchema
         createdAt        : String
         updatedAt        : String
         createdBy        : String
         updatedBy        : String
    }
    
    type Mutation{
         createActionsAndStatuses(actionsAndStatuses: actionAndStatus!, moduleName:String, actionName:String):response
         updateActionsAndStatuses(actionsAndStatusId: String, actionsAndStatuses: actionAndStatus!, moduleName:String, actionName:String):response
         updateGenericActionsAndStatuses(actionsAndStatusId: String, departmentInfo: departmentInfo!, moduleName:String, actionName:String):response
    }
    
    type Query{
        findActionsAndStatus(_id: String): actionAndStatusSchema
    }
    
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], actionAndStatusesSchema]);
let supportedApi = [
  {api:'createActionsAndStatuses', actionName:'CREATE', moduleName:"ACTIONANDSTATUS"},
  {api:'updateActionsAndStatuses', actionName:'UPDATE', moduleName:"ACTIONANDSTATUS"},
  {api:'updateGenericActionsAndStatuses', actionName:'UPDATE', moduleName:"ACTIONANDSTATUS"},
  {api:'findActionsAndStatus', actionName:'READ', moduleName:"ACTIONANDSTATUS"},

]
MlResolver.MlModuleResolver.push(supportedApi)
