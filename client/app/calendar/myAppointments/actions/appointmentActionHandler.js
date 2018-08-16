/**
 * Created by Birendra on 18/08/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../core/appConnection";

export async function updateAppointmentActionHandler(appointmentId, status) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($appointmentId: String, $status: String){
        updateAppointmentByStatus(appointmentId: $appointmentId, status: $status){
        success
        code
        result
      }
      }
    `,
    variables: {
      appointmentId,
      status
    }
  });
  const resp = result.data.updateAppointmentByStatus;
  return resp
}
