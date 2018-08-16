/**
 * Created by pankaj on 4/8/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";
export async function fetchSessionDayActionHandler (orderId,sessionId, day, month, year ) {
  const result = await appClient.query({
    query: gql`
    query($orderId:String!, $sessionId: String!, $day: Int, $month: Int, $year: Int) { 
      getSessionDayAvailable(orderId: $orderId,sessionId:$sessionId,day:$day,month: $month, year: $year) {
        isAvailable
        slotTime
        status
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
