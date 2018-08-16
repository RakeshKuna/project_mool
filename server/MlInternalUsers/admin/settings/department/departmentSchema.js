import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let departmentSchema = `        
    
    type DepatmentAvailableSchema{
        cluster     : [String]
        chapter     : String
        subChapter  : String
        email       : String
        isActive    : Boolean
    }
    
    type Department{
         _id            : String
         departmentName : String
         displayName    : String
         departmentDesc : String
         isActive       : Boolean
         isSystemDefined : Boolean
         clustersList   : [String]
         chaptersList   : [String]
         subChapterList : [String]
         isMoolya       : Boolean
          createdBy     : String
          createdDate   : Date
          updatedBy     : String
           updatedDate  : Date
         depatmentAvailable:[DepatmentAvailableSchema]
    }
    
    type DepartmentBasedOnClusterChapterAndSubChapter {
        departmentId :  String
        departmentName : String
        subDepartmentId : String
        subDepartmentName : String
    }
   
    input DepatmentAvailable{
        cluster     : [String]
        chapter     : String
        subChapter  : String
        email       : String
        isActive    : Boolean
    }
    
    input departmentObject{
          departmentName:String,
          displayName:String,
          departmentDesc:String,
          isActive:Boolean,
          isMoolya:Boolean,
          createdBy     : String
          createdDate   : Date
          updatedBy     : String
          updatedDate   : Date
          isSystemDefined : Boolean
          depatmentAvailable:[DepatmentAvailable]
    }
    
    type Mutation{
         createDepartment(department: departmentObject!, moduleName:String!, actionName:String!):response
         updateDepartment(departmentId:String, department: departmentObject, moduleName:String, actionName:String):response
    }
    type Query{
        findDepartment(departmentId:String):Department
        fetchDepartments:[Department]
        fetchActiveDepartment:[Department]
        fetchMoolyaBasedDepartment(isMoolya:Boolean,clusterId:String):[Department]
        fetchNonMoolyaBasedDepartment(isMoolya:Boolean,clusterId:String,subChapter:String):[Department]
        fetchDepartmentsForRegistration(cluster:String,chapter:String,subChapter:String):[Department]    
        fetchMoolyaBasedDepartmentRoles(isMoolya:Boolean,clusterId:String):[Department]
        fetchClusterChapterSubChapterBasedDepartmentRoles(isMoolya: Boolean, cluster: String, chapter: String, subChapter: String): [DepartmentBasedOnClusterChapterAndSubChapter]
        fetchHierarchyMoolyaDepartment(isMoolya:Boolean,clusterId:String, subChapterId:String):[Department]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], departmentSchema]);
let supportedApi = [
    {api:'createDepartment', actionName:'CREATE', moduleName:"DEPARTMENT"},
    {api:'updateDepartment', actionName:'UPDATE', moduleName:"DEPARTMENT"},
    {api:'fetchDepartments', actionName:'READ', moduleName:"DEPARTMENT", isWhiteList:true},
    {api:'findDepartment', actionName:'READ', moduleName:"DEPARTMENT"},
    {api:'fetchActiveDepartment', actionName:'READ', moduleName:"DEPARTMENT"},
    {api:'fetchMoolyaBasedDepartment', actionName:'READ', moduleName:"DEPARTMENT", isWhiteList:true},
    {api:'fetchNonMoolyaBasedDepartment', actionName:'READ', moduleName:"DEPARTMENT", isWhiteList:true},
    {api:'fetchDepartmentsForRegistration', actionName:'READ', moduleName:"DEPARTMENT", isWhiteList:true},
    {api:'fetchMoolyaBasedDepartmentRoles', actionName:'READ', moduleName:"DEPARTMENT"},
    {api:'fetchClusterChapterSubChapterBasedDepartmentRoles', actionName:'READ', moduleName:"DEPARTMENT"},
    {api:'fetchHierarchyMoolyaDepartment', actionName:'READ', moduleName:"DEPARTMENT", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)
