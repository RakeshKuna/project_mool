/**
 * Created by pankaj on 20/8/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';
export async function fetchOfficeMemberCalendarActionHandler (userId, profileId, month, year) {
  const result = await appClient.query({
    query: gql`
    query($userId:String!, $profileId:String!, $month:Int, $year: Int) { 
      fetchOfficeMemberAppointmentCounts(userId:$userId, profileId:$profileId, month: $month, year: $year) {
        events{
          date
          userId
          profileId
          count
        }
        days{
          isActive
          start
          end
          type
        }
      }
    }
    `,
    variables: {
      userId: userId,
      profileId: profileId,
      month: month,
      year: year
    },
    fetchPolicy: 'network-only'
  });
  const officeMemberCalendar = result.data.fetchOfficeMemberAppointmentCounts;
  return officeMemberCalendar;
}
