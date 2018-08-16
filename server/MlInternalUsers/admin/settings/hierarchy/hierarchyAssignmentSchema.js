import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let HierarchyAssignmentSchema = `

    type HierarchyAssignment{
      _id                  : String
      parentDepartment    : String
      parentSubDepartment : String
      clusterId           : String
      subChapterId        : String
      isDefaultSubChapter  : Boolean
      teamStructureAssignment : [teamStructureAssignment]
      finalApproval         : finalApproval
    }
      
    input finalApprovalInput{      
      department          : String
      subDepartment       : String
      role                : String
      isChecked           : Boolean
    }
    
    type finalApproval{      
      department          : String
      subDepartment       : String
      role                : String
      isChecked           : Boolean      
    }
   
    input teamStructureAssignmentInput{
      roleId            : String
      roleName          : String
      displayName       : String
      roleType          : String
      isAssigned        : Boolean
      assignedLevel     : String
      levelCode         : String
      reportingRole     : String
    }
  
    type teamStructureAssignment{
      roleId            : String
      roleName          : String
      displayName       : String
      roleType          : String
      isAssigned        : Boolean
      assignedLevel     : String
      levelCode         : String
      reportingRole     : String
    }
    
    input HierarchyAssignmentInput{
      id                  : String
      parentDepartment    : String
      parentSubDepartment : String
      clusterId           : String
      subChapterId        : String
      isDefaultSubChapter  : Boolean
      teamStructureAssignment : [teamStructureAssignmentInput]
      finalApproval         : finalApprovalInput
    }
    type Query{
      fetchAssignedRolesHierarchy(clusterId:String, hierarchyId:String,departmentId:String,subDepartmentId:String,subChapterId:String,type:String):HierarchyAssignment      
      fetchFinalApprovalRole(departmentId:String,subDepartmentId:String,clusterId:String, subChapterId:String, isDefaultSubChapter: Boolean):HierarchyAssignment
      fetchHierarchyRoles(clusterId:String,departmentId:String,subDepartmentId:String, subChapterId:String):[teamStructureAssignment]
      fetchHierarchyUsers(clusterId:String,departmentId:String,subDepartmentId:String,roleId:String, subChapterId:String):[BackendUsers]
    }
    type Mutation {
      updateHierarchyAssignment(hierarchy:HierarchyAssignmentInput):response
    }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],HierarchyAssignmentSchema]);

let supportedApi = [
  {api:'fetchAssignedRolesHierarchy', actionName:'READ', moduleName:"HIERARCHY"},
  {api:'fetchFinalApprovalRole', actionName:'READ', moduleName:"HIERARCHY"},
  {api:'fetchHierarchyRoles', actionName:'READ', moduleName:"HIERARCHY", isWhiteList:true},
  {api:'fetchHierarchyUsers', actionName:'READ', moduleName:"HIERARCHY", isWhiteList:true},

  {api:'updateHierarchyAssignment', actionName:'UPDATE', moduleName:"HIERARCHY"},
]

MlResolver.MlModuleResolver.push(supportedApi)
