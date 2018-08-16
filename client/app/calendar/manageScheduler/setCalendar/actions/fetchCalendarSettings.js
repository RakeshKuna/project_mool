/**
 * Created by pankaj on 28/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function fetchCalendarSettingsActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchMyCalendarSetting(profileId: $profileId) {
        _id
        hasAppointment
        slotDuration{
          hours
          minutes
        }
        appointmentCountPerSlots
        slotBreakTime
        isOverlappingSchedule
        workingDays{
          isActive
          dayName
          lunch{
            isActive
            start
            end
          }
          slots{
            isActive
            start
            end
          }
        }
        vacations{
          vacationId
          isActive
          start
          end
          type
          note
          isAllowBooking
          isAutoCancelAppointment
        }
      }
    }
    `,
    variables: {
      profileId:profileId
    },
    fetchPolicy: 'network-only'
  });
  const settings = result.data.fetchMyCalendarSetting;
  return settings;
}
