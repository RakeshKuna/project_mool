/**
 * Created by birendra on 6/7/17.
 */


import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

/**
 * updateCalendarVacationActionHandler() --> construct the query to save in db
 * @param vacation --> updated object
 * @returns {Promise.<*>} --> succeed response send to component
 */
export async function updateCalendarVacationActionHandler(profileId, vacation,isAutoCancelAppointment) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($profileId: String, $vacation: calendarSettingVacation, $isAutoCancelAppointment: Boolean) {
      updateMyCalendarVacation(profileId: $profileId, vacation: $vacation, isAutoCancelAppointment: $isAutoCancelAppointment) {
        success
        code
        result
      }
    }
    `,
    variables: {
      profileId,
      vacation
    }
  });
  const response = result.data.updateMyCalendarVacation;
  return response;
}

/**
 * updateCalendarVacationByIdActionHandler() --> construct the query to save in db
 * @param vacation --> updated object
 * @returns {Promise.<*>} --> succeed response send to component
 */
export async function updateCalendarVacationByIdActionHandler(profileId, vacation, vacationId,isAutoCancelAppointment) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($profileId:String, $vacation: calendarSettingVacation, $vacationId: String, $isAutoCancelAppointment: Boolean) {
      updateCalendarVacationByVacationId(profileId: $profileId, vacation: $vacation, vacationId: $vacationId, isAutoCancelAppointment: $isAutoCancelAppointment) {
        success
        code
        result
      }
    }
    `,
    variables: {
      profileId,
      vacation,
      vacationId
    }
  });
  const response = result.data.updateCalendarVacationByVacationId;
  return response;
}
