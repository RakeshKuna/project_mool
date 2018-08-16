import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let subDepartmentSchema = `
  
   
    type SubDepartment{
        _id:String,
        subDepartmentName:String,
        displayName:String,
          aboutSubDepartment:String,
        isActive:Boolean,
        departmentId:String,
        isMoolya:Boolean,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
         updatedDate  : Date
        departmentAliasName : String,
        clustersList   : [String],
        chaptersList   : [String],
        subChapterList : [String],
        subDepatmentAvailable: [subDepatmentAvailable]
    }
    
    type subDepatmentAvailable{ 
        cluster     : [String],
        chapter     : String,
        subChapter  : String,
        email       : String,
        isActive    : Boolean
    }
    
    
    input SubDepatmentAvailable
    {
        cluster     : [String],
        chapter     : String,
        subChapter  : String,
        email       : String,
        isActive    : Boolean
    }
    
    input subDepartmentObject{
        subDepartmentName:String,
        displayName:String,
        aboutSubDepartment:String,
        isActive:Boolean,
        departmentId:String,
        isMoolya:Boolean,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate  : Date
        subDepatmentAvailable:[SubDepatmentAvailable]
    }
    
    type Mutation{
        createSubDepartment(subDepartment:subDepartmentObject, moduleName:String, actionName:String):response
        updateSubDepartment(subDepartmentId:String, subDepartment:subDepartmentObject, moduleName:String, actionName:String):response
    }
    type Query{
        findSubDepartment(_id: String): SubDepartment
        findSubDepartments: [SubDepartment]
        fetchSubDepartments(id: String):[SubDepartment]
        fetchActiveSubDepartments(departmentId: String):[SubDepartment]
        fetchSubDepartmentsForRegistration(id: String, isActive: Boolean):[SubDepartment]
        fetchSubDepartmentsHierarchy(id: String,subDepartmentId:String):[SubDepartment]
    }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],subDepartmentSchema]);
let supportedApi = [
    {api:'createSubDepartment', actionName:'CREATE', moduleName:"SUBDEPARTMENT"},
    {api:'updateSubDepartment', actionName:'UPDATE', moduleName:"SUBDEPARTMENT"},
    {api:'findSubDepartment', actionName:'READ', moduleName:"SUBDEPARTMENT"},
    {api:'fetchSubDepartments', actionName:'READ', moduleName:"SUBDEPARTMENT", isWhiteList:true},
    {api:'findSubDepartments', actionName:'READ', moduleName:"SUBDEPARTMENT"},
    {api:'fetchActiveSubDepartments', actionName:'READ', moduleName:"SUBDEPARTMENT"},
    {api:'fetchSubDepartmentsForRegistration', actionName:'READ', moduleName:"SUBDEPARTMENT", isWhiteList:true},
    {api:'fetchSubDepartmentsHierarchy', actionName:'READ', moduleName:"SUBDEPARTMENT", isWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)
