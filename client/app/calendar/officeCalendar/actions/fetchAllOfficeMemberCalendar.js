
/**
 * Created by pankaj on 20/8/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';
export async function fetchAllOfficeMemberCalendarActionHandler ( month, year) {
  const result = await appClient.query({
    query: gql`
    query($month:Int, $year: Int) { 
      fetchAllOfficeMemberAppointmentCounts(month: $month, year: $year) {
        events{
          date
          count
        }
      }
    }
    `,
    variables: {
      month: month,
      year: year
    },
    fetchPolicy: 'network-only'
  });
  const allOfficeMemberCalendar = result.data.fetchAllOfficeMemberAppointmentCounts;
  return allOfficeMemberCalendar;
}
