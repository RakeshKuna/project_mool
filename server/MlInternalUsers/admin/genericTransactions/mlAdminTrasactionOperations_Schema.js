import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let transactOperations = `

input transactionParams{  
   allocation        :   allocationInput
   status            :   String
   assignmentParams  :   assignmentParams
}

input assignmentParams{
       cluster        : String
       chapter        : String
       subChapter     : String
       community      : String
       department     : String
       subDepartment  : String
       role           : String
       user           : String      
    }

type Mutation {
  updateGenericTransaction(module: String,params:transactionParams,transactionType:String,operation:String,transactionId:[String]):response
}`

MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'],transactOperations]);
let supportedApi = [
  {api:'updateGenericTransaction', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)
