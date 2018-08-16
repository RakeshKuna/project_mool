import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function cancelUserServiceCardOrder(orderId) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation ($orderId: String!) {
        cancelUserServiceCardOrder(orderId:$orderId) {
            success,
            code,
            result
        }
      }
    `,
    variables: {
      orderId
    }
  });
  const id = result.data.cancelUserServiceCardOrder;
  return id;
}
