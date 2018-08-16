import gql from 'graphql-tag'
import {appClient} from "../../../../app/core/appConnection";

export async function storeSharedDetailsHandler(detailsInput) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($detailsInput: calendarInput){
        createSharedCalendar(detailsInput:$detailsInput) {
          success
          code
          result
        }
      }
    `,
    variables: {
      detailsInput
    }
  });
  const id = result.data.createSharedCalendar;
  return id;
}
