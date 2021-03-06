/**
 * Created by pankaj on 25/7/17.
 */
import gql from "graphql-tag";
import { client } from "../../../../../core/apolloConnection";

export async function requestedAppointmentActionHandler() {
  const result = await client.query({
    query: gql`
      query {
        fetchBeSpokeServices {
        _id,
        displayName        
      }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchBeSpokeServices;
  return data;
}


export async function servicesForAppointmentsActionHandler() {
  const result = await client.query({
    query: gql`
      query {
        fetchServicesForAppointments {
        _id
        name        
      }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchServicesForAppointments;
  return data;
}


