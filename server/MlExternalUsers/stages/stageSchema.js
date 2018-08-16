/**
 * Created by pankaj on 17/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";


let stage=`
  type Stage {
    _id: String
    userId: String
    profileId: String
    resourceId: String
    resourceType: String
    resourceStage: String
    createdAt: Date
    updatedAt: Date
    transactionLogStatus: [TransactionStatus]
    }
    
   type TransactionStatus {
    transactionId: String
    status: String
  }
  
  
  input stage {
    resourceId: String
    resourceType: String
    resourceStage: String
    hasInvested: Boolean
    onBoardRequest: Boolean
    transactionLogStatus: [transactionStatus]
  }
  
   input transactionStatus {
    transactionId: String
    status: String
  }

    type Query {
        fetchStages:[Stage]
        fetchStage(id:String):Stage
    }

    type Mutation {
        createStage(stage:stage):response
        updateStage(stageId:String, stage:stage):response
        updateOnBoardStage(transactionLogId: String, transactionType: String, status: String):response
        fetchOnBoardByTransaction(transactionId:String): response
    }
`;


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], stage]);

let supportedApi = [
  {api:'fetchStages', actionName:'READ', moduleName:"OFFICE", isWhiteList:true},
  {api:'fetchStage', actionName:'READ', moduleName:"OFFICE", isWhiteList:true},

  {api:'createStage', actionName:'CREATE', moduleName:"OFFICE", isAppWhiteList:true},
  {api:'updateStage', actionName:'UPDATE', moduleName:"OFFICE", isAppWhiteList:true},
  {api:'updateOnBoardStage', actionName:'UPDATE', moduleName:"OFFICE", isAppWhiteList:true}
]

MlResolver.MlModuleResolver.push(supportedApi)

