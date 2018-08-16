import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let UserTypesSchema = `
    type UserTypes
    {
      userTypeName  :String
      displayName   :String
      userTypeDesc  :String      
      communityCode :String
      communityName :String
      _id           :String
      createdBy     : String
      createdDate   : Date
      updatedBy     : String
      updatedDate   : Date
      isActive      :Boolean
    }
     input userTypeObject{
        userTypeName  :String,
        displayName   :String,
        userTypeDesc  :String,
        communityCode :String,
        communityName :String,
        createdBy       : String
        createdDate     : Date
        updatedBy       : String
        updatedDate     : Date
        isActive      :Boolean
    }
    
   type Mutation 
    {
        UpdateUserType(_id:String, userTypeName:String, displayName:String, userTypeDesc:String, communityCode :String, communityName :String, isActive:Boolean , moduleName:String, actionName:String):response
        createUserType(userType:userTypeObject, moduleName:String, actionName:String):response
    }
    type Query{
        FindUserType(_id:String): UserTypes
        FetchUserType(communityCode:String,displayAllOption:Boolean):[UserTypes]
        FetchUserTypeForMultiSelect(communityId:[String]):[UserTypes]   
        FetchUserTypeSelect:[UserTypes]
        FetchUserTypeList(communityCode:String):[UserTypes]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],UserTypesSchema]);
//FetchUserType1:[UserTypes]
let supportedApi = [
  {api:'FindUserType', actionName:'READ', moduleName:"USERTYPE"},
  {api:'FetchUserType', actionName:'READ', moduleName:"USERTYPE", isWhiteList:true},
  {api:'FetchUserTypeForMultiSelect', actionName:'READ', moduleName:"USERTYPE"},
  {api:'FetchUserTypeSelect', actionName:'READ', moduleName:"USERTYPE"},
  {api:'createUserType', actionName:'CREATE', moduleName:"USERTYPE"},
  {api:'UpdateUserType', actionName:'UPDATE', moduleName:"USERTYPE"},
  {api:'FetchUserTypeList', actionName:'READ', moduleName:"USERTYPE", isWhiteList:true},
];
MlResolver.MlModuleResolver.push(supportedApi)
