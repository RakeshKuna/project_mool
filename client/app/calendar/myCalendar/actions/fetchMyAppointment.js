
import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';

export async function fetchMyAppointmentActionHandler (profile, day, month, year) {
  const result = await appClient.query({
    query: gql`
    query($profileId: String!, $day: Int, $month: Int, $year: Int) { 
      fetchMyAppointment(profileId: $profileId, day: $day, month: $month, year: $year) {
        slot
        appointments {
          id
          type
          name
        }
      }
    }
    `,
    variables: {
      profileId: profile,
      day: day,
      month: month,
      year: year
    },
    fetchPolicy: 'network-only'
  });
  const myCalendar = result.data.fetchMyAppointment;
  return myCalendar;
}
