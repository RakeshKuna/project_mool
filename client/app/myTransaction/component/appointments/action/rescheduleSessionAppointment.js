import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function rescheduleUserServiceCardAppointment(appointmentId, userServiceCardAppointmentInfo) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation ($appointmentId: String!, $userServiceCardAppointmentInfo: userServiceCardAppointmentInfo!) {
        rescheduleUserServiceCardAppointment(appointmentId:$appointmentId, userServiceCardAppointmentInfo:$userServiceCardAppointmentInfo ) {
            success,
            code,
            result
        }
      }
    `,
    variables: {
      appointmentId,
      userServiceCardAppointmentInfo
    }
  });
  const id = result.data.rescheduleUserServiceCardAppointment;
  return id;
}
