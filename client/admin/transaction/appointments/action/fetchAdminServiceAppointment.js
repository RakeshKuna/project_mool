import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function fetchAdminServiceAppointment(orderId) {
  const result = await client.mutate({
    mutation: gql`
      mutation ($orderId: String!) {
        fetchAdminServiceAppointment( orderId: $orderId ) {
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
  const id = result.data.fetchAdminServiceAppointment;
  return id;
}
