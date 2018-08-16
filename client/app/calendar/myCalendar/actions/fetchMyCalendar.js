/**
 * Created by pankaj on 21/7/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';

export async function fetchMyCalendarActionHandler (month, year) {
  const result = await appClient.query({
    query: gql`
    query($month:Int, $year: Int) { 
      getMyCalendar(month: $month, year: $year) {
        days {
          date
          status
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
  const myCalendar = result.data.getMyCalendar;
  return myCalendar;
}

export async function fetchServiceCalendarActionHandler (portfolioId,month, year) {
  const result = await appClient.query({
    query: gql`
    query($portfolioId: String, $month:Int, $year: Int) { 
      getServiceProviderCalendar(portfolioId: $portfolioId,month: $month, year: $year) {
        days {
          date
          status
        }
      }
    }
    `,
    variables: {
      portfolioId: portfolioId,
      month: month?month:0,
      year: year?year:0
    },
    fetchPolicy: 'network-only'
  });
  const myCalendar = result.data.getServiceProviderCalendar;
  return myCalendar;
}

export async function fetchSessionDayActionHandler (orderId,sessionId, day, month, year ) {
  const result = await appClient.query({
    query: gql`
    query($orderId:String!, $sessionId: String!, $day: Int, $month: Int, $year: Int) { 
      getSessionDayAvailable(orderId: $orderId,sessionId:$sessionId,day:$day,month: $month, year: $year) {
        isAvailable
        slotTime
        status
        shift
      }
    }
    `,
    variables: {
      orderId,
      sessionId,
      day,
      month,
      year
    },
    fetchPolicy: 'network-only'
  });
  const myCalendar = result.data.getSessionDayAvailable;
  return myCalendar;
}


export async function bookUserServiceCardAppointmentActionHandler (userServiceCardAppointmentInfo) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($userServiceCardAppointmentInfo: userServiceCardAppointmentInfo!) { 
      bookUserServiceCardAppointment(userServiceCardAppointmentInfo: $userServiceCardAppointmentInfo) {
        success
        result
        code
      }
    }
    `,
    variables: {
      userServiceCardAppointmentInfo
    }
  });
  const myCalendar = result.data.bookUserServiceCardAppointment;
  return myCalendar;
}
