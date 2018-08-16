import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function selfAssignTransactionAction(transactionId) {
  const result = await appClient.mutate({
    mutation: gql`
     mutation($transactionId:String){
    selfAssignTransaction(transactionId:$transactionId){
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

  const id = result.data.selfAssignTransaction;
  return id
}
