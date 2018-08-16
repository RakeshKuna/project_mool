/**
 * Created by pankaj on 20/8/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';

export async function fetctOfficeDayAppointmentActionHandler (userId, profile, day, month, year) {
  const result = await appClient.query({
    query: gql`
    query($userId: String, $profileId: String!, $day: Int, $month: Int, $year: Int) { 
      fetchMyAppointment(userId: $userId, profileId: $profileId, day: $day, month: $month, year: $year) {
        slot
        shift
        isHoliday      
        appointments {
          id
          type
          name
          status
          isRescheduled
        }
      }
    }
    `,
    variables: {
      userId: userId,
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
