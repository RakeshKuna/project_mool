import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function cancelUserServiceCardAppointment(appointmentId) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation ($appointmentId: String!) {
        cancelUserServiceCardAppointment(appointmentId:$appointmentId) {
            success,
            code,
            result
        }
      }
    `,
    variables: {
      appointmentId      
    }
  });
  const id = result.data.cancelUserServiceCardAppointment;
  return id;
}
