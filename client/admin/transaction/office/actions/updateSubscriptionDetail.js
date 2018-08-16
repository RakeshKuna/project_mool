/**
 * Created by pankaj on 7/6/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateSubcriptionDetail(transId, subcriptionData) {
  const result = await client.mutate({
    mutation: gql`
        mutation ($id:String, $orderSubscriptionDetail: orderSubscriptionDetail) {
        updateOfficeTransactionOrderSubscriptionDetail(id:$id, orderSubscriptionDetail: $orderSubscriptionDetail) {
          success
          code
          result
        }
      }
    `,
    variables: {
      id: transId,
      orderSubscriptionDetail:subcriptionData
    },
    fetchPolicy: 'network-only'
  });
  console.log(result);
  const id = result.data.updateOfficeTransactionOrderSubscriptionDetail;
  return id
}
