

import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let EmployeeType = `        
    
    type EmployeeType{
      employmentName :String
      employmentDisplayName :String
      aboutEmployment: String
      _id:String
      isActive:Boolean
    }
    type Mutation{
        CreateEmployeeType(_id:String,employmentName:String,employmentDisplayName:String,aboutEmployment:String,isActive:Boolean):String
        UpdateEmployeeType(_id:String,employmentName:String,employmentDisplayName:String,aboutEmployment:String,isActive:Boolean):String
    }
    type Query{
      FindEmployeeType(_id:String):EmployeeType
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],EmployeeType]);
