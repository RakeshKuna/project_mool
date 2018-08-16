/**
 * Created by pankaj on 4/8/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";
export async function fetchServiceCalendarActionHandler (portfolioId,month, year,orderId) {
  const result = await appClient.query({
    query: gql`
    query($portfolioId: String, $month:Int, $year: Int, $orderId: String) { 
      getServiceProviderCalendar(portfolioId: $portfolioId,month: $month, year: $year, orderId: $orderId) {
        expiryDate
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
      year: year?year:0,
      orderId : orderId ? orderId : ''
    },
    fetchPolicy: 'network-only'
  });
  const myCalendar = result.data.getServiceProviderCalendar;
  return myCalendar;
}
