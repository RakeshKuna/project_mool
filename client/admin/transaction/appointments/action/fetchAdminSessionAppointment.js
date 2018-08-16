import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function fetchAdminSessionAppointment(orderId) {
  const result = await client.mutate({
    mutation: gql`
      mutation ($orderId: String!) {
        fetchAdminSessionAppointment( orderId: $orderId ) {
            success,
            code,
            result
        }
      }
    `,
    variables: {
      orderId:orderId
    }
  });
  const id = result.data.fetchAdminSessionAppointment;
  return id;
}
