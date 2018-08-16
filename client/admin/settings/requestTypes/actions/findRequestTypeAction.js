import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findRequestTypeActionHandler(requestTypeId) {
 let did=requestTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindRequestType(_id:$id){
         id:_id
        requestName
        displayName
        isActive
        requestDesc
        transactionType
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.FindRequestType;
  return id
}
