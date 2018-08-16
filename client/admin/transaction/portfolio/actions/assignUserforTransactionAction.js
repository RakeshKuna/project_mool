import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function assignUserForTransactionAction(module,params,transactionId,transactionType,operation) {
  const result = await client.mutate({
    mutation: gql`
     mutation($module:String,$params:transactionParams,$transactionType:String,$operation:String,$transactionId:[String]){
    updateGenericTransaction(module:$module,params:$params,transactionType:$transactionType,operation:$operation,transactionId:$transactionId){
      success
      code
      result
    }
  }
    `,
    variables: {
      module:module,
      params:{assignmentParams:params},
      operation:operation,
      transactionType:transactionType,
      transactionId
    }
  })
  const id = result.data.updateGenericTransaction;
  return id
}


export async function unAssignUserForTransactionAction(module,transactionId,transactionType,operation) {
  const result = await client.mutate({
    mutation: gql`
     mutation($module:String,$params:transactionParams,$transactionType:String,$operation:String,$transactionId:[String]){
    updateGenericTransaction(module:$module,params:$params,transactionType:$transactionType,operation:$operation,transactionId:$transactionId){
      success
      code
      result
    }
  }
    `,
    variables: {
      module:module,
      params:null,
      operation:operation,
      transactionType:transactionType,
      transactionId
    }
  })
  const id = result.data.updateGenericTransaction;
  return id
}

export async function selfAssignUserForTransactionAction(module,transactionId,transactionType,operation) {
  const result = await client.mutate({
    mutation: gql`
     mutation($module:String,$params:transactionParams,$transactionType:String,$operation:String,$transactionId:[String]){
    updateGenericTransaction(module:$module,params:$params,transactionType:$transactionType,operation:$operation,transactionId:$transactionId){
      success
      code
      result
    }
  }
    `,
    variables: {
      module:module,
      params:null,
      operation:operation,
      transactionType:transactionType,
      transactionId
    }
  })
  const id = result.data.updateGenericTransaction;
  return id
}

export async function validateTransaction(transactionId,collection,assignedUserId) {
  const result = await client.query({
    query: gql`
     query($transactionId:String,$collection:String,$assignedUserId:String){
    validateTransaction(transactionId:$transactionId,collection:$collection,assignedUserId:$assignedUserId){
      success
      code
      result
    }
  }
    `,
    variables: {
      transactionId:transactionId,
      collection:collection,
      assignedUserId:assignedUserId
    }
  })
  const id = result.data.validateTransaction;
  return id
}

export async function validateAssignmentsDataContext(data,userId) {
  const result = await client.query({
    query: gql`
     query($data:[transactionData],$userId:String){
      validateAssignmentsDataContext(data:$data,userId:$userId){
        success
        code
        result
      }
     }
    `,
    variables: {
      data,
      userId
    }
  })
  const id = result.data.validateAssignmentsDataContext;
  return id
}
