import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateStusForTransactionActionHandler(requestsInfo,statusInfo) {
  let status = statusInfo
    let requestsId=requestsInfo

  const result = await client.mutate({
    mutation: gql`
         mutation($requestsId:String,$status:String){
        updateRequestsStatus(requestsId:$requestsId,status:$status) {
          success
          code
          result
        }
      }
    `,
    variables: {
      status,
      requestsId
    }
  })
  const id = result.data.updateRequestsStatus;
  return id
}
