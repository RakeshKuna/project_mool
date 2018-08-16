/**
 * Created by birendra on 4/7/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

/**
 * updateCalendarWorkingDayActionHandler() --> construct the query to save in db
 * @param workingDay --> updated object
 * @returns {Promise.<*>} --> succeed response send to component
 */
export async function updateCalendarWorkingDayActionHandler(profileId, workingDay) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($profileId:String, $workingDay: calendarSettingWorkingDays) {
      updateMyCalendarWorkingDay(profileId: $profileId, workingDay: $workingDay) {
        success
        code
        result
      }
    }
    `,
    variables: {
      profileId: profileId,
      workingDay: workingDay,
    }
  });
  const response = result.data.updateMyCalendarWorkingDay;
  return response;
}

/**
 * updateCalendarWorkingDaysActionHandler() --> construct the query to save in db
 * @param workingDays --> updated array of objects
 * @returns {Promise.<*>} --> succeed response send to component
 */
export async function updateCalendarWorkingDaysActionHandler(profileId, workingDays) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($profileId: String, $workingDays: [calendarSettingWorkingDays]) {
      updateMyCalendarWorkingDays(profileId: $profileId, workingDays: $workingDays) {
        success
        code
        result
      }
    }
    `,
    variables: {
      profileId : profileId,
      workingDays: workingDays
    }
  });
  const response = result.data.updateMyCalendarWorkingDays;
  return response;
}
