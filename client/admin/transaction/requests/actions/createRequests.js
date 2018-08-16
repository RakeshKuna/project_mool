import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function createRequestsActionHandler(requestDetails) {
  let transaction = {}
  requests = requestDetails;
  const result = await client.mutate({
    mutation: gql`
    mutation ($requests: requestsInput) {
     createRequestss(requests: $requests) {
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
  const id = result.data.createRequestss;
  return id;
}
