import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function getSessionDayAvailable(orderId, sessionId, day, month, year) {
  const result = await appClient.query({
    query: gql`
      query ($orderId:String!, $sessionId: String!, $day: Int, $month: Int, $year: Int) {
        getSessionDayAvailable( orderId:$orderId, sessionId: $sessionId, day: $day, month: $month, year: $year ) {
          
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
    }
  });
  const id = result.data.getSessionDayAvailable;
  return id;
}
