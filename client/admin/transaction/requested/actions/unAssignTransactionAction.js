import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function unAssignTransactionActionHandler(transactionId) {

  const result = await client.mutate({
    mutation: gql`
     mutation($transactionId:String){
    unAssignTransaction(transactionId:$transactionId){
      success
      code
      result
    }
  }
    `,
    variables: {
      transactionId
    }
  })

  const id = result.data.unAssignTransaction;
  return id
}

