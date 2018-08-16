/**
 * Created by muralidhar on 14/02/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let Filters = `    
        
    type fieldListSpecificsOutput{
      departmentId : String
      subDepartmentId : String
      roleId : [String]
      listValueId : [String]
    }
    
    type filterFieldOutput{
      fieldName : String
      displayName : String
      isActive : Boolean
      isDynamic:Boolean
      fieldType : String
      fieldResolverName:String
      isCustom:Boolean
      clearFields:[String]
      fieldList : [fieldListSpecificsOutput]
    }
    
    
    
    type Filters{
        _id:String
       filterName:String
       filterDescription:String
       isActive:Boolean
        moduleName:String
       filterFields:[filterFieldOutput]
    }
    
    input fieldListSpecifics{
      departmentId : String
      subDepartmentId : String
      roleId : [String]
      listValueId : [String]
    }
    input filterField{
      fieldName : String
      displayName : String
      isActive : Boolean
      isDynamic:Boolean
      fieldType : String
      fieldResolverName : String
      fieldList : [fieldListSpecifics]
      isCustom:Boolean,
      clearFields : [String]
    }
    
    type FiltersDropData{
          label:String,
          value:String
    }
      
 
    
    input filter{
       filterName:String
       filterDescription:String
       isActive:Boolean
       moduleName:String
       filterFields:[filterField]
    }
    
    type GenericFilter {
         fieldName: String,
         value: String,
         fieldType:String,
         operator:String
    }
    
    type Mutation{
       updateFilter(filterId:String, filterObject: filter,moduleName:String, actionName:String):response
       
    }
    
    type Query{
        findFilters:[Filters]
        fetchModuleFilters(moduleName:String) : Filters
        fetchFilterListDropDown(moduleName:String!):[FiltersDropData]
        fetchSelectedFilterListDropDown(moduleName:String!,list:[fieldListSpecifics],filteredListId : [GenericFilter],fieldActive:String,moduleType:String!):[FiltersDropData]
        fetchSelectedFilterData(id:String) : Filters
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],Filters]);

let supportedApi = [
  {api:'findFilters', actionName:'READ', moduleName:"FILTERS"},
  {api:'fetchModuleFilters', actionName:'READ', moduleName:"FILTERS", isWhiteList:true},
  {api:'fetchSelectedFilterListDropDown', actionName:'READ', moduleName:"FILTERS", isWhiteList:true},
  {api:'fetchSelectedFilterData', actionName:'READ', moduleName:"FILTERS", isWhiteList:true},
  {api:'fetchFilterListDropDown', actionName:'READ', moduleName:"FILTERS", isWhiteList:true},
  {api:'createRequestss', actionName:'CREATE', moduleName:"FILTERS"},
  {api:'updateFilter', actionName:'UPDATE', moduleName:"FILTERS"}
]
MlResolver.MlModuleResolver.push(supportedApi)
