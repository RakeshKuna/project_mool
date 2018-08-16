import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findTransactionTypeActionHandler(TransactionTypeId) {
 let did=TransactionTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindTransaction(_id:$id){
         id:_id
        transactionName
        transactionDisplayName
        isActive
        transactionDescription
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.FindTransaction;
  return id
}
