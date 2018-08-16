/**
 * Created by pankaj on 18/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function updateStageActionHandler(stageId,stage) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($stageId:String,$stage:stage){
        updateStage(stageId:$stageId,stage:$stage){
          success
          result
        }
      }
    `,
    variables: {
      stageId:stageId,
      stage: stage
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.updateStage;
  return id
}


export async function updateStageForOnBoardActionHandler(transactionLogId,transactionType, status) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($transactionLogId:String,$transactionType:String,$status:String){
        updateOnBoardStage(transactionLogId:$transactionLogId,transactionType:$transactionType, status:$status){
          success
          result
        }
      }
    `,
    variables: {
      transactionLogId,
      transactionType,
      status
    }
  })
  const id = result.data.updateOnBoardStage;
  return id
}

export async function fetchOnBoardByTransaction(transactionLogId) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($transactionLogId:String){
        fetchOnBoardByTransaction(transactionId:$transactionLogId){
          result
          success
          result
        }
      }
    `,
    variables: {
      transactionLogId
    }
  })
  const id = result.data.fetchOnBoardByTransaction;
  return id
}
