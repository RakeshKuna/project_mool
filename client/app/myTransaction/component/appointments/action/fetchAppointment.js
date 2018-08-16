import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function fetchAppAppointmentByTransactionId(transactionId) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation ($transactionId: String!) {
        fetchAppAppointmentByTransactionId( transactionId: $transactionId ) {
            success,
            code,
            result
        }
      }
    `,
    variables: {
      transactionId: transactionId
    }
  });
  const id = result.data.fetchAppAppointmentByTransactionId;
  return id;
}
