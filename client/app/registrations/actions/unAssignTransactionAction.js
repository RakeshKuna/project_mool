import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function unAssignTransactionActionHandler(transactionId) {

  const result = await appClient.mutate({
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

