/**
 * Created by pankaj on 28/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function updateCalendarSettingActionHandler (profileId,calendarSetting) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($profileId:String, $calendarSetting: calendarSetting) {
        updateMyCalendarSetting(profileId:$profileId, calendarSetting:$calendarSetting) {
        success
        code
        result
      }
    }
    `,
    variables: {
      calendarSetting:calendarSetting,
      profileId: profileId
    }
  });
  const response = result.data.updateMyCalendarSetting;
  return response;
}
