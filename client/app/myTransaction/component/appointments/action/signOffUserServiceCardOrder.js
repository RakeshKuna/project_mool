import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function signOffUserServiceCardOrder(orderId) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation ($orderId: String!) {
        signOffUserServiceCardOrder(orderId:$orderId) {
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
  const id = result.data.signOffUserServiceCardOrder;
  return id;
}
