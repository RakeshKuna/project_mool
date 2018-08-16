import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addReqgistrationRequestInfo(requestDetails) {
  let transaction = {}
  requests = requestDetails;
  const result = await client.mutate({
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
