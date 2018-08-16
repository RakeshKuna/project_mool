/**
 * Created by Birendra on 18/08/17.
 */
import gql from "graphql-tag";
import { client } from "../../../../../core/apolloConnection";

export async function updateAppointmentActionHandler(appointmentId, status) {
  const result = await client.mutate({
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
