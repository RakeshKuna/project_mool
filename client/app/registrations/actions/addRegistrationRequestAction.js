import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function addReqgistrationRequestInfo(requestDetails) {
  let transaction = {}
  requests = requestDetails;
  const result = await appClient.mutate({
    mutation: gql`
      mutation($requests:requests){
          createRequests(requests:$requests) {
            success
            code
            result
          }
          
        }
    `,
    variables: {
      requests
    }
  })
  const id = result.data.createTransaction;
  return id
}
